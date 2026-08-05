---
name: reference_atz_report_channel_2026-08-05
description: 아투(american-todayz) 발행봇·큐레이터·쇼츠봇이 보고하는 디스코드 채널 ID와 웹훅ID 혼동 주의
metadata: 
  node_type: memory
  type: reference
  originSessionId: 05eeca17-d953-4fd5-9b1a-332286749eca
  modified: 2026-08-05T00:44:30.345Z
---

아투 블로그/쇼츠 자동화("american-todayz 발행봇", "american-todayz 큐레이터", "american-todayz 쇼츠봇")가 보고를 올리는 디스코드 채널.

- **channel_id**: `1529814918658785350` — 2026-08-05 형이 `/discord:access group add`로 허용목록 등록 완료, 표준 `fetch_messages`로 바로 조회 가능.
- **주의**: `1529814961646338098`은 이 채널이 아니라 "american-todayz 발행봇"의 **웹훅 ID**(author.id/webhook_id로 나옴)다. 채널 ID로 착각해서 허용목록에 잘못 추가하면 "Unknown Channel" 에러가 남. 형이 이미지에서 캡처한 숫자가 이거였을 가능성 있음 — 채널 우클릭 "채널 ID 복사"로 받은 값과 웹훅/봇 우클릭 "사용자 ID 복사"로 받은 값이 다르다는 걸 알아둘 것.

이 채널에서 발행봇 카드의 "🔁 발행 후 재조회" 섹션이 ⚠️면 실제 라이브 상태(재조회 실측)와 우리가 보낸 값이 어긋난 것 — [[project_atz_image_mismatch_after_regen_2026-08-05]] 같은 실제 버그 신호이니 무시하지 말 것.

관련: [[reference_ksaju_daily_report_channel_2026-08-05]] [[reference_atz_shorts_approval_channel]]
