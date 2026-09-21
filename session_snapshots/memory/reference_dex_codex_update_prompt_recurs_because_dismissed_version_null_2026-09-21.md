---
name: reference_dex_codex_update_prompt_recurs_because_dismissed_version_null_2026-09-21
description: 덱스 CLI가 재부팅마다 코덱스 업데이트창에 멈추는 원인 확정 — version.json의 dismissed_version이 null이라 매 기동 때 다시 묻는다
metadata: 
  node_type: memory
  type: reference
  originSessionId: 78a64150-c81b-4263-9204-f4351af3460e
  modified: 2026-09-20T19:12:48.426Z
---

**덱스 CLI가 04:00 재부팅마다 코덱스 업데이트 확인창에 멈추는 건 사고가 아니라 구조다.**

[확인: `/c/Users/user/.codex/version.json` 직접 조회 2026-09-21 04:14]
```json
{"latest_version":"0.155.1","last_checked_at":"2026-09-20T19:04:28Z","dismissed_version":null}
```

- `last_checked_at` 이 **CLI 기동 2초 뒤**로 찍힌다(codex.exe pid 11120 기동 04:04:26 → 체크 04:04:28). 즉 **뜰 때마다 새로 묻는다.**
- `dismissed_version` 이 **null** = **"3. Skip until next version" 을 누른 적이 한 번도 없다.** 그래서 영원히 재발한다.
- [확인: codex.exe(298MB) `grep -a` 직접 대조] 바이너리에 `Skip until next version` 1건 · `dismissed_version` 4건 — **3번 선택지가 이 칸을 채우는 게 맞다.**
- `config.toml` 에는 업데이트 관련 키가 **없다**(전수 grep). `.codex-global-state.json` 은 **일렉트론 데스크톱 앱 상태**라 CLI 업데이트창과 무관하다.

**실측 재발 이력** — 승인채널 1542343357093650442 카드 5건 중 같은 업데이트창이 **09-11 · 09-19 · 09-20 · 09-21**.
최근 둘은 KST **04:0x~04:1x = 04:00 재부팅 직후**다. 09-20 건은 형 무응답으로 **덱스가 24시간 통째로 멈췄다.**

**감시는 정상이다** — 창 뜨고 **8초 만에** 승인 카드가 자동 발행된다(04:04:26 기동 → 04:04:34 카드).
2026-09-06처럼 pid가 어긋나 카드가 안 나가는 상태가 **아니다** → [[reference_dex_jena_cli_screen_read_and_pid_mismatch_2026-09-06]].
**막힌 건 오직 사람의 클릭 한 번**이다. 브리지가 봇 글을 `verdict=ignore` 해서 클로는 덱스에게 말을 걸 수도 대신 누를 수도 없다 → [[reference_bridge_ignores_all_bot_messages_2026-09-18]].

**화면 읽는 법(읽기전용)**: `moa_console.ps1 -TargetPid <pid> -OutFile <out>`. pid 는 `cli_windows.json` 말고
`Get-CimInstance Win32_Process -Filter "Name='codex.exe' OR Name='agy.exe'"` 로 **이름 기준 재조회**할 것.

**결재 `REQ-20260921-DEX-01`** — 기동 전 `dismissed_version` 을 채우는 후크. 선택 ①그대로 ②후크만 ③후크+주1회 계획 업데이트(추천).
★후크를 넣어도 **이미 떠 있는 창은 안 닫힌다** — 그날 분은 여전히 클릭이 필요하다.

★2026-09-06 에 형이 *"업데이트 확인창 뜨면 어떻게 하기로 했지, 규칙이 있지"* 라고 하셨는데 원문을 못 찾았던 그 건이다. **규칙 문서는 여전히 못 찾았고**, 대신 **기계적 원인**이 이걸로 확정됐다.

**★이걸 파다가 내가 또 틀렸다**: `strings` 로 바이너리를 뒤져 **"0건"** 이 나왔는데 **`strings` 자체가 이 환경에 없었다.**
그대로 믿었으면 "코덱스엔 그런 설정이 없다"고 형께 올릴 뻔했다. `grep -a` 로 다시 재니 4건.
→ [[feedback_my_own_checks_fail_toward_false_positives_2026-09-20]] · [[feedback_count_window_before_trusting_zero_matches_2026-09-19]]
