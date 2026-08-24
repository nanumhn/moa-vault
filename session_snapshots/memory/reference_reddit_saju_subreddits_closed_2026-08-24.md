---
name: reference_reddit_saju_subreddits_closed_2026-08-24
description: "사주 타깃 서브레딧 실측(2026-08-24) — r/Bazi·r/Saju는 밴, 살아있는 두 곳은 링크 게시 자체가 규칙 위반"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5fba1c85-e880-4953-a8f0-3246cdd5fb47
  modified: 2026-08-24T00:12:20.860Z
---

2026-08-24 공개 페이지 읽기로 확인(계정 생성·로그인·게시 없음).

| 서브레딧 | 상태 | 원문 |
|---|---|---|
| r/Bazi | **밴** | "r/bazi 커뮤니티는 이용 정지되었습니다" |
| r/Saju | **밴** | "This subreddit was banned due to being unmoderated." |
| r/ChineseAstrology | 생존·활발 | 규칙2 "direct advertising, spam links, or unsolicited DMs offering paid services are strictly prohibited. If you want to share a tool or resource, it must provide immediate, free value to the community **in the post itself**." / 규칙4 "dropping advertising URLs in the comments is strictly prohibited." |
| r/astrology | 생존 | 규칙4 "**No self-promotion posts or selling your services or products. (Even if for free.)**" / 규칙3 "No memes, ChatGPT or shitposts. … No ChatGPT content." |

**판정:** Reddit 블로커는 **계정 연령·카르마가 아니다**(네 곳 규칙 어디에도 없음). 상위 관문은 **링크 게시 자체가 규칙 위반**이라는 것 — 형이 계정을 만들어 넘겨도 못 올린다. r/astrology는 AI 생성 콘텐츠도 명시 금지라 우리 제작 구조와 충돌. 유일하게 열린 문(r/ChineseAstrology 규칙2의 "post 자체가 무료 가치")은 사람이 스레드에서 직접 풀이해주며 신뢰를 쌓는 일이라 **형 시간이 계속 든다** → 무인·자동 구조와 반대. 2026-08-24 종결 권고.

★**도구 함정 — 조회 실패를 부재로 읽을 뻔한 사례.** 규칙을 읽는 데 세 번 실패했다: ①`old.reddit.com`은 비로그인 차단(로그인 페이지로 302) ②`www.reddit.com/r/X/about/rules`는 비로그인이면 **빈 표**("이름/생성됨" 헤더만) ③서브레딧 메인을 열어도 **좁은 뷰포트에선 규칙 사이드바가 렌더되지 않는다**. 해법 = CDP `Emulation.setDeviceMetricsOverride`로 **width 1600** 준 뒤 `details`를 전부 open 하고 `[class*="rule"]` 수집. 여기서 멈췄으면 "규칙 확인 불가"라는 틀린 보고가 나갔다. 헤드리스/CDP 조회는 폭 때문에 조용히 비는 게 흔하다 — [[reference_headless_screenshot_needs_cdp_emulation]]과 같은 계열.

관련: [[feedback_verify_measurement_before_declaring_failure]] · [[reference_ksaju_english_market_saturated_2026-08-20]]

## 2026-08-24 전수 조회 (11곳, 읽기만)

밴: r/Bazi · r/Saju. **홍보·링크가 허용되는 곳은 0곳.**
- r/ChineseAstrology — 링크 금지, 단 "immediate, free value **in the post itself**"면 도구 언급 허용. **AI 금지 조항 없음(확인된 규칙 4개 기준)** → 유일한 문
- r/astrology — "No self-promotion… (Even if for free.)" + "No ChatGPT content"
- r/AskAstrologers — "Western Astrology only (no Vedic please)" → 사주 부적합, 전 게시물 승인 큐
- r/tarot — 홍보는 메가스레드만, "Two infractions will be a permanent ban", AI 생성물 제거
- r/Divination — 자기홍보 "may result in an immediate ban", "Links to resource websites"=스팸
- r/fengshui — 광고·제품 사이트 링크 금지, AI 영상 제거
- r/Iching — 상단 고정 "Moratorium on use of LLM… and app promotion", "It doesn't matter if it is free, open source"
- r/korea — "No posts for… self-promotion" / r/hanguk — 홍보 조항 미확인

**패턴:** ①점술·동양형이상학 커뮤니티는 스팸 내성이 강해 "무료라서 괜찮다"가 안 통한다(무료여도 금지를 **명시**한 곳이 둘) ②AI 생성 콘텐츠 금지가 별도로 번지는 중(4곳 명시) — **결제가 열려도 이 축은 안 풀린다.**

★**두 번째 도구 함정:** CDP `Runtime.evaluate`로 보내는 **코드 문자열에 백슬래시를 쓰지 말 것.** heredoc→파일→JS 문자열을 거치며 백슬래시가 한 겹 벗겨져 공백 정규식이 문자 s 정규식으로 바뀌었고, **규칙 원문에서 s를 전부 지운 채** 그럴듯하게 출력됐다("Ask Astrologers"가 "A k A trologer "로). 원문 인용이 목적이면 치명적 — 텍스트는 원본 그대로 받아오고 **정리는 호스트 쪽에서** 하라.

★**세 번째(같은 계열):** 위 문단을 메모리에 적는 명령 자체가 또 당했다. bash에서 백틱은 **명령 치환**이라 heredoc 없이 인용문에 넣으면 조용히 지워진다. 파일에 코드·정규식을 적을 땐 Write/Edit 도구를 쓸 것.
