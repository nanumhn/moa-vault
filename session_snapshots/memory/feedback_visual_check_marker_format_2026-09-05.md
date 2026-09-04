---
name: feedback_visual_check_marker_format_2026-09-05
description: 형 육안확인 요청은 ✅✅✅✅✅ 확인 요청(Ctrl+F5) ✅✅✅✅✅ 헤더로 표시
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 2ab22672-428f-4355-bec6-61395ab2f76e
  modified: 2026-09-04T17:58:42.878Z
---

형 지시(2026-09-05, [엔블 005-04] 스레드) — 배포 완료 후 형이 브라우저에서 직접 눈으로 확인해야 하는 항목(Ctrl+F5 새로고침 후 화면 확인 등)도 결재요청(🟪)·위임관문오류(🟥)처럼 고정 이모지 헤더로 표시하기로 함:

```
✅✅✅✅✅ 확인 요청(Ctrl+F5) ✅✅✅✅✅
```

**Why**: 바쁜 이슈 스레드에서 "형이 지금 뭘 해야 하는지"(결재 vs 육안확인 vs 그냥 정보) 종류별로 색·이모지가 구분돼야 스크롤 중에도 즉시 식별된다. [[feedback_approval_request_format_purple_card]](🟪=결재)·[[feedback_delegation_gate_error_marker_format_2026-09-05]](🟥=위임관문오류)와 세 번째 짝.

**How to apply**: 배포·기능 완료 후 형에게 "직접 화면 보고 확인해달라"는 요청을 보낼 때마다 이 헤더를 맨 위에 붙이고, 무엇을 어디서 어떻게 확인해야 하는지(경로·클릭 순서·기대 결과) 구체적으로 적을 것.
