---
name: feedback_agent_may_undersell_own_work
description: 본부장 자기보고 수치는 과대만이 아니라 과소로도 틀린다 — QA는 양방향으로 재현할 것
metadata:
  type: feedback
---

2026-08-21 띠별 운세 검수에서 서진이 "16파일 / 신규 테스트 31개"로 보고했는데 실측은 **19파일 / 62개**였다. 자기 성과를 **낮게** 잘못 셌다.

**Why:** 검수를 "부풀린 주장 깎기"로만 설계하면 이런 건 안 걸린다. 그런데 수치가 틀렸다는 사실 자체가 신호다 — 세는 방법이 틀렸으면 다른 주장의 근거도 같은 방식으로 셌을 수 있다. 실제로 같은 보고에서 **회귀 범위(월간 누락)**가 빠져 있었고 그건 형에게 갈 뻔했다.

**How to apply:** 검수 지시에 "주장보다 크거나 작거나 **양방향 불일치**를 보고하라"를 넣는다. 재현 방법은 비교 기준을 따로 뜨는 것(origin/main worktree로 246 실측 → 246+62=308 일치 확인)이 확실하다. 그리고 **보고 누락은 거짓말보다 잦다** — "빠진 게 없나"를 항목으로 물어라.

관련 [[feedback_verified_facts_only]] [[feedback_negative_exaggeration_is_also_falsehood]] [[feedback_qa_gate_before_report]]
