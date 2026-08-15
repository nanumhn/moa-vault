---
name: reference_console_window_close_kills_process_2026-08-15
description: cmd/powershell 콘솔창을 X로 닫으면 거기 붙은 프로세스(postgres DB, 데몬 등)도 같이 죽을 수 있다 — "창만 닫고 프로세스는 살아있다"고 형에게 잘못 안내했던 실수
metadata:
  type: reference
  originSessionId: 9aec50e3-ec92-4e7b-a0d6-3a64b520a762
  modified: 2026-08-14T23:35:06.994Z
---

빈 cmd 창(예: postgres DB를 `cmd /D /C "...postgres.exe ... >> log 2>&1"`로 띄운 것, 또는 `-WindowStyle Hidden`이 안 먹은 daemon의 conhost 창)을 형이 화면에서 여러 개 보고 있을 때, "화면에 아무것도 안 찍히는 빈 창이면 닫아도 뒤 프로세스는 안 죽는다"고 안내했다가 **직후에 스스로 정정**했다.

**Why:** Windows 콘솔은 창을 X로 닫으면 그 창에 붙은(attached) 프로세스 전체에 CTRL_CLOSE_EVENT를 보내고, 처리 안 하면 타임아웃 후 강제종료한다. cmd.exe가 콘솔의 소유 프로세스인 경우(예: postgres 래퍼) 창을 닫으면 cmd.exe와 그 자식(postgres.exe)까지 같이 죽는다. "출력이 안 보인다/비어있다"는 "안전하게 닫아도 된다"를 보장하지 않는다 — 오히려 실서비스(DB)일 확률이 높다.

**How to apply:** 정체 불명의 콘솔창을 형에게 "닫아도 되나" 판단해줄 때, 절대 "닫아도 프로세스는 안 죽는다"고 단정하지 않는다. 창=프로세스 1:1로 붙어있다고 가정하고, 먼저 PID/역할을 특정한 뒤 그 프로세스가 지금 실사용 중인지([[feedback_kill_process_check_active_agents_first_2026-08-14]] 참고) 확인하고 나서 종료 방법(taskkill /PID, 또는 프로세스 자체의 정상 종료 절차)을 안내한다.

**부가 발견**: 이 세션의 자동화 도구(PowerShell tool)는 프로세스 목록(WMI/Get-Process)은 볼 수 있지만 `MainWindowHandle`이 전부 0으로 나와 실제 화면에 뜬 창을 식별 못 하는 제약이 있다(윈도우 스테이션 분리로 추정) — 화면에 보이는 창 개수·내용은 형이 직접 확인해줘야 한다.

관련: [[feedback_kill_process_check_active_agents_first_2026-08-14]] [[feedback_check_before_spawn_dev_server_2026-08-15]]
