---
name: reference_dex_jena_hidden_window_launcher_2026-08-23
description: 덱스·제나가 띄우는 GUI는 창이 안 보이고 턴 끝나면 죽는다 — 원인과 공용 실행기(launch_visible.ps1), 그리고 제나는 창 손잡이를 아예 못 잰다
metadata:
  type: reference
---

덱스·제나(워커 봇)가 **창 있는 프로그램을 못 띄우던** 문제. 2026-08-23 형 지시("크롬 브라우저에 챗gpt 열어봐")로 하루 종일 붙어서 해결.

## 겹쳐 있던 세 가지 (전부 실측)

**① 창 숨김이 손자까지 상속된다**
브리지가 워커를 spawn할 때 `windowsHide: true`를 준다 (`dex-jena-bridge/src/agy.mjs:78`, `src/codex.mjs:56` — 워커가 턴마다 띄우는 콘솔창이 형 화면에 번쩍이지 않게 하려고 넣은 것). 이게 워커가 띄우는 **손자 프로세스까지 상속**돼서 뭘 띄워도 `MainWindowHandle=0`.
실측 대조: 제나가 직접 띄운 메모장 7192 → handle 0 / 클로가 띄운 메모장 25100 → handle 14093174.
회피: `Start-Process -WindowStyle Normal` 을 **명시**하면 상속을 덮어쓴다(handle 199530 생성 확인).

**② 턴이 끝나면 띄운 프로그램도 같이 죽는다**
워커의 도구 실행 세션이 끝나면 프로세스 트리가 회수된다. 실측: 제나 크롬 PID 19996(14:51:20 기동, 창 정상) → 1분 안에 소멸.

**③ 해결 = 작업 스케줄러 경유**
`C:\Users\user\.moa\launch_visible.ps1` 신설. Task Scheduler가 대신 띄우면 워커 트리 **바깥**(부모=`svchost.exe`)에서 태어나므로 ①②가 동시에 풀린다.
검증: 제나가 이 실행기로 띄운 크롬 PID 26052 — 전용 프로필, 부모 svchost, 창 손잡이 1313480, **538초 생존**(턴 끝난 뒤에도).

## ★실행기 쓸 때 반드시 지킬 것

- **인자는 배열이 아니라 한 줄 문자열**(`-ArgumentString`)로 준다. `powershell -File` 경계를 지나면 배열이 **쉼표로 뭉쳐진 한 덩어리**가 된다 — 실측 `[0] = <--user-data-dir=...,--no-first-run,https://...>`. 크롬은 이 쓰레기를 프로필 경로로 받고 **조용히 포기**한다(프로세스만 뜨고 창 없음). 지금은 쉼표가 섞이면 실행기가 거부한다(exit 4).
- 같은 `--user-data-dir`을 쓰는 찌꺼기 프로세스만 골라 먼저 정리한다(형 크롬은 프로필이 달라 안 건드림 — 과잉살상 검사 통과).
- 판정은 `RESULT:` 줄과 `MainWindowHandle` 표로만. "에러 없이 끝났다"는 성공 근거가 아니다.

## ★★제나의 측정값은 창에 관해선 못 믿는다

**제나는 창 손잡이를 아예 못 본다.** 같은 프로세스를 두고 값이 갈렸다 —
- 제나가 잰 값: PID 15120 → `MainWindowHandle = 0`
- 클로가 잰 값: **같은 PID 15120 → `MainWindowHandle = 461486`, 제목 `.env.gemini - 메모장`**

`.NET MainWindowHandle`은 내부적으로 창 열거를 하는데 이게 **윈도우 스테이션 범위**라, 워커 쪽에서는 빈 값이 나온다. 그래서 제나의 "창 0개 / 실패" 보고 상당수가 **실제 실패가 아니라 못 본 것**이었다.
→ **창 관련 판정은 제나에게 시키지 말고 클로가 직접 재라.** 제나에겐 "출력만 그대로 가져와라, 판정하지 마라"로 지시.

관련: [[feedback_verify_measurement_before_declaring_failure]] · [[feedback_check_tool_can_false_pass]] · [[reference_dex_agents_md_drift_2026-08-21]] · [[reference_dex_jena_workdir_scope_2026-08-08]]

## 덱스는 아직 못 한다 — 상자(sandbox)가 원인, 형 결정 대기

제나는 되는데 **덱스만 안 된다.** 세 번 막혔고 **전부 같은 원인 하나**다:
1. `New-ScheduledTaskAction` → `액세스가 거부되었습니다` (HRESULT 0x80041003)
2. `Set-Content C:\Users\user\.moa\...` → `UnauthorizedAccessException`
3. `%TEMP%`에 쓴 `.cmd`를 `schtasks`가 못 찾음 → 샌드박스가 **쓰기를 가상화**한다

원인: `dex-jena-bridge/src/codex.mjs:7` 의 `SANDBOX_FLAGS = ['-s','workspace-write']` 가 **하드코딩**.
★2026-08-23 10:51 형 지시 **"둘다 상자 안에서 꺼내"** 가 **절반만 적용됐다** — 제나(agy)만 `AGY_SANDBOX` 설정으로 빼서 껐고 덱스는 손도 안 댔다. ([[reference_dex_agents_md_drift_2026-08-21]] 와 같은 계열 — 한쪽만 반영되고 아무도 모른다)

**클로가 덱스 샌드박스를 설정화하려 했으나 하네스 분류기가 차단했다**(보안 변경). 우회하지 않았고 파일은 그대로다.
→ **형 결정 대기.** ①덱스는 상자 유지 + 브라우저는 제나 전담(클로 추천, 지금 바로 가능) ②형이 직접 해제 명령 실행.
단 덱스는 이미 모든 도구를 승인 없이 자동 실행하므로, 상자까지 빼면 **자동 승인 + 경계 없음**이 된다.

## BlackHeart 프로필 (형 지시 2026-08-23 15:24)

*"제나 덱스 둘다 동일한 프로필로 오픈해야해"* + 스크린샷으로 **BlackHeart** 지정.
전용 빈 프로필(`.moa\chrome-jena`)은 **폐기** — 로그인이 없어 일을 못 한다.
- `dir='Default'` = **BlackHeart** / `Profile 1` = 박기효.SMDsolutions / `Profile 2` = 나눔엔
  (★[[reference_google_accounts_by_purpose]] 의 "Profile1=info.nanumn" 기재와 어긋난다 — 그 메모는 낡았을 수 있음)
- 쓰는 법: `-ArgumentString "--profile-directory=Default --new-window <URL>"`
- **`--user-data-dir` 을 형 프로필 경로로 주지 마라.** 실측으로 위험했다: 경로에 공백(`User Data`)이 있어 파싱이 깨지면서 안전장치가 빗나갔다. 그래서 정리 로직을 **허용목록(.moa 아래만)** 으로 바꿨다 — 금지목록은 파싱이 깨지면 뚫린다.
- 이 모드는 **기존 크롬에 창만 열고 새 프로세스는 죽는다.** "새 프로세스의 창"으로 재면 성공을 실패로 오독한다 — 창 손잡이 집합의 변화로 재야 한다.
