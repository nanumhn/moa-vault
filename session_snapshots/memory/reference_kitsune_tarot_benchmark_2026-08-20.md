---
name: reference-kitsune-tarot-benchmark-2026-08-20
description: 형이 사주 콘텐츠 참고용으로 준 무료 AI 타로 서비스 — 롱테일 505페이지 + llms.txt/MCP 에이전트 유입로가 핵심
metadata: 
  node_type: memory
  type: reference
  originSessionId: 66b3be13-7e74-4820-96bf-fbb885c9a130
  modified: 2026-08-20T06:59:57.458Z
---

키츠네타로 https://kitsune-tarot.vercel.app/ — 2026-08-20 형이 "사주 콘텐츠 참고용"으로 공유. 한국어 우선 무료 AI 타로.

**실측(sitemap.xml 직접 파싱, 2026-08-20 기준 총 505 URL):**
fortune 157 · review 79 · card-meaning 79 · card 70 · spread 65 · tarot-test 47 · 나머지 8.
즉 대부분이 "카드 1장 / 배열 1종 / 상황 1개"당 페이지 1개인 롱테일 양산 구조.

**베낄 만한 것 3개:**
1. 롱테일 페이지 양산 — 사주로 치면 60갑자·십신·십이운성·띠×연도·궁합 조합이 그대로 대응된다.
2. **AI 에이전트 유입로** — `/llms.txt`(사이트 구조를 LLM에게 직접 안내) + `/mcp` MCP 엔드포인트 + `/developers` 가이드. 도구 8종(list_spreads·list_cards·recommend_spread·get_spread_guide·get_card_meaning·draw_tarot·fortune_cookie·draw_lotto). **오디언스 0에서도 성립하는 유통 경로** — k-saju 병목이 콜드스타트 유통경로 부재라는 실측([[project_ksaju_instagram_carousel_2026-08-16]])과 정확히 맞물린다.
3. 카드별 "임상·사례" UGC 페이지(79개) — 사용자 사례가 곧 롱테일 콘텐츠가 되는 구조.

**주의(시장 신호):** 이 서비스는 "결제 유도·광고·스토리텔링 없는 100% 무료"를 전면 포지셔닝으로 내건다. k-saju 단건 $29 안([[project_revenue_model_redesign_final_2026-08-12]])과 정면으로 부딪히는 경쟁 환경 신호 — 유료화 설계 시 "무료 대비 무엇이 다른가"를 반드시 답해야 한다.

**미확인:** 실제 트래픽·수익 여부는 측정 불가(외부에서 볼 수 없음). 페이지 수가 많다는 것이 유입이 있다는 뜻은 아니다.
