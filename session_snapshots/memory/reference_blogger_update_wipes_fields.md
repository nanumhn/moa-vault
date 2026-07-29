---
name: reference_blogger_update_wipes_fields
description: Blogger posts.update는 전체 치환이라 안 보낸 title·labels를 지운다 — 반드시 posts.patch 또는 기존 update-post.mjs
metadata: 
  node_type: memory
  type: reference
  originSessionId: 29c54c49-d2c2-4901-908c-7ba438cd2d1f
  modified: 2026-07-29T06:25:23.787Z
---

2026-07-29 라이브 사고. 아투 기사의 창작 문단을 걷어내려고 즉석 스크립트에서 `posts.update({requestBody:{content}})`를 호출했더니 **제목과 라벨이 빈 값으로 덮였다.** 형이 화면(제목 없음)으로 잡아줬다.

```
posts.update  = 전체 치환(PUT). 안 보낸 필드는 지워진다.  ← 쓰지 마라
posts.patch   = 부분 갱신. 보낸 필드만 바뀐다.            ← 이것만 써라
```

**진짜 교훈은 API가 아니다.** 레포에는 이미 `tools/blogger-publish/update-post.mjs`(patch 기반)가 있었고, 파이프라인 코드(`blogger.mjs`·`toc-bulk.mjs`·`label-remap/*`)는 전부 patch를 쓴다. **급하다고 그 자리에서 스크립트를 새로 짠 것이 사고의 원인이다.** 블로거 글을 고칠 일이 생기면 새로 짜지 말고 기존 도구를 찾아 쓴다.

**검증 규칙도 같이 고친다:** 수정 후 "내가 지운 문구가 없어졌다"만 확인하면 **안 건드린 필드가 깨진 걸 못 본다.** 라이브 글 수정 뒤에는 `title` · `labels` · `status` · 본문을 **한 번에 재조회**해서 본다. 복구는 payload.json에 원본 title/labels가 남아 있어서 가능했다.

관련: [[feedback_verified_facts_only]] · [[reference_atz_pipeline_live_url_truth]](원장 상태 ≠ 라이브 상태 — 이 건도 원장 DRAFT / 실제 LIVE였다)
