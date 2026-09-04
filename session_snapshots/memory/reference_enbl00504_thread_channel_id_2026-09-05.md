---
name: reference_enbl00504_thread_channel_id_2026-09-05
description: "[엔블 005-04] 수동 결제 주문·연장 승인 연계 — 별도 포럼 스레드의 실제 채널ID"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 2ab22672-428f-4355-bec6-61395ab2f76e
  modified: 2026-09-04T16:16:58.729Z
---

이슈처리-2026 포럼(`1541616859064041502`)에 덱스가 `moa_forum_thread.mjs --title`로 새로 만든 [엔블 005-04] 전용 스레드의 채널ID:

- **`1545467667362611321`**

(스레드 시작 메시지ID와 채널ID가 같은 값 — 디스코드 포럼 스레드의 일반적 특성)

기존 논의는 부모 채널(모아업무플로 계열, channel_id `1544531657795829923`)에서 있었고, 이 스레드는 그 논의 결과를 정식 이슈로 못박은 것. REQ-20260905-ENBL00504-01 결재 추적은 두 채널 모두에서 같은 ID로 참조됨.

**How to apply**: 이 이슈 관련 `fetch_messages`/`reply`는 앞으로 이 채널ID를 쓸 것.
