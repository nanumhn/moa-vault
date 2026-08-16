---
name: reference_bash_date_clock_offset_2026-08-16
description: Bash 도구의 `date` 명령이 이 환경에서 실제 시각보다 9시간 느리게(UTC를 KST로 착각) 나옴 — PowerShell Get-Date가 정확함
metadata:
  type: reference
  originSessionId: bf3fbb37-1ff7-4b12-a3c5-e0715af4a86e
  modified: 2026-08-16T05:26:59.732Z
---

세션저장 flag 타임스탬프를 찍으려고 `TZ='Asia/Seoul' date '+%Y-%m-%d %H:%M:%S KST'`를 Bash 도구로 실행했더니 **"05:26 KST"**가 나왔는데, 실제로는(작업 스케줄러 cron이 13:55 KST에 막 발동한 직후였고, PowerShell `Get-Date`로 재확인하니 **"14:26:38"**) 9시간 차이가 났다. Bash 서브시스템의 시스템 클록/타임존 설정이 이 환경에서 실제 Windows 호스트와 어긋나 있는 것으로 보인다(정확히 9시간 = UTC/KST 오프셋과 같은 크기라, TZ 설정이 안 먹고 UTC를 그대로 찍었을 가능성).

**How to apply:** 이 환경에서 현재 시각이 필요하면(세션저장 flag, 로그 타임스탬프 등) **Bash `date`를 쓰지 말고 PowerShell `Get-Date`를 쓸 것.** Discord 메시지의 `ts`(UTC)를 KST로 환산할 때도 Bash `date` 계산에 기대지 말고 직접 +9 암산하거나 PowerShell로 검산할 것 — [[feedback_discord_formatting]]에 기록된 반복되는 UTC/KST 착각 사고의 한 원인이었을 수 있다.

관련: [[feedback_discord_formatting]]
