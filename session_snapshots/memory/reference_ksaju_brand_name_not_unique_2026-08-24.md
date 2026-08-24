---
name: reference_ksaju_brand_name_not_unique_2026-08-24
description: "Saju Studio"는 우리 고유 브랜드가 아니다 — 동명 실체 5곳 이상, GSC 브랜드 쿼리 노출을 인지도로 읽으면 안 된다
metadata:
  type: reference
---

2026-08-24 SERP 직접 조회(읽기 전용). **`사주스튜디오`·`saju studio` 둘 다 상위 9개에 k-saju.me가 없다.**

동명 실체(실측): `pf.kakao.com` 카카오 채널 **사주스튜디오** · `sazu.app` **SAZU Studio** · `facebook.com` **SAJU Studio (@SajuStudio18)** · **`sajustudios.com` SAJU Studios** · `instagram` SAJU Art (@saju.studios). 영어권에서 "Saju"는 남아시아권 인명이기도 하다.

★**그래서 GSC 브랜드 쿼리 노출을 브랜드 인지도로 읽으면 안 된다.** 2026-08-24에 growth가 "90일 브랜드 쿼리 150노출 = 우리를 아는 사람이 최소 150번 검색했다"고 보고했고 그게 그날의 핵심 단서로 형께까지 올라갔는데, **SERP를 열어보니 그 노출 대부분은 동명의 다른 실체를 찾는 검색에 우리가 섞여 뜬 것**이었다. 같은 이유로 "브랜드 검색 유출 수리"의 기대 상한도 과대평가였다.

우리를 특정해 찾은 것에 가까운 유일한 형태 = `sajustudio`(붙여쓰기), 90일 **5노출 1클릭 평균 3.4위**. 표본 5라 아무 주장도 못 한다.

**같은 조사에서 나온 진짜 결함** — 라이브 홈 HTML에 `canonical` 0건 · **`hreflang` 0건**(다국어 사이트인데 언어 대체 표시 없음) · JSON-LD 0건 · `og:site_name` 없음. hreflang 부재는 `/ko/input → /discover`가 영어로 새는 버그와 **같은 병(언어 라우팅)의 검색 쪽 얼굴**이다.

**교훈:** 순위·노출 숫자를 해석하기 전에 **그 검색어의 SERP를 실제로 열어봐라.** 쿼리 문자열이 우리 이름처럼 생겼다는 것만으로 브랜드 검색이라고 부르면, 남의 트래픽을 우리 인지도로 착각한다.

관련: [[feedback_find_counterexample_first]] · [[feedback_invalidate_own_premise_when_data_contradicts]] · [[reference_ksaju_english_market_saturated_2026-08-20]] · [[reference_gsc_service_account_separate_from_blogger_oauth]]
