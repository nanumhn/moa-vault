---
name: reference_atz_source_refetch_for_audit
description: "아투 07-27 이전 글은 원문근거 파일이 없다 — 재수집 경로와 \"페이지 전체를 근거로 쓰면 다 통과되는\" 함정"
metadata: 
  node_type: memory
  type: reference
  originSessionId: e32c22d7-4343-4bff-946b-e8d022511b3f
  modified: 2026-07-28T01:30:55.354Z
---

아투 기사의 창작 여부를 사후 검증할 때.

**07-27 02시 이전 생성분에는 `out/*_sources.txt` 가 없다** (근거 저장 기능이 그때 추가됨). `curation.json` 에는 헤드라인과 Google News RSS 링크만 있고 본문이 없다.

재수집 경로:
- Google News RSS 링크는 이제 JS 렌더(`syndicationarticleview`)라 **발행사 URL이 정적 HTML에 없다.** 리다이렉트 추적도 안 통한다.
- 되는 방법: **헤드라인으로 웹검색 → 같은 연합뉴스 wire를 실은 다른 매체(파이낸셜뉴스·세계일보·아주경제 등)에서 회수.** 2026-07-28에 07-26자 기사를 이 경로로 확보했다.
- ★재수집본은 "그때 쓴 근거"가 아니라 "지금의 원문"이다. 다만 원문에 아예 없는 기관·인물의 발언은 어느 시점 근거로도 나올 수 없으므로 **창작 판정에는 유효하다.**

**★함정 — 페이지 전체를 근거로 쓰면 전부 "근거 있음"이 된다.**
KBS·세계일보 등은 본문 추출이 거의 안 되고 사이드바·인기기사·댓글정책이 딸려온다. 그 상태로 대조하면 `한국`·`반도체`·`자동차`가 다 매칭된다(2026-07-28 1차 대조에서 실제로 그렇게 나왔다). 또 `한국`이 매칭된 진짜 이유가 **"VOA 한국어 홈페이지"라는 매체명**이었던 경우도 있다.
→ 기사 본문 구간만 잘라서 대조하고(연합 wire면 `(워싱턴=연합뉴스)`~`(끝)`), 매칭이 나오면 **그 매칭이 본문의 어디인지 눈으로 확인**해라. 이건 [[project_atz_hallucination_fix_2026-07-27]] 의 원인(푸터를 원문으로 긁음)과 같은 함정이다.

관련: [[project_atz_indexing_audit_2026-07-28]] [[reference_atz_pipeline_live_url_truth]] [[feedback_verified_facts_only]]
