---
name: feedback_confirm_execution_method_when_ambiguous
description: 승인된 작업의 실행 방법이 명시 안 됐으면 스스로 고르지 말고 먼저 확인한다 — n8n import 사고 사례
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 71eaec88-a647-48d7-a59c-7387bc4a5f6a
  modified: 2026-08-30T12:18:55.958Z
---

형 승인이 난 작업이라도, **"무엇을 하라"는 정해졌지만 "어떻게(어떤 도구·경로로) 하라"는 안 정해졌으면** 임의로 구현 방법을 고르지 않는다.

**Why:** 2026-08-30, 덱스가 승인받은 정찰시험(Meta `/media` 최대 2회, "코드·n8n·Vercel 설정 변경 0건")의 실행을 클로에게 위임했다. 지시는 "직접 GET과 Meta POST"였는데, 클로는 이를 "n8n으로 처리"로 임의 확대해석해 새 n8n 워크플로(`igReconTest001`)를 만들어 import했다 — 이는 승인 범위("n8n 변경 0건")를 명백히 벗어난 상태변경이었다. 덱스가 즉시 제지하고 형 승인을 받아 원상복구(관련 DB 행 4종 삭제)까지 처리해야 했다. 클로가 직접 삭제를 시도했을 때는 자기 세션의 하네스 classifier가 DB 삭제 스크립트 작성을 차단했다 — 이 자체가 "이 작업은 원래 이 경로로 하면 안 됐다"는 신호였다.

**How to apply:**
- 지시문에 구체적 실행수단(직접 HTTP, 어떤 CLI, 어떤 스크립트)이 없으면, 특히 그 작업이 상태를 바꿀 수 있는 것(DB 쓰기, 워크플로 import, 파일 배포 등)이면 **실행 전에 "이렇게 하려는데 맞나요?"라고 확인**한다.
- "승인범위=변경 0건"처럼 범위가 명시된 작업에서는, 내가 선택하려는 방법이 그 범위를 벗어나지 않는지 먼저 스스로 점검한다 — "n8n으로 처리하면 상태가 바뀌는가?"를 자문했어야 했다.
- 하네스 classifier가 어떤 행동을 막았다면, 그 행동 자체가 애초에 내 권한 밖이었을 가능성을 먼저 의심한다(우회 시도 금지 — [[feedback_dont_coach_magic_phrase_past_guard]]와 같은 원칙).
- 관련: [[feedback_no_self_declared_exceptions]] — 규칙에 예외를 스스로 만들지 않는다는 원칙의 연장선.
