---
name: reference_pid_reuse_defeats_liveness_check_2026-08-26
description: "제나·덱스 생존 확인이 PID만 보고 이름을 안 봐서, 죽은 뒤 PID가 재활용되면 영원히 ALIVE로 보고된다"
metadata: 
  node_type: memory
  type: reference
  originSessionId: a4ce04c1-cb1e-4fec-98a3-271369664ed0
  modified: 2026-08-25T23:35:31.907Z
---

2026-08-26 재부팅 후 **제나(`agy.exe`)가 안 살아났는데 모든 기록이 `ALIVE`** 로 찍혀 있었다. 부팅 복구 로그도 *"jena → 이미 실행 중 pid=25704"* 라며 재기동을 건너뛰었다.

**원인 확정** — `C:\Users\user\.moa\moa_cli_window.ps1` **58행**:
```powershell
function Alive($pid_) { return [bool](Get-Process -Id $pid_ -ErrorAction SilentlyContinue) }
```
**그 PID에 뭔가 살아 있는지만 보고, 그게 `agy.exe`/`codex.exe` 인지는 안 본다.**
제나가 죽으면서 PID 25704가 비었고, 윈도우가 그 번호를 **`RuntimeBroker`** 에 재할당했다. 112행 `if ($cur -and (Alive $cur.pid)) { "이미 실행 중"; exit 0 }` 이 그걸 제나로 착각했다.

**★한 번 죽으면 영원히 "살아있음"으로 보고된다.** PID가 재활용되는 한 계속. 조용한 단일 실패점이고, **덱스도 같은 코드 경로를 쓴다**(그날은 PID가 안 겹쳐 우연히 살아났을 뿐).

**되살리는 법**: `cli_windows.json` 에서 그 항목을 지운 뒤 `moa_cli_window.ps1 -Who jena` (안 지우면 "이미 실행 중"이라며 거부한다). 창은 **반드시 이 스크립트로만** 띄운다 — [[reference_cli_window_launch_must_use_script_2026-08-24]].

**검증하는 법 (이 사고가 가르쳐준 것)**
1. `Get-Process -Id <pid>` 의 **`Name`·`Path` 까지** 확인한다. PID 존재만으로 판정하지 않는다.
2. **중계기로 실제 attach** 해본다(`wincon.mjs` 의 `resolvePid`+`capturePane`). 내 도구 말고 **실제 소비자**로 재는 것 — [[reference_cli_window_launch_must_use_script_2026-08-24]] 와 같은 교훈.

**근본 수정은 미착수**(형 판단 대기) — `Alive()` 에 이름 검사를 더하면 되지만, **덱스·제나 둘 다 못 뜨게 만들 위험**이 있어 작업 없는 때 고쳐야 한다.

관련: [[reference_dex_jena_hidden_window_launcher_2026-08-23]] — 제나는 창 손잡이를 못 재서 "창 0개" 보고를 믿으면 안 된다는 별개 함정도 있다.
