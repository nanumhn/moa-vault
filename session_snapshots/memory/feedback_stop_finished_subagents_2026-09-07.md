---
name: feedback_stop_finished_subagents_2026-09-07
description: 일이 끝난 서브에이전트는 그 자리에서 TaskStop으로 정리한다 — 리셋으로 사라지는 것은 치운 것이 아니다
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 36ff6f5f-51ea-4193-b9eb-5f34207f3d13
  modified: 2026-09-07T05:06:12.344Z
---

**일이 끝난 서브에이전트는 결과를 받은 그 자리에서 `TaskStop`으로 정리한다.**

**Why:** 2026-09-07, 오전에 띄운 7명(`research-w37`·`cso-w37`·`growth-w37`·`coo-w37`·`qa-w37`·`fin-w37`·`cso-rev-w37`)이 산출물을 다 내고도 **5~6시간째 idle로 떠 있었다.** 리셋되면 사라지지만 **그건 내가 치운 게 아니라 저절로 없어지는 것**이다.

같은 날 형이 *"제나는 지금 뭘 하고 있는 것일까?"* 라고 물으셨다. 그 물음의 실체는 **"지금 누가 뭘 하고 있는지 우리가 아느냐"** 인데, 내 쪽부터 그게 안 되고 있었다. 워커 상태를 못 본다고 보고하면서 정작 **내가 띄운 인원 목록도 관리하지 않았다.**

**How to apply:**
- 서브에이전트 결과를 받아 **보고에 반영한 직후** `TaskStop(task_id="이름")`. 미루지 말 것
- 여러 명을 병렬로 띄웠으면 마지막 한 명 회신 뒤 **`ListAgents`로 남은 인원을 확인**하고 전부 정리. 이름으로 종료된다
- **정리 전에 산출물이 파일로 남았는지 먼저 확인**한다. 회신 메시지에만 있는 내용은 종료하면 되찾을 수 없다(2026-09-07에 리서치·CSO 산출물이 위임 관문에 막혀 메시지로만 왔던 전례 — 그때는 내가 대신 파일로 기록한 뒤 종료했다)
- 아직 회신을 기다리는 중이면 종료하지 말 것. **idle 표시가 "일이 끝났다"는 뜻은 아니다** — `ListAgents`의 상태와 실제 완료 보고를 같이 볼 것

관련 [[feedback_kill_process_check_active_agents_first_2026-08-14]] [[feedback_parent_cpu_zero_does_not_mean_idle_2026-08-26]]
