---
name: reference_nblog_saas_sheet_edit_ignored_after_collection_2026-08-15
description: nBlog 글감이 sheet-sync에 한 번 수집(READY)되면 그 뒤 시트 D열(본문) 수정은 무시된다 — 수집후 편집은 대시보드/DB(ContentItem)에서만 해야 함
metadata:
  type: reference
  originSessionId: 9aec50e3-ec92-4e7b-a0d6-3a64b520a762
  modified: 2026-08-15T01:12:35.404Z
---

망원동/한남동 글감(수동으로 시트 C/D/E열에 제목·본문·태그를 채운 것)에 나중에 이미지를 추가하려고 시트를 다시 쓰려던 차에, sheet-sync 15분 주기 크론이 이미 그 두 행을 수집 완료(status=READY)한 상태였다.

**핵심 사실**: `sheet-sync.ts`는 이미 수집된 행을 행번호 매칭 폴백으로만 확인하고, **본문·제목이 바뀌어도 재수집하지 않는다**(로그만 남김). 즉 시트가 "이미 가져간 글감입니다"로 잠기는 것과 별개로, **수집 후 시트를 고쳐도 실제 발행 콘텐츠(ContentItem.bodyHtml)에는 반영이 안 된다.**

같은 코드에 [[reference_nblog_saas_shared_test_db_contention]]류의 함정과 짝을 이루는 것: `contentHash`(제목+본문 sha256)가 수집 시점에 고정되고, 수집 후 재계산하면 "새 글감"으로 무한 증식하는 버그를 막으려고 일부러 이렇게 설계돼 있다(docs/ai-draft-design.md §3-2 참고).

**How to apply**: 수집 여부(시트에서 회색으로 잠겼는지, 또는 DB `ContentItem.status`)를 먼저 확인 후 편집 경로를 고른다.
- **수집 전**(아직 회색 안 잠김): 시트 C/D/E열을 직접 수정하면 된다.
- **수집 후**: 시트는 더 이상 진실원천이 아니다. `/api/dashboard/content/[id]` PATCH(대시보드 편집)를 쓰거나, 운영 필요시 그 라우트와 동일하게 `ContentItem.bodyHtml` + `contentHash`(제목+본문 재계산)를 같이 갱신해야 한다 — bodyHtml만 바꾸고 contentHash를 안 바꾸면 다음 sheet-sync 매칭이 꼬일 수 있다(직접 검증은 안 했음, 다음에 이 경로 쓸 때 확인할 것).

관련: [[reference_nblog_saas_shared_test_db_contention]] [[project_nblog_saas_night_marathon_2026-08-13]]
