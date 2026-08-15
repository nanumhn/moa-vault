---
name: feedback_check_before_spawn_dev_server_2026-08-15
description: 형이 "서버pc에 cmd창이 너무 많이 떠 있다"고 지적 — 새 dev server/프로세스 띄우기 전 기존 것 확인부터 하라는 지시
metadata:
  type: feedback
  originSessionId: 9aec50e3-ec92-4e7b-a0d6-3a64b520a762
  modified: 2026-08-14T23:32:34.858Z
---

형이 2026-08-15 아침 "서버pc에 cmd창이 너무 많이 떠 있는데, 정리가 필요해 보여. 동일한 업무는 기존 창을 체크해서 종료하거 시작하던지 해야지"라고 지적했다.

조사해보니 지적 시점(재시작 전) 대비 재시작 직후 시점엔 창이 3개(Claude Code WT, ComfyUI cmd, LM Studio)뿐이라 재시작 자체가 누적분을 정리한 상태였다. 원인은 직접 재현 못 했지만, 유력 가설은 세션 중 `bun run dev` 같은 dev server를 다시 띄울 때 기존에 떠 있는 걸 확인 안 하고 그냥 새로 실행해서 쌓이는 것.

**Why:** 형이 화면에서 직접 본 것(누적된 cmd창)은 실재했을 가능성이 높고, "동일 업무 = 기존 창 체크 후 종료/재사용" 원칙을 명시적으로 요구함. [[feedback_kill_process_check_active_agents_first_2026-08-14]]가 "죽이기 전에 확인"이라면 이건 반대 방향 — "새로 띄우기 전에 확인".

**How to apply:** dev server(bun run dev, next dev 등)나 장기 실행 프로세스를 백그라운드로 새로 띄우기 전에 `Get-CimInstance Win32_Process`나 포트 점유 확인으로 동일 작업이 이미 떠 있는지 먼저 체크한다. 떠 있으면 재사용하거나, 낡은 것이면 종료 후 재시작. 매번 새로 켜서 쌓이게 두지 않는다.

관련: [[feedback_kill_process_check_active_agents_first_2026-08-14]]
