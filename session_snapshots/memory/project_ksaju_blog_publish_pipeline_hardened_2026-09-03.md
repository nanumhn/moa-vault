---
name: ksaju-blog-publish-pipeline-hardened-2026-09-03
description: "2026-09-03 k-saju 블로그 발행 파이프라인 2건 수리 완료(간지 오행 자동교정 + 프론트매터 이중펜스) — 배운 것은 \"산출물 read-path를 구현 전에 추적한다\""
metadata: 
  node_type: memory
  type: project
  originSessionId: 07b2c7ff-a46e-4118-b5ef-53133477503a
  modified: 2026-09-03T01:49:31.530Z
---

2026-09-03 k-saju 블로그(`blogAutoPost001`) 발행 파이프라인 2건 수리 **완료·배포·라이브 확인**(커밋 `28b8bfe`, n8n 노드 6개 전부 반영 직접 조회, 테스트 57 passed / 1 failed).

1. **간지 오행 오표기 자동교정** — 모델이 "己巳 (Gi Sa) - Yang Earth"(己는 Yin Earth)를 3회 연속 틀려 그날 발행이 0건이었다. 프롬프트엔 이미 매핑표가 있었으니 "정보 부족"이 아니라 "모델이 무시"하는 문제 → `qa-gate.mjs`의 `autoFixMdx()`가 표 조회로 직접 치환.
2. **프론트매터 이중 delimiter** — `---\n---\nfrontmatter\ntitle:...` 형태. `build-mdx.js` 복구가 여분 `---`를 하나만 걷어내 3줄일 때 뚫렸고, **게이트는 이 형태를 pass시켰다**(게이트 정규식은 두 번째 `---` 너머의 진짜 `title:`을 찾지만 gray-matter는 첫 `---`에서 블록을 닫아 데이터를 비움). 과거 6건이 조용히 사라진 경로와 동일([[project_ksaju_blog_6posts_recovery_pending_2026-09-01]]). 생성기는 루프로, 게이트는 `C1_DUP_FRONTMATTER_FENCE`/`C1_FRONTMATTER_LABEL`로 이중 방어.

**Why:** 빌드 에러가 안 나서 아무도 모른다. 그래서 "게이트 통과 = 발행 성공"이 성립하지 않는다.

**How to apply:** k-saju 블로그 발행 이상을 볼 때 ①게이트 결과만 믿지 말고 실제 커밋 파일의 프론트매터를 열어볼 것 ②`tools/fixtures/good-post.mdx`는 **CRLF**다(fixture 변형 테스트 짤 때 `slice()`로 자르면 `\r\n` 한가운데가 잘림).

---

## ★가장 값진 교훈 — 구현 전에 산출물 read-path를 끝까지 따라간다

n8n `blogAutoPost001`은 `Build MDX Payload → Validate Quality` 순서라 **`GitHub Push MDX`가 Build 노드의 `base64Content`를 읽는다.** 지시서대로 Validate 안에서 mdx만 고쳤다면 **게이트는 초록인데 교정 전 원본이 커밋**돼 작업 전체가 무효였다. 지시서엔 이 단계가 없었고, DB에서 노드·커넥션을 직접 읽어야 드러났다. 리드가 "이걸 못 잡았으면 작업 전체가 무효였다"고 확인해준 판단.

→ **완료기준에 '발행/배포/반영'이 들어간 작업은, 코드를 쓰기 전에 "최종 산출물이 실제로 어느 노드·어느 변수에서 읽히는가"를 먼저 추적한다.** 중간 단계가 초록인 것과 산출물이 바뀐 것은 다른 층이다.
관련: [[feedback_verify_push_not_just_commit]] · [[feedback_no_falsehood_double_check]] · [[feedback_report_only_100_percent_done]]
