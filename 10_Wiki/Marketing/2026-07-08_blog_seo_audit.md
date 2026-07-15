# blog.k-saju.me — SEO & 콘텐츠 정확성 감사 (2026-07-08)

작성: content-head-seoa (콘텐츠마케팅본부장)
대상: `D:\Develop\k-saju-blog` `content/posts/*.mdx` (Next.js+MDX, n8n `blogAutoPost001`이 로컬 qwen로 매일 08:10 자동생성)
계기: 형(대표) "블로그가 SEO에 맞게 작성되고 있는가?" + secretary 지시

---

## 0. 한 줄 결론

**형식 SEO는 준수(70/100)하지만, 자동생성(qwen) 글에서 사주 전문용어 오류가 반복 발생 — 이게 E-E-A-T(전문성·신뢰)를 깎아 상위노출·전환의 실질 병목.** 전체 21개 글 중 **13개를 직접 수정·빌드 통과·푸시 완료**. 근본 해결은 n8n 생성 프롬프트에 **정확 용어사전 + 키워드전략 + SEO구조 지침** 주입(§4, 서진 인계).

- 관측: 손으로 쓴 4개 글(what-is-korean-saju, saju-vs-bazi-vs-chinese-zodiac, how-to-read-your-saju-in-english, 부분적으로 four-pillars)은 용어·구조·정직성 모두 우수. 자동생성 글(author: `k-saju.me`, daily-card OG 공유)은 용어 오류·얕은 depth·구조 결함이 몰려 있음.
- 추측: qwen-7b가 한국 사주 용어를 중국 병음/환각으로 채우는 경향. 프롬프트에 사실 앵커(용어사전)를 주면 대부분 예방 가능.

---

## 1. 전체 글 목록 (21편) & 심각도

범례: 🟥치명(용어 오류·환각, E-E-A-T 직접 훼손) / 🟧보통(구조·얕음·부정확) / 🟩양호

| # | slug | 유형 | 판정 | 핵심 문제 |
|---|------|------|------|-----------|
| 1 | five-elements-saju-explained | 자동 | 🟥→수정 | "오항"(오행 오타), 로마자 뒤죽박죽(Wood=Mu·Water=Mu 중복·Earth=Sa), 상생/상극 오설명 |
| 2 | what-is-day-master-korean-astrology | 자동 | 🟥→수정 | 천간 병음표기(Jia..), **음양 오류**(Gap·Gui=yang이라 함, Gui는 陰), **ilgan 정의 오류**(일간=일지+천간 조합이라 함, 실제는 일간=일주의 천간=일간 자체) |
| 3 | day-master-personality-10-heavenly-stems | 자동 | 🟥→수정 | **최악**. "10천간" 목록이 전부 날조(吉·谷·文·清·恩 — 천간 아님). 집합명사 "천간(cheongan)"을 개별 천간처럼 취급 |
| 4 | saju-compatibility-korean-astrology-relationships | 자동 | 🟥→수정 | **"사주=인도 Jyotish"** 환각(전혀 다른 체계). "사주 궁합=수치 점수" 과장 |
| 5 | birth-hour-reveals-what-zodiac-cant | 자동 | 🟥→수정 | 7-9AM="Earth Pig" 오류(7-9AM은 辰 용시=Earth, 돼지亥는 Water·21-23시) |
| 6 | saju-and-zodiac-sign-use-both | 자동 | 🟧→수정 | "사주=음력 기반" 오해(사주는 **절기/양력 기반**, 해 바뀜=입춘 2/4). "음력 변환 필요" 오도 |
| 7 | saju-fortune-timing-luck-cycles | 자동 | 🟧→수정 | **대운(10년)≠일진(하루)** 혼동. "daeun luck pillar"를 daily에 오적용 |
| 8 | how-to-read-saju-chart-first-time | 자동 | 🟧→수정 | 오행 상극 방향 오류("wood weakened by earth" — 실제 木은 金에 극당함, 木이 土를 극함) |
| 9 | saju-element-imbalance-too-much-fire | 자동 | 🟧→수정 | 의료성 주장(불 과다→여드름·소화문제, 명상으로 완화)=YMYL 리스크·면책과 모순 |
| 10 | good-days-bad-days-saju-predict-week | 자동 | 🟧→수정 | "celestial/planetary positions" — 사주는 행성 아닌 **간지 달력** 기반 |
| 11 | what-is-saju-beginners-guide | 손(초기) | 🟧→수정 | frontmatter에 description/keywords/tags 전무(=meta description 빈칸), H3부터 시작 |
| 12 | four-pillars-of-destiny-explained | 손(초기) | 🟧→수정 | description/keywords 없음, `# H1` 중복(페이지가 title을 이미 H1 렌더) |
| 13 | eastern-vs-western-astrology-accurate | 자동 | 🟧→수정 | H2 없이 H3 시작(계층 붕괴), 내부링크 0, 얕음 |
| 14 | what-saju-says-about-career-path | 자동 | 🟩 | 하드오류 없음. 다소 얕고 fluffy하나 정확·면책 OK |
| 15 | yang-metal-yin-water-saju-element | 자동 | 🟩 | 내용 정확(경금/계수). 얕음, "sign up for account" 약한 마찰문구 |
| 16 | what-is-daily-saju-reading-how-to-use | 자동 | 🟩 | 정확·H2 정상. 얕음 |
| 17 | beyond-sun-sign-saju-deeper-than-zodiac | 자동 | 🟩 | 대체로 OK. `www.k-saju.me` 링크 1건(비일관, 나머지는 apex) |
| 18 | saju-vs-bazi-korean-chinese-astrology | 자동 | 🟩(주의) | 정확하나 #19와 **키워드 자기잠식**(둘 다 "saju vs bazi" 타겟) |
| 19 | saju-vs-bazi-vs-chinese-zodiac | 손 | 🟩⭐ | 모범. H2/표/정확 로마자/내부이미지/정직 가격·면책 |
| 20 | how-to-read-your-saju-in-english | 손 | 🟩⭐ | 모범. 단계형·정확·이미지·CTA |
| 21 | what-is-korean-saju | 손 | 🟩⭐ | 모범. 비교표·정확 오행 로마자(목화토금수) |

**자기잠식(cannibalization) 2쌍**(전략 판단 필요, 삭제는 narae/팀리드 몫):
- #11 what-is-saju-beginners-guide ↔ #21 what-is-korean-saju (둘 다 "what is saju / beginner")
- #18 saju-vs-bazi-korean-chinese-astrology ↔ #19 saju-vs-bazi-vs-chinese-zodiac (둘 다 "saju vs bazi"). #19가 압도적으로 우수 → #18은 canonical 지정 또는 각도 차별화(예: #18을 "문화적 차이" 심층으로 리포지션) 권장.

---

## 2. SEO 형식 점검 (공통 관측)

**양호**
- title 길이·키워드 배치 대체로 적절, slug 깔끔, `generateMetadata`가 canonical·OG·twitter·JSON-LD(BlogPosting) 자동 생성(page.tsx). sitemap/robots 존재. 기술 SEO 골격은 탄탄.
- 도메인 면책 문구 전 글 삽입(astrology 표준 준수, 신뢰·법적 보호). 정직성(가짜 희소성·공포마케팅 없음) — 형 원칙 부합.

**개선 필요**
- **heading 계층**: 다수 자동생성 글이 H2 없이 `###`(H3)부터 시작 → 페이지 title(H1) 다음 H3로 점프, 계층 붕괴. (five/eastern/how-to-chart/what-is-saju/birth-hour 등) → 수정분은 H2로 교정.
- **meta description 결측**: #11, #12는 frontmatter에 description 없음 → 검색결과 스니펫이 본문 임의절취. → 추가 완료.
- **내부링크 사실상 0**: 자동생성 글은 앱(k-saju.me)만 링크, 글끼리 연결 안 함 → 토픽 클러스터·체류·크롤 유도 손실. (모범글도 이미지캡션 위주, 상호링크 약함) → §4 지침에 내부링크 의무화.
- **OG 이미지 중복**: 자동생성 글 전부 동일 `api/og/daily-card?fmt=wide` 사용(글 내용과 무관·비고유). alt는 다양하나 이미지 자체 비고유 → 소셜/이미지검색 약함. (모범글은 글 전용 `/blog/*.jpg` 5종 보유, public에 실제 존재 확인)
- **depth**: 자동생성 글 400~600단어 얕음. 상위 경쟁(위키·bazi calculator·sajuastrology 등)은 심층·계산기 보유 → 최소 길이·예시·표 강화 필요.

---

## 3. 수정 완료 (직접 편집 → `bun run build` 통과 → push)

브랜치 `publish-main` → `origin/main`. 커밋 2건:

- **26d2431** `fix(content): correct Saju terminology errors across 9 posts (SEO/E-E-A-T)`
  - five-elements(오행 오타·로마자·상생상극), day-master(천간 한국로마자·음양·ilgan 정의), compatibility(Jyotish 제거→BaZi), fortune-timing(대운/일진 분리), how-to-chart(상극 방향), element-imbalance(의료주장 완화), + #11·#12 meta 보강·H1중복·H3계층.
- **dc4ec40** `fix(content): correct Saju errors in 4 newer auto-generated posts`
  - day-master-personality(날조 10천간 → 정확 10천간 Gap..Gye 재작성), birth-hour(7-9AM=용시 辰/Earth), saju-and-zodiac(음력→절기/양력 입춘), good-days(행성→간지 달력).

빌드: 21개 정적 페이지 전부 생성 성공. 라이브 오퍼 대조 완료(§ 아래) — 가격 주장 수정 불필요.

**라이브 사이트 오퍼(2026-07-08 WebFetch 확인)** — 콘텐츠 주장과 일치:
- 무료: 3 free readings, 카드 등록 없이(no card), ~10초
- Single report $4.99 / 월 구독 $7.99(데일리카드+프리미엄) / 7일 무료체험 / 언제든 해지
- 모범글의 `$4.99 / $7.99/mo / 7-day trial / no card` 정확. 자동생성 글의 모호표현("deep analysis for a fee", "monthly plan with free trial")도 안전·정합.

---

## 4. ★근본 개선 — n8n `blogAutoPost001` 생성 프롬프트 주입안 (서진 인계, 복붙용 완성 텍스트)★

> ⚠️ n8n 실제 주입은 **서진이 안전절차**(export→에디터 편집→import→`docker restart`→실제 1회 실행 검증)로. Code 노드 heredoc 직접편집 금지(과거 워크플로우 death 전례). 아래는 **완성 텍스트 3블록** — 생성 프롬프트(system 또는 user 지침부)에 그대로 삽입.

### 4-A. 정확 용어 사전 (모델이 반드시 참조 — 이걸로 환각 차단)

```
=== K-SAJU TERMINOLOGY REFERENCE (use these EXACTLY; never invent Korean terms) ===

Saju is KOREAN Four Pillars astrology. Always use KOREAN romanization, not Chinese pinyin.
Saju is based on the SOLAR calendar / 24 solar terms (절기), NOT the lunar calendar.
The Saju year begins at ipchun (입춘, ~Feb 4), not Lunar New Year.
Saju reads the CALENDAR of stems & branches — NOT planetary/celestial positions
(that is Western astrology; do not attribute planets to Saju).

FIVE ELEMENTS — Ohaeng (오행 / 五行):
  Wood  = 목 / 木 / Mok
  Fire  = 화 / 火 / Hwa
  Earth = 토 / 土 / To
  Metal = 금 / 金 / Geum
  Water = 수 / 水 / Su
  (Do NOT use pure-Korean words 불/물 for the element names; use 화/수.)
  Generating cycle (상생): Wood→Fire→Earth→Metal→Water→Wood.
  Controlling cycle (상극): Wood→Earth→Water→Fire→Metal→Wood.
    (So Wood controls Earth; Wood is controlled/cut by Metal. Never say "Wood is weakened by Earth.")

TEN HEAVENLY STEMS — Cheongan (천간 / 天干) — "cheongan" is the COLLECTIVE name, NOT a single stem:
  1 甲 Gap (갑)   = Yang Wood
  2 乙 Eul (을)   = Yin Wood
  3 丙 Byeong (병) = Yang Fire
  4 丁 Jeong (정) = Yin Fire
  5 戊 Mu (무)    = Yang Earth
  6 己 Gi (기)    = Yin Earth
  7 庚 Gyeong (경) = Yang Metal
  8 辛 Sin (신)   = Yin Metal
  9 壬 Im (임)    = Yang Water
  10 癸 Gye (계)  = Yin Water
  Yang stems: Gap, Byeong, Mu, Gyeong, Im. Yin stems: Eul, Jeong, Gi, Sin, Gye.

TWELVE EARTHLY BRANCHES — Jiji (지지 / 地支): hanja / Korean / animal / hour / element
  子 Ja  Rat     23:00–01:00  Water
  丑 Chuk Ox     01:00–03:00  Earth
  寅 In  Tiger   03:00–05:00  Wood
  卯 Myo Rabbit  05:00–07:00  Wood
  辰 Jin Dragon  07:00–09:00  Earth
  巳 Sa  Snake   09:00–11:00  Fire
  午 O   Horse   11:00–13:00  Fire
  未 Mi  Goat    13:00–15:00  Earth
  申 Sin Monkey  15:00–17:00  Metal
  酉 Yu  Rooster 17:00–19:00  Metal
  戌 Sul Dog     19:00–21:00  Earth
  亥 Hae Pig     21:00–23:00  Water
  (Note: stem 辛 Sin and branch 申 Sin share the romanization but are different — keep hanja if ambiguous.)

KEY TERMS:
  사주 Saju (四柱) = Four Pillars of Destiny
  팔자 Palja (八字) = Eight Characters (= BaZi in Chinese; Saju and BaZi are the SAME
     underlying system, Korean vs Chinese tradition. Saju is NOT Indian Jyotish.)
  일간 Ilgan (日干) = Day Stem = the DAY MASTER (your core self). It IS the heavenly stem
     of your day pillar — NOT a stem+branch combination.
  일주 Ilju (日柱) = Day Pillar (the stem+branch pair of your birth day)
  대운 Daeun (大運) = the ~10-year luck pillar/cycle (LONG term)
  세운 Seun (歲運) = annual luck (one year)
  일진 Iljin (日辰) = a single day's energy (what a "daily Saju card" reflects) — do NOT
     call daily energy "daeun".
  십신 Sipsin (十神) = the Ten Gods (relational roles of the other characters vs the Day Master)
  음양 Eumyang (陰陽) = Yin-Yang
  궁합 Gunghap (宮合) = relationship compatibility
  만세력 Manseryeok = the perpetual Saju calendar used to build a chart
  절기 Jeolgi (節氣) = the 24 solar terms that set Saju month boundaries

SELF-CHECK before finishing: every Korean term, hanja, and element/branch mapping above
must match. If unsure of a fact, describe it generally rather than inventing a specific
Korean word, hanja, hour, or element.
```

### 4-B. 타겟 키워드 전략 (영어권 글로벌 — 카테고리별 풀; WebSearch 2026-07-08 리서치 기반)

```
=== TARGET KEYWORD POOLS (English/global search intent) ===
Pick ONE primary keyword per article + 2-3 secondary; place primary in title, first
100 words, one H2, and meta description. Do NOT keyword-stuff (max ~1-1.5% density);
write for the human first. Cover a distinct sub-intent each time (avoid cannibalizing
existing posts — see the "already covered" note per category).

[Korean Saju Basics]
  primary pool: "what is saju", "korean saju reading", "four pillars of destiny",
    "saju meaning", "saju vs bazi"
  long-tail: "saju reading english", "how to read saju chart", "saju birth chart explained"
  (already covered: what-is-saju, what-is-korean-saju, four-pillars, saju-vs-bazi ×2,
   how-to-read-saju-in-english → NEW angles only: e.g. "saju calculator how it works",
   "saju eight characters explained", "manseryeok / solar terms in saju")

[Five Elements & Day Master]
  primary pool: "five elements saju / ohaeng", "day master saju", "10 heavenly stems",
    "yin yang five elements", "element balance saju"
  long-tail: "yang wood day master personality", "what is my day master", "missing element in saju",
    "sip-sin / ten gods explained", "day master compatibility"
  (already covered: five-elements, day-master ×2, yang-metal-yin-water, element-imbalance →
   NEW: individual stem deep-dives (one per stem), "ten gods (sip-sin) beginner guide")

[Daily Saju & Timing]
  primary pool: "daily saju horoscope", "saju daily reading", "daeun luck pillar",
    "lucky day saju", "saju timing"
  long-tail: "how to use daily saju card", "saju luck cycle by age", "seun annual fortune",
    "best time to start a business saju"
  (already covered: daily-saju, fortune-timing, good-days → NEW: "daeun explained by decade",
   "annual saju forecast 2026")

[Eastern vs. Western]
  primary pool: "eastern vs western astrology", "saju vs western zodiac",
    "korean vs chinese astrology", "saju vs horoscope"
  long-tail: "is saju more accurate than horoscope", "combine saju and zodiac",
    "birth time importance astrology"
  (already covered: eastern-vs-western, beyond-sun-sign, saju-and-zodiac, birth-hour →
   NEW: "saju vs vedic astrology", "why saju needs birth time")

[Love, Career & Compatibility]
  primary pool: "saju compatibility", "saju love compatibility", "gunghap",
    "saju career reading", "saju marriage"
  long-tail: "saju compatibility by day master", "best career for wood day master",
    "saju compatibility calculator accuracy", "gunghap explained"
  (already covered: compatibility, career → NEW: element-pair compatibility guides,
   "saju wealth / money luck")

CROSS-CUTTING high-intent (global K-culture wave): "korean astrology", "k-astrology",
  "saju app", "free saju reading", "saju calculator". Weave naturally where relevant.
```

### 4-C. SEO 구조 & 정직성 지침 (생성 규칙)

```
=== SEO & STRUCTURE RULES (every generated post) ===
1. FRONTMATTER (all required): title, description, date, slug, category, keywords[], tags[], author.
   - title: 50-60 chars, primary keyword near the front, one clear benefit/curiosity hook.
   - description (meta): 140-160 chars, include primary keyword, one concrete promise. NEVER leave blank.
   - keywords: 3-5 real search phrases from the category pool (§4-B), not generic tags.
2. HEADINGS: The page already renders the title as the H1. Body must START AT H2 (##),
   never H1 (#) and never jump straight to H3. Use H3 (###) only nested under an H2.
   3-6 H2 sections. Put the primary keyword in at least one H2.
3. INTRO: primary keyword within the first 100 words; state what the reader will gain.
4. LENGTH: minimum ~700 words; include at least one concrete example and, where useful,
   a small comparison table. Go one level deeper than a dictionary definition.
5. INTERNAL LINKS: link to 2-3 OTHER blog posts using descriptive anchor text
   (e.g. [your Day Master](/blog/what-is-day-master-korean-astrology)). This builds the
   topic cluster. (Maintain a slug list in the workflow to link against.)
6. IMAGE: keep the hero image but give it a UNIQUE, descriptive alt tied to THIS article's
   topic (not a generic "daily card"). Where possible use a topic-specific image path.
7. CTA: one honest CTA to k-saju.me. Offer facts must match live site: 3 free readings,
   no card needed; $4.99 single report; $7.99/mo with 7-day free trial; cancel anytime.
   Prefer safe phrasing ("free, no card needed") over hard numbers that may change.
8. HONESTY (non-negotiable — 형 core principle): NO fake scarcity, NO fake countdowns,
   NO fake stats, NO fear-selling, NO medical/legal/financial claims. Saju framed as
   "entertainment & self-reflection". Keep the standard disclaimer line at the end.
9. ACCURACY: obey §4-A terminology reference. Self-check all Korean terms/hanja/mappings
   before output. When unsure, generalize — never invent a Korean word, hanja, or mapping.
```

---

## 5. 남은 권고 (형/팀 결정 필요)

1. **자기잠식 2쌍 정리** — #18을 #19로 canonical/301 또는 각도 리포지션; #11↔#21 중 하나를 supporting으로. (전략=narae)
2. **글 전용 이미지** 확대 — 자동생성 글의 daily-card 중복 OG를 토픽별 이미지로. (미디어=시우, media-creation)
3. **내부링크 백필** — 기발행 자동생성 글에 상호링크 소급 추가(1회 배치 편집).
4. **depth 보강** — 얕은 🟩 글(career/daily/yang-metal)에 예시·표 추가 2차 패스.
5. **n8n 주입 실행** — §4 텍스트를 서진이 안전절차로 반영 후 다음 자동생성분부터 검증.

---
관측/추측 분리 표기. 수정분은 실제 `bun run build` 통과·push 검증 완료(추측 아님).
