---
name: reference_atz_pipeline_live_url_truth
description: 아투 out/state.json의 published URL은 라이브와 다를 수 있다(공개 후 DRAFT 되돌림 → 404). 링크 대상은 Blogger LIVE 실측에서
metadata: 
  node_type: memory
  type: reference
  originSessionId: e32c22d7-4343-4bff-946b-e8d022511b3f
  modified: 2026-07-28T01:06:37.646Z
---

아투 파이프라인 `D:\Develop\moa-studio\tools\atz-pipeline\out\state.json` 의 `published[]` 는 **"공개한 시점"의 기록**이지 현재 상태가 아니다.

2026-07-28 실측: published 7건 중 2건(`2026/07/eu.html`, `2026/07/blog-post_27.html`)이 라이브 404였다. 삭제가 아니라 **공개 후 DRAFT로 되돌려진 것**(`posts.list status=DRAFT`에 같은 URL로 존재). 구글은 이미 둘을 크롤·색인해둔 상태라 색인된 URL이 404가 된 셈. 반대로 사이트맵에 있는 `blog-post.html`·`blog-post_668.html` 은 원장에 없다. 즉 원장↔라이브가 양방향으로 어긋난다.

**그래서 URL이 필요한 작업(내부링크·리포트·검증)은 원장이 아니라 Blogger LIVE를 실측한다.**
`bun list-live.mjs --limit=20` (`tools/blogger-publish/`) → `{ok, posts:[{url,title,labels,published}]}`.
※ `posts.get`은 `view:"ADMIN"` 없이 부르면 DRAFT를 "Requested entity was not found"로 돌려준다 — 삭제로 오진하기 쉽다.

관련: [[project_atz_indexing_audit_2026-07-28]] [[reference_moa_logs_and_ledgers]] [[feedback_find_counterexample_first]]
