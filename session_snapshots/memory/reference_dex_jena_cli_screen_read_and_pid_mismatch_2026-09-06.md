---
name: reference-dex-jena-cli-screen-read-and-pid-mismatch-2026-09-06
description: "덱스·제나 CLI 화면은 moa_console.ps1로 읽기전용 조회 가능하고, cli_windows.json의 pid는 실제 프로세스와 어긋날 수 있다"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 88fde9f8-c7d0-4a60-8b88-c9610ed61682
  modified: 2026-09-05T20:10:25.398Z
---

**세션 시작 시 `cli_windows.json`의 pid가 실제 살아있는 프로세스인지 먼저 대조할 것.** 이게 어긋나면 다리가 덱스·제나에게 원리적으로 못 닿고, 승인 카드도 한 장도 안 나간다.

 2026-09-06 05:07 실측: 재부팅 후 덱스 CLI가 코덱스 **업데이트 확인창**(`Update available! 0.153.3 -> 0.153.4 / 1. Update now / 2. Skip / 3. Skip until next version`)에 멈춰 프롬프트까지 못 갔다. 다리는 형 메시지를 `verdict=trigger`로 받았지만 아무 반응이 없었다. 형이 인사를 던지실 때까지 아무도 몰랐다.

**★진짜 1차 원인은 모달이 아니라 죽은 pid였다.** `cli_windows.json`의 덱스 pid를 실제값(24124)으로 고치자 **28초 만에 승인 카드가 자동 발행**됐다(`[win] 상시감시: 승인창 발견 ... 근거="Press enter to continue" 선택지=3` → 승인채널 `1542343357093650442`). 즉 상시 승인 감시(`APPROVAL_WATCH_SECONDS=10`)는 코덱스 업데이트 창도 정상적으로 승인창으로 판정한다 — 처음에 "판정 실패해서 안 온다"고 본 것은 틀렸다. **읽기 자체가 실패하고 있었을 뿐이다.**

부수 확인: 발행된 카드에 `2. Skip` 버튼이 빠졌다(화면엔 1·2·3이 다 있는데 카드엔 1·3만). 원인 미확인.

**읽는 법(읽기전용·상태변경 없음, 창 포커스 불필요):**
`powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\user\.moa\moa_console.ps1 -TargetPid <pid> -OutFile <out.txt>`
(SendText 없이 부르면 화면만 긁는다. 반드시 별도 powershell 프로세스로 — AttachConsole이 호출자 콘솔을 바꾼다.)

**★pid를 `cli_windows.json`에서 그대로 믿지 말 것.** 2026-09-06 실측 — 그 파일의 덱스 pid `24116`은 **이미 죽은 pid**였고(`ATTACH FAILED err=87`), 살아있는 실제 `codex.exe`는 **24124**였다. 제나는 일치했다(1944). 판정은 `Get-CimInstance Win32_Process -Filter "Name='codex.exe' OR Name='agy.exe'"`로 **이름 기준 재조회**해서 할 것. [[reference_pid_reuse_defeats_liveness_check_2026-08-26]]

**부수 확인**: 두 CLI는 같은 WindowsTerminal(pid 21668)의 두 탭이다 [[reference_window_title_is_not_an_identifier_2026-08-26]]. 화면 텍스트가 재부팅 후에도 남는 이유는 `cli_windows.json`의 `conversation` ID로 대화를 **이어받기** 때문(기동 스크립트 `-Fresh`를 주면 새 대화). 다만 다리가 읽는 건 여전히 보이는 화면뿐 [[reference_bridge_reads_screen_only_no_scrollback_2026-08-26]].

**미해결**: 형이 "업데이트 확인창이 뜨면 어떻게 하기로 했지? 규칙이 있지"라고 하셨는데, 쉐어룰·부트스트랩·.moa 문서·랩실 md·워커 AGENTS.md 전수 조회에서 **원문을 못 찾았다**(2026-09-06). 형께 다시 여쭤 확정되면 SHARED_RULES.md와 session_bootstrap.md 두 곳에 박을 것.
