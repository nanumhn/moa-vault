---
name: reference_agent_mailbox_no_priority_preempt_2026-08-07
description: "SendMessage로 '이거 우선순위 높여서 먼저 해줘'를 보내도 이미 하던 작업을 끊고 끼어들지 않는다 — 메일박스는 순서대로 처리됨, 재확인 필수"
metadata: 
  node_type: memory
  type: reference
  originSessionId: e191fe26-93b0-4a73-b1fb-b967f371511a
  modified: 2026-08-07T07:48:05.863Z
---

cto-seojin(에이전트명 cto-ppt-template)에게 쇼츠 제안서 템플릿 작업을 시킨 직후, 형이 실제 PPT 파일(AI___100_3.pptx)을 보내며 재가공을 요청했다. "앞서 시킨 작업과 별개로 이게 더 급하니 우선 처리해달라"는 SendMessage를 바로 보냈는데, 실제로는 **반영이 안 되고 원래 하던 제안서 템플릿 작업이 끝까지 진행된 뒤에야** 새 메시지를 확인했다. 원인은 에이전트가 "세 메시지가 한꺼번에 도착"했다고 밝힌 것으로 보아, 이미 작업 중인 에이전트에게 도착한 메시지는 **현재 작업을 끊고 끼어드는 인터럽트가 아니라 메일박스 큐에 쌓이는 것**으로 보인다 — "우선순위"라고 적어도 텍스트일 뿐 실제 스케줄링에 반영 안 됨.

**Why:** SendMessage 도구 설명에도 우선순위 개념이 없다("메시지 전달"만 보장). 형이 급한 것을 보냈다고 안심하고 안 물어보면, 실제로는 큰 지연(이번엔 20분+)이 나고 형은 진행되고 있다고 믿게 된다.

**How to apply:**
- 이미 작업 중인 에이전트에게 "이게 더 급하니 먼저"류 지시를 보냈으면, **몇 분 내로 실제 착수했는지 직접 확인**해라(완료 보고에 그 항목이 빠져 있으면 바로 캐물을 것 — 오늘 실제로 이렇게 잡아냄).
- 진짜 끼어들기가 필요하면(작업 중단 후 전환) 메시지로는 부족할 수 있다 — TaskStop 후 재지시 등 더 강한 개입을 고려.
- 형에게 "우선 처리하겠다"고 보고한 순간부터는, 그게 실제로 지켜지는지 내가 검증할 책임이 있다([[feedback_report_while_delegating]] 연장선).

관련: [[feedback_report_while_delegating]] [[feedback_clo_orchestrates_agents_execute]]
