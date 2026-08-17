---
name: reference_agent_unreachable_recurring_2026-08-17
description: "본부장 에이전트 SendMessage 전달불가가 반복 발생 — data-finance-jiwon 2회(W33·W34), media-head-siwoo 1회(8/17), qa-lead-jian 1회(8/17). 위임 전 전달 실패를 전제하고 우회안을 준비할 것"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5b69d1f6-1f0a-499b-a3c2-cae15069bb8f
  modified: 2026-08-16T22:21:32.069Z
---

본부장 에이전트에게 `SendMessage`를 보내면 `No agent named '<name>' is reachable.`로 실패하는 일이 반복된다.

**확인된 사례**:
- `data-finance-jiwon` — CSO가 W33·W34 **2주 연속** 전달 실패. 측정과 의사결정 주체가 같아지는 구조 결함이 생겼다(CSO가 직접 측정하고 직접 판단).
- `media-head-siwoo` — 2026-08-17 그로스(윤슬)가 OG 렌더러 라벨 파라미터 요청 시 실패.
- `qa-lead-jian` — 2026-08-17 cto(서진)가 아투 기사 복구본 검수 요청 시 실패. 클로(main)가 대신 `qa-lead-jian` 에이전트를 새로 스폰해서 우회.

**How to apply:**
- 위임 계획을 세울 때 **전달 실패를 전제로 우회안을 같이 준비**한다. 전달되면 이상, 안 되면 즉시 대기하지 말고 클로(main)가 직접 새 에이전트를 스폰해 대신 라우팅한다.
- 전달 실패 자체가 보고 대상이다([[feedback_report_while_delegating]]). 조용히 우회만 하고 넘어가면 구조 문제가 계속 남는다.
- 실제로 담당자가 붙어야만 하는 작업(릴스 제작 등)은 **착수 자체가 불가능**해질 수 있으니, 그런 작업은 계획을 세우기 전에 전달 가능 여부부터 확인한다.
- 한 세션에서 전달 가능했던 흐름: `main`, 그리고 같은 세션 안에서 스폰된 본부장 에이전트(예: `seojin-dm-campaign`). **스폰된 에이전트는 이름으로 전달되지만, 스폰되지 않은 본부장은 못 닿는 것으로 보인다** — [추측] 확정은 아님.

관련: [[reference_agent_mailbox_no_priority_preempt_2026-08-07]], [[feedback_clo_orchestrates_agents_execute]]
