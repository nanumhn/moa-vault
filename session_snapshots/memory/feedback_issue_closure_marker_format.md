---
name: feedback_issue_closure_marker_format
description: 형 지시 — 이슈 마무리 완료 표시는 정해진 이모지 헤더를 사용한다
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1c673286-4329-4b1e-bbb7-136408636181
  modified: 2026-08-31T04:03:19.607Z
---

이슈(실전 이슈 NNN 등) 마무리 완료 시 아래 형식으로 표시한다:

🟩🟧🟥 이슈 종료 🟥🟧🟩

**Why:** 형 지시 2026-08-31 13:03 KST, [실전 이슈 001] 케이사주 Instagram 카드 5장 자동 발송 개선·배포가 실제 게시 성공으로 마무리된 직후. 결재 요청에 이미 정해진 형식(🟪🟪🟪🟪🟪 결재 요청 🟪🟪🟪🟪🟪, [[feedback_approval_request_format_purple_card]])이 있는 것과 같은 맥락 — 완료 상태도 한눈에 식별 가능한 고정 마커로 표시하라는 지시.

**How to apply:** 클로·덱스·제나 모두 이슈 스레드에서 해당 이슈가 최종 종료됨을 알릴 때 이 헤더를 메시지에 포함한다. 결재 요청(🟪)과 섞지 말 것 — 요청은 진행 중, 종료는 완료 상태를 뜻하므로 서로 다른 시점에 쓰인다.
