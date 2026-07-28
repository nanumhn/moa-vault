---
name: project_atz_indexing_audit_2026-07-28
description: "아투 색인 전수감사 실측 — 크롤되면 97% 색인되고 병목은 크롤 도달, 진짜 문제는 노출 0. URL Inspection 전수 스캔 방법 포함"
metadata: 
  node_type: memory
  type: project
  originSessionId: e32c22d7-4343-4bff-946b-e8d022511b3f
  modified: 2026-07-28T01:30:20.454Z
---

2026-07-28 아투(american-todayz.com) 색인 미생성 46건 규명 결과. **"색인이 안 붙는다"는 전제 자체가 틀렸다.**

라이브 183편 전수 URL Inspection 실측:
- 크롤된 145편 중 **141편 색인(97.2%)**. 크롤되면 거의 다 색인된다.
- 미색인 38편은 전부 **아직 크롤이 안 온 것**(발견-미색인 32 = 큐 대기, 미발견 6).
- 미색인 4편(크롤됨-미색인 3 + 리디렉션 1)에서 본문길이·이미지·링크·중복·발행일 어느 축도 색인된 141편과 구분되지 않았다 → 원인 특정 실패로 보고. 반례가 널려 있어 단정 불가.
- 크롤 이력: 07-24에 129편 일괄 → 이후 하루 6/4/2편으로 급감(크롤 예산).
- **진짜 병목은 색인이 아니라 노출**: 141편 색인인데 07-14~28 노출 0·클릭 0. 랭킹/수요 문제지 색인 문제가 아니다.

**원인 규명은 실패했고, 8개 축이 전부 반례로 죽었다** (다시 파기 전에 이걸 봐라):
슬러그 무의미(무의미 78% vs 의미있음 76% 색인 — `vs.html`류가 88편 색인됨) / 고아페이지(inbound 0인 글이 **183편 중 0편**) / inbound 수(색인 중앙값 2 = 미색인 최대값 2, 반례 137편) / 색인된 페이지로부터 링크 못 받음(미색인 5건 : 색인 5건으로 동수) / 발행 버스트(0건) / 본문중복(0쌍) / 본문길이(미색인이 더 김) / 사이트맵 위치(고른 분산).
★**32건은 콘텐츠 가설이 원리적으로 불가능하다** — 구글이 한 번도 안 가져갔다(lastCrawlTime 없음). 크롤 전 구글이 아는 건 URL·사이트맵메타·링크구조 셋뿐인데 셋 다 차이 없음(lastmod는 07-27 toc-bulk 일괄수정으로 183편 전부 동일).
→ 내부링크 보강은 **색인 대책이 아니다**(고아 0편, inbound가 색인을 못 가름). 값은 주제연결·체류에 있다.

재현 방법 (쿼터 속성당 2000/일, 183건은 여유):
- `POST https://searchconsole.googleapis.com/v1/urlInspection/index:inspect` — body `{inspectionUrl, siteUrl:"sc-domain:american-todayz.com", languageCode:"en-US"}`.
- 인증은 `search_console_report.mjs`의 서비스계정 JWT 그대로 재사용(`webmasters.readonly` 스코프로 충분, 추가 권한 불필요).
- **languageCode를 ko로 주면 coverageState가 한국어로 와서 분류가 깨진다 — en-US로 고정.**
- 순차 호출은 21초/건(65분). 동시 6이면 ~7분.
- 신규 글이 "URL is unknown to Google"이면 먼저 sitemaps API의 `lastDownloaded`를 봐라 — 그 시각 이후 발행분은 구글이 아직 사이트맵을 안 읽은 것뿐이다(07-28 미발견 6편 중 4편이 이 경우).

관련: [[project_gsc_atz_report_2026-07-26]] [[reference_atz_pipeline_live_url_truth]] [[reference_moa_logs_and_ledgers]]
