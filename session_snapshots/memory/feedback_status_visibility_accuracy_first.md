---
name: feedback_status_visibility_accuracy_first
description: "형 원칙(2026-08-10) — 진행상황 표시는 기능보다 우선, 없거나 부정확하면 사용자가 불편해함"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c23b79cb-17fc-4fd7-8157-44d3094571d0
  modified: 2026-08-10T08:13:37.555Z
---

형 발언 원문(2026-08-10, nblog-saas 구글시트 상태값 설계 중): "진행상황는 원활한 소통을 위해서 필요해.. 없거나 불정확하다면 사용자가 불편해 할꺼야."

**Why:** nblog-saas 콘텐츠 상태값(수집완료→배정→발행완료 등) 설계 논의 중 나온 원칙. 기능을 새로 만드는 것보다, 이미 있는 상태를 사용자에게 **정확하고 실시간으로** 보여주는 것이 우선순위라는 뜻. 대시보드 상태와 DB 실제상태가 어긋나거나, 시트 write-back이 "일단 뭐라도" 식으로 애매하면 안 됨.

**How to apply:** nblog-saas뿐 아니라 사용자 대면 기능(대시보드·시트 write-back·발행 상태 알림 등)을 설계·구현할 때, "기능이 되는가"보다 "지금 상태를 정확히 보여주는가"를 먼저 확인. 실패·에러는 숨기지 말고 바로 드러내기(관련: [[feedback_no_falsehood_double_check]] — 거짓 금지 원칙과 같은 결).

관련: [[project_nblog_saas_account_domain_decision_2026-08-10]]
