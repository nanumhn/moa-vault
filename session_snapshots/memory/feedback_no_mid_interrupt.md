---
name: cancel
description: "Started meetings/tasks must run to completion — never offer \"interrupt and switch\" as an option to the user"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 21440e58-c87b-4bf1-8a4a-156f697ad594
---

회의(meeting.py)나 자동화 작업이 진행 중일 때, 다른 우선순위가 끼어들어도 **현재 회의/작업을 중간에 끊는 옵션을 사용자에게 제시하지 말 것.**

**Why:** 2026-06-01 — 픽셀 재설계 회의가 LM Studio 점유 중이고 형이 사주 프로젝트(매출 1000만원 핵심)를 새로 지시함. 내가 옵션으로 "(나) 픽셀 회의 중단 + 사주 즉시" 제시. 형이 "중간에 끊는건 좋은 방법이 아니야. 주의해 줘"라고 명시적 정정. 이유: 회의 중간 cancel = 산출물 손실 + 직원 발언 흐름 단절 + 시간/LLM 토큰 낭비.

**How to apply:**
- 우선순위가 바뀌어도 진행 중 회의/작업은 그대로 완료시킨다.
- 옵션 제시할 때 "중단" / "cancel" / "지금 끊고 즉시 시작" 같은 선택지를 만들지 말 것. 순차로 진행하는 것이 default.
- 진행 중에 새 요청이 오면 "현재 작업 후 자동 트리거" 또는 "병행 가능 작업만 지금 진행"으로 안내한다.
- 회의 엔진 병렬화가 필요한 상황이면 인프라 개선(LM Studio 2개 / 클라우드 LLM 분리) 옵션을 제시하되, 중단은 옵션이 아니다.
- 예외: 명백한 실패/무한 루프/에러 — 그건 cancel 자연스러움. 단순 우선순위 변경은 절대 cancel 사유 아님.
