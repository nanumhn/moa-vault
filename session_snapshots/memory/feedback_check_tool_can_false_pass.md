---
name: feedback_check_tool_can_false_pass
description: 검사 도구는 실패 오진뿐 아니라 "전부 통과" 오진도 낸다 — 통과 숫자를 근거로 쓰기 전에 도구를 의심할 것
metadata:
  type: feedback
---

2026-08-21 타로 22장 양산 중 시우가 발견. 카드 오행이 코드와 맞는지 **그림의 지배 색조를 자동 측정**해 판정하려 했는데, 우리 카드는 화풍상 **전부 금박**이 들어가서 색조 평균이 어느 카드나 금색(hue 40°대)으로 수렴했다. 별(水·남색)이 hue 43°=금색으로 측정됐다.

**그대로 뒀으면 "22장 전부 대조 통과"라고 보고했을 것이고 그 숫자는 무의미했다.**

**Why:** 우리는 "실패 오진"(측정이 잘못돼 멀쩡한 걸 고장으로 판정)은 경계해 왔다([[feedback_verify_measurement_before_declaring_failure]]). 그런데 **통과 오진이 더 위험하다** — 실패는 사람이 다시 보지만, 통과는 아무도 안 본다. 검사가 있다는 사실 자체가 안심을 만든다.

**How to apply:**
- 검사 도구를 만들면 **일부러 틀린 입력을 넣어 실제로 걸리는지** 먼저 확인한다(서진도 i18n 가드를 HEAD worktree에서 실패시켜 검증했다 — 같은 원리).
- 판정을 층으로 나눈다: ①기계 대조(확실한 것만) ②참고 수치(판정에 안 씀) ③사람 눈(최종). 확실하지 않은 신호를 판정으로 승격시키지 않는다.
- 좋은 대조축 고르기: 시우는 색조 대신 **파일명에 오행을 박아 코드값과 문자 비교**로 바꿨다. 재현 가능하고 오염될 자리가 없다.
- 보고에 "N개 전부 통과"가 있으면 **무엇으로 통과를 판정했는지**를 되물어라.

관련 [[feedback_verify_measurement_before_declaring_failure]] [[feedback_verified_facts_only]] [[reference_qa_gate_rule_inversion_blindspot_2026-08-07]] [[feedback_report_only_100_percent_done]]
