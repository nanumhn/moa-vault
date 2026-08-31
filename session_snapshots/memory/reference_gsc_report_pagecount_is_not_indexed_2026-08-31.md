---
name: gsc-report-pagecount-is-not-indexed
description: "일일 검색 리포트의 \"노출페이지 Np\"는 색인된 페이지 수가 아니라 그날 하루 노출이 잡힌 URL 수 — 색인 실패로 오독하면 진단이 통째로 틀어진다"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 1c673286-4329-4b1e-bbb7-136408636181
  modified: 2026-08-30T23:45:54.952Z
---

`C:\Users\user\.moa\search_console_report.mjs` 가 매일 내는 리포트의 `색인: sitemap Np / 노출페이지 Mp` 에서 **M은 색인된 페이지 수가 아니다.**

`sectionMetrics()` (L145~162)가 `{startDate: date, endDate: date, dimensions:["page"]}` 로 **하루짜리** Search Analytics 쿼리를 던지고 그 행 수를 세는 값이다. 즉 M = **그날 노출이 1회 이상 발생한 서로 다른 URL 개수**다. 색인 여부와 무관하다.

**Why:** 2026-08-31 아투(american-todayz.com) 진단이 "사이트맵 247p 제출인데 노출페이지 1p → 색인이 안 된다"는 전제로 시작됐다. 틀린 전제였다. URL Inspection API로 사이트맵 250건을 전수조회하니 **231건(92.4%)이 `Submitted and indexed`**, canonical 불일치 0, robots ALLOWED 232 였다. 색인은 멀쩡했고 진짜 문제는 "색인된 231페이지가 28일간 노출 12회·클릭 0·서로 다른 쿼리 4개"라는 **랭킹/수요 쪽**이었다. 색인 문제로 착각했으면 사이트맵 재제출 같은 무의미한 조치로 한 주를 날렸다.

**How to apply:** 리포트의 `노출페이지` 수치로 색인 상태를 판단하지 말 것. 실제 색인 수가 필요하면 `bun run C:\Users\user\.moa\gsc_url_inspect.mjs --site=sc-domain:<도메인> --sitemap=<사이트맵URL> --out=<디렉터리>` 로 전수조회한다(250건 약 6분, 쿼터 속성당 하루 2000건, 이어쓰기 resume 지원). 그리고 실적 판단은 하루가 아니라 28일 창으로 봐야 한다 — 하루짜리 숫자는 노출이 원래 0~2인 사이트에선 노이즈다.

관련: [[feedback_verify_measurement_before_declaring_failure]] · [[feedback_dont_fill_data_gaps_with_inference]] · [[reference_ga4_excludes_headless_ua_2026-08-24]]
