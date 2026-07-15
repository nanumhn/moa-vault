---
name: feedback_publish_with_images
description: 블로그·콘텐츠 발행 시 이미지를 글과 함께 발행하라 — 글만 먼저 띄우고 이미지 후속 금지
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 613b6a58-160d-4467-ac7f-3f4d6b5f9c34
---

블로그/콘텐츠를 발행할 때 **이미지까지 채워서 한 번에 발행**한다. 글만 먼저 띄우고 이미지를 "후속 커밋"으로 미루지 말 것.

**Why:** 2026-06-27 k-saju 유입 블로그 2편을 글만 먼저 발행하고 이미지 5자리를 비워둠("SEO 빨리 뜨는 게 이득" 논리). 형이 "관련 이미지 2~3개 넣어달라고 했는데 없네?" → "다음에는 무조건 함께 발행해" 지적. 형 기준에서 이미지 빠진 글은 미완성 발행이다.

**How to apply:**
- 발행 완료 기준 = 글 + 이미지 둘 다. 이미지 자리(placeholder)가 1개라도 남으면 발행 미완료로 간주.
- 콘텐츠 작업 라우팅 시 content-head-seoa(글) → media-head-siwoo(이미지)를 **같은 사이클로 묶어** 둘 다 끝낸 뒤 발행/배포.
- completion-gate(검수)에 "이미지 자리 0개 남음" 항목 → 빈 채로는 PASS 금지.
- 예외: 형이 명시적으로 "글 먼저"라고 할 때만 분리. 기본은 항상 함께.

관련: [[project_blog_ksaju]] [[feedback_no_mid_interrupt]]
