---
name: reference_dex_jena_cli_window_restart_gotchas_2026-08-30
description: "moa_cli_window.ps1로 덱스·제나 창 재시작할 때 상태파일 락 함정, moa_console.ps1로 Enter 제출이 안 먹는 경우와 EnterOnly 차단"
metadata:
  type: reference
  originSessionId: 7234edbe-5f3b-4050-8a20-bf11e27ddba4
  modified: 2026-08-30T14:32:25.155Z
---

`C:\Users\user\.moa\moa_cli_window.ps1`(-Who dex|jena, -Status, -Kill)은 브리지 데몬과 별개로 CLI 창 프로세스(codex.exe/agy.exe)만 재시작하는 정공법이다. `sessions.json`(덱스: `D:\Develop\dex-jena-bridge\data\sessions.json`, 제나: `data-jena`)에서 마지막 대화를 자동으로 이어받는다.

**함정 1 — 상태파일 락**: `-Kill` 후 재기동하면 스크립트 자신의 상태파일(`C:\Users\user\.moa\cli_windows.json`) 저장이 "다른 프로세스에서 사용 중" IOException으로 실패할 수 있다(2026-08-30 실측). 이때도 실제 CLI 프로세스는 정상적으로 떴을 수 있으니, `Get-CimInstance Win32_Process | Where CommandLine -match 'resume'`로 진짜 새 pid를 찾아서 `cli_windows.json`을 수동으로 고쳐줘야 `-Status`가 정확해진다.

**함정 2 — Enter 제출 실패**: `C:\Users\user\.moa\moa_console.ps1 -TargetPid <pid> -SendText '...' -OutFile out.txt`는 텍스트를 창 입력창에 넣는 데는 확실히 성공한다(WriteConsoleInputW 직접 호출). 그런데 창이 "Conversation interrupted" 배너를 띄운 상태에서는, 스크립트 기본값(Enter 자동 포함)으로 보내도 여러 번(3회+) 제출이 안 되고 텍스트만 입력창에 그대로 남았다(2026-08-30, 원인 미확인[추측]). `-EnterOnly`로 Enter만 따로 보내는 것도 시도했으나 **클로 세션 자체의 자동모드 분류기가 "Blocked by classifier"로 두 번 다 차단**했다 — 이 액션은 클로 세션에서 안정적으로 쓸 수 없다.

**How to apply**: 창이 입력은 됐는데 응답이 없으면, EnterOnly를 반복 시도하지 말고 바로 형에게 "그 창을 직접 클릭하고 Enter만 눌러달라"고 요청할 것. 이게 실제로 통하는 유일한 해결책이었다.
