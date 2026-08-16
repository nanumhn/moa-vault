---
title: "k-saju 콘텐츠 주제 확장 기획 — 팔자·운세·궁합·12지신"
date: 2026-08-17
author: content-head-seoa (콘텐츠마케팅본부장 이서아)
trigger: 형 2026-08-17 — "사주 외에 팔자, 운세, 궁합, 12지신 등 다른 컨텐츠가 필요함"
scope: **콘텐츠만**. 앱 기능 개발 아님(궁합 기능 규모산정은 cto 별도 진행)
status: 형 결재 대기 — 결재 항목 3건(§9)
related:
  - ../Finance/weekly/2026-W34_ksaju-audience-zero-diagnosis.md (CSO 오디언스 0 진단)
  - 2026-W33_growth_channel_switch.md (narae — SEO 신규발행 중단 확정)
  - ../Projects/2026-06-28-daily-fortune-content-line-PLAN.md (띠별 운세 기획 — 검수통과 후 미출항)
  - 2026-06-28-k-saju-content-calendar-MASTER.md
guardrails: 사실 정합(free·no card / $4.99 단건 / $7.99월·7일체험, 2026-08-17 라이브 확인) · entertainment & self-reflection 면책 · 다크패턴·공포마케팅·가짜희소성 0 · 미측정 수치는 전부 [추정] 표기
---

# k-saju 콘텐츠 주제 확장 기획

> **한 줄:** 문제는 "주제가 적다"가 아니라 **47편 전부가 독자에게 "saju"라는 단어를 이미 알 것을 요구한다**는 것이다. 12지신·궁합·운세는 **대중이 이미 아는 입구**다. 다만 그 입구를 열기 전에, 우리 엔진의 **일진 지지(띠) 계산이 2칸 틀려 있다**(§2) — 12지신 콘텐츠는 이걸 고치기 전엔 한 장도 발행하면 안 된다.

---

## 0. 먼저, 정직한 한계 — 이 기획서가 못 하는 것

CSO 8/16 진단의 결론은 **"콘텐츠가 아니라 배포 채널이 병목"**이었다. 이 기획서는 그 판정을 뒤집지 않는다.

- 주제를 넓혀도 **팔로워 0인 계정에 올리면 여전히 조회수 0**이다. 주제 확장 자체는 도달을 만들지 못한다.
- 그래서 이 기획의 선정 기준을 하나 바꿨다: **"재미있는 주제"가 아니라 "자기 배포 수단을 들고 오는 주제"**를 골랐다.
  - 12지신 = 해시태그가 이미 존재하는 12개 커뮤니티(#yearofthetiger 등) + "내 띠 찾기" 자기식별
  - 궁합 = "상대를 태그해야 완성되는" 구조 = 공유가 콘텐츠의 일부
  - 운세 = 반복 소비 습관
  - 팔자 = 자기 배포 수단 **없음** → 그래서 우선순위 최하위(§4)
- **[정직]** 위 메커니즘이 실제로 도달을 만들지는 **실측 전엔 전부 [추정]**이다. 8/16 실측 기준선은 조회수 0~1이므로, 2주 뒤 "조회 20"이라도 그건 성공이 아니라 **첫 신호**로만 읽는다.

---

## 1. 실측 — 정말 사주 단일주제인가 (표본 아닌 전수)

`D:\Develop\k-saju-blog\content\posts\*.mdx` **47편 전수 확인**(형 브리핑의 43편은 W33 시점 수치, 현재 47편).

| 측정 | 값 | 구분 |
|---|---|---|
| 전체 발행글 | **47편** | [실측] |
| 슬러그에 `saju` 문자열 포함 | **39편 (83%)** | [실측] |
| 나머지 8편도 사주 개념어(day master·four pillars·heavenly stems·birth hour) | **8편** | [실측] |
| **→ 사주 프레임 밖에서 진입 가능한 글** | **0편 (0%)** | [판정] |
| 12지신이 **주제**인 글 | **0편** | [실측] |
| 12지신이 **언급**된 글 | 6편 — 전부 `vs saju` 대조군 | [실측] |
| 궁합 주제 글 | 4편 — 전부 "**saju** compatibility" 프레임 | [실측] |

**[판정] 형 지적은 정확하다. 단, 정밀하게 말하면 "주제 편중"보다 "입구 편중"이다.**
- 카테고리상으론 궁합 4편·운세 7편·팔자 4편이 이미 있다. 주제가 아주 없진 않다.
- 그러나 **전부 "사주를 아는 사람"을 전제로 쓰였다.** 12지신 언급 6편조차 "사주가 띠보다 깊다"는 **띠를 깎는** 논조라, 띠로 들어온 독자를 맞이하는 글이 하나도 없다.
- 데일리 카드도 동일: 개인 명식 기반 = **생년월일시를 입력해야** 볼 수 있다. 진입장벽이 콘텐츠 자체에 박혀 있다.

**이게 왜 매출 문제인가 — [실측] 근거**
CSO 8/16 조회: 지난 7일 `saju reading` 노출 8회·평균순위 62.7위, 비브랜드 클릭 28일간 **0회**. 즉 우리는 **수요가 거의 없는 단어를 유일한 입구로 쓰고 있다.** 반면 12지신·궁합·오늘의운세는 영어권에서 이미 통용되는 검색어군이다(chinese/korean zodiac, compatibility, daily horoscope). 정확한 볼륨은 미측정 → [추정]이지만, **"아무도 모르는 단어" vs "이미 아는 단어"의 구조적 차이**는 추정이 아니라 위 실측이 보여준다.

---

## 2. 🔴 착수 전 반드시 고칠 것 — 일진 지지(띠) 계산 2칸 오차

12지신 콘텐츠는 **날짜의 지지(=동물)**를 다룬다. 그런데 그 값을 내는 엔진이 틀렸다.

`saju-studio/src/lib/saju/engine.ts` L52~59 `sexagenaryFromJDN()`의 기준점이 잘못됐다.
```
const base = 2446101;  // 주석: "1985-02-04 = 갑자(甲子) 근접 기준점. 정확하지 않음 — v0 추정"
```
실제 1985-02-04는 **甲戌**일이다(甲子 아님). 기준점이 **10일** 어긋나 있다.

**검증 — 널리 알려진 기준일 2개로 교차확인 [실측]**

| 날짜 | 알려진 일주 | 현재 엔진 출력 | 수정 후 |
|---|---|---|---|
| 1900-01-01 | 甲戌 | 甲**子** (Rat) ❌ | 甲戌 (Dog) ✅ |
| 2000-01-01 | 戊午 | 戊**申** (Monkey) ❌ | 戊午 (Horse) ✅ |

**증상이 교묘한 이유:** 10일 오차라서 **천간(10주기)은 우연히 항상 맞고, 지지(12주기)만 2칸 틀린다.**
- → 기존 "오늘의 오행" 콘텐츠는 오행이 **천간**에서 나오므로 **결과적으로 정확했다.** (기존 발행물 회수 불필요)
- → 그러나 **동물/지지를 이름 붙이는 순간 매일 틀린다.** 12지신 라인은 정확히 이 부분을 쓴다.
- 실제 피해 예: 2026-06-28 승인기획서의 샘플이 "일진 = 癸亥(Pig day)"라고 적혀 있는데 **실제는 癸酉(Rooster day)**다. 그 라인이 그대로 출항했으면 매일 틀린 띠를 발행할 뻔했다.

### 2-1. 🔴🔴 추가 발견 (8/17 재검증) — 이건 콘텐츠 문제가 아니라 **라이브 유료 제품 결함**이다

기획서 작성 후 코드를 다시 훑다가, 이 버그가 **콘텐츠 착수 선행조건**에 그치지 않는다는 걸 확인했습니다. **이미 결제한 고객에게 틀린 값이 나가고 있습니다.**

| 경로 | 영향 | 구분 |
|---|---|---|
| `engine.ts` L877 `animalEn: BRANCH_ANIMAL[p.branch].en` → `app/[locale]/report/premium/page.tsx` **L185에서 화면 출력** | **유료 프리미엄 리포트가 일주(日柱) 동물을 틀리게 표시** | [실측] |
| `elementProfile()` L145 `counts[BRANCH_ELEMENT[p.branch]]++` | 일지 오행이 **항상** 틀리게 집계됨 → 8칸 중 1칸 오염 | [실측] |
| 위 counts → `dominant`/`deficient` → `moodKeyword`(L156 룰표) → 본문 | 우세/결핍 오행이 **뒤집힐 수 있음** → 리딩 텍스트까지 영향 | [판정] |

**"항상 틀린다"의 근거:** 엔진 지지 = 정답 지지 **+2칸**. 12개 지지 전부에 대해 +2칸 이동이 오행을 바꿉니다(子water→寅wood, 丑earth→卯wood, … 12/12 전부 변경). 즉 **일지 오행은 우연히 맞는 경우가 없습니다.**

**영향받지 **않는** 것 (과잉경보 방지 — 교차확인함):**
- 연주 = `yearPillar()`(1984 기준 별도 로직), 월주 = `monthPillar()` → **무관** [실측]
- 시주 = `hourPillar(dayP.stem, h)` — 지지를 **시각에서 직접** 뽑고 일**간**(10주기라 정상)만 받음 → **정확** [실측]
- 데일리 카드 오행 = `dayPillarElement()` L395가 `STEM_ELEMENT[p.stem]` **천간 기준** → **정확**. 따라서 §2 본문의 "기존 발행 콘텐츠 회수 불필요" 판정은 **유지됩니다** [실측]
- → 4기둥 중 **일주 하나만** 오염. 다만 그게 사주에서 가장 중요한 기둥입니다.

**그래서 결재 ①의 성격이 바뀝니다.** "12지신 콘텐츠 착수하려면 고쳐야 함"이 아니라 **"유료 고객에게 이미 틀린 값이 나가는 중 → 콘텐츠와 무관하게 즉시 수리"**입니다. 12지신 라인을 안 하기로 결정하셔도 이건 고쳐야 합니다.
> ⚠️ 결제 건수·환불 필요 여부는 제 권한 밖입니다. **cto-seojin(수리) + data-finance(영향받은 결제 건수 조회) + 형(고지 여부 판단)** 으로 넘깁니다. 유료 리포트를 받은 고객 수가 0이면 조용히 고치면 되고, 1명 이상이면 고지 여부를 형이 정하실 사안입니다.

**수정안 (cto-seojin, 1줄):** 기준점을 검증된 甲子일로 교체 — `base = 2451491` (= **1999-11-08 = 甲子일**). 모듈로 로직은 그대로.
> 이건 콘텐츠본부 권한 밖이라 제가 고치지 않았습니다. **cto가 만세력으로 최종 대조 후 수정 + `engine.test.ts`에 위 기준일 2개를 회귀 테스트로 박아주실 것**을 요청합니다. 이 수정 전엔 12지신 발행 착수 금지(§9 결재 ①).

**왜 이걸 콘텐츠 기획서에 쓰는가:** 7/8 SEO 감사에서 E-E-A-T를 깎은 1순위가 **용어·사실 오류**였다. 같은 실수를 자동화로 매일 반복하는 구조를 만들 뻔했다.

---

## 3. 주제 4개 재정의 — 4개를 다 따로 만들지 않는다

형이 주신 4개를 그대로 4개 라인으로 만들면 제작량만 4배가 된다. 실제 구조는 이렇다.

| 형이 주신 주제 | 실제 정체 | 취급 |
|---|---|---|
| **12지신** | **캐스트(등장인물)** — 12명의 캐릭터 | ★ 핵심 자산 |
| **운세** | **포맷(그릇)** — 매일 반복되는 형식 | 12지신을 담는 그릇 |
| **궁합** | **공유 장치** — 2명이 있어야 성립 | 독립 라인(정적 콘텐츠로 가능) |
| **팔자** | **정서적 깊이** — 운명 vs 선택 | 기존 글과 중복 많음, 후순위 |

**→ 12지신 × 운세 = 한 라인이다.** "띠별 오늘의 운세". 별개 라인 2개가 아니라 **캐릭터를 포맷에 태우는 것**이고, 그래서 제작 부담 없이 매일 신선한 콘텐츠가 나온다.

**팔자에 대한 정직한 보고:** 4개 중 **가장 덜 새롭다.**
- 팔자(八字) = 사주의 여덟 글자 = 사실상 사주와 같은 말이다. 한국어 구어에서 "팔자"가 갖는 *운명론적 뉘앙스*만 다르다.
- 그 뉘앙스는 기존 글 `can-you-change-your-saju-fate-vs-free-will`, `can-saju-predict-future-honest-look`이 **이미 다루고 있다.** [실측]
- 그래서 팔자는 **신규 주제가 아니라 기존 자산의 앵글 전환**으로 다룬다(§8). 4개를 동일 비중으로 배분하지 않는 이유를 형께 명시적으로 보고드립니다.

---

## 4. 우선순위와 근거 (= 학습 기록)

**P0 · 12지신 × 띠별 운세** — 최우선

| 근거 | 구분 |
|---|---|
| ① **진입장벽이 실질적으로 0.** 사주카드는 생년월일**시**가 필요하지만 띠는 **태어난 해**만 알면 된다. 8/16 진단의 "오디언스 0"에서 첫 도달을 만들려면 마찰이 가장 낮은 콘텐츠가 필요 | [판정] |
| ② **개발 0.** 엔진에 `BRANCH_ANIMAL`(12동물 한/영)·`BRANCH_ELEMENT`·`relationOf`가 **이미 있다**(§2 수정만 하면 됨). 새 기능 없이 내일부터 생산 가능 | [실측] engine.ts L586 |
| ③ **소재 고갈 불가.** 12띠 × 5오행일 = 60조합이 60일 간지주기로 순환 → 두 달간 같은 조합 없음. 형이 지적하신 "반복 콘텐츠 만들기 좋은 소재"가 수학적으로 사실 | [판정] |
| ④ **자기식별 → 저장·태그.** "내 띠 찾기"는 팔로워 0에서도 해시태그로 발견될 수 있는 몇 안 되는 형식 | [추정] |
| ⑤ **이미 승인된 미출항 자산.** 6/28 기획서가 검수통과했으나 빌드 안 되고 방치됨. 새 베팅이 아니라 **재고 출고** | [실측] |
| ⑥ **차별화 축이 있다.** 흔한 "중국 12띠"가 아니라 **한국 십이지신 = 동물 머리를 한 수호신** 계보로 간다(§5). 같은 12마리인데 캐릭터 톤이 다름 | [판정] |

**P1 · 궁합** — 앱 기능 없이도 **지금 가능** (형 질문 4번에 대한 답: **가능하다**)
- 근거: 궁합의 고전 규칙(삼합·육합·충)은 **태어난 해 띠만으로 결정되는 고정표**다. 개인 명식 계산도, LLM 창작도, 앱 기능도 필요 없다. 12×12 격자가 통째로 정적 콘텐츠가 된다. [판정]
- 부가 이점: 결정론적이라 **환각이 원리적으로 불가능**하다(7/8 감사에서 자동생성 궁합글이 "사주=인도 Jyotish"라고 환각한 전례 있음 → 표 기반이면 재발 불가).
- 공유 구조: "상대를 태그해야 완성"되는 유일한 주제.

**P2 · 운세(운세 단독 포맷)** — P0에 흡수. 별도 투자 없음.

**P3 · 팔자** — §3 사유로 후순위. 주 1편 에세이로만.

> **한 줄 근거 요약:** 12지신 = *개발 0 + 장벽 0 + 소재 무한 + 자기배포 + 승인된 재고*. 네 주제 중 유일하게 5개를 동시에 만족한다.

---

## 5. P0 — 12지신 × 띠별 운세 (게시용)

### 5-1. 브랜드 앵글 — "12 Guardians", 귀여운 띠 동물이 아니라 **수호신**

십이지신(十二支神)은 한국 불교미술·왕릉 십이지상에서 **동물 머리에 무장한 수호신**으로 나타난다. 각 신은 **하나의 시간대(2시간)와 방위**를 지킨다. 이건 "무슨 띠세요?"보다 훨씬 강한 캐릭터이고, 포화된 "chinese zodiac" 톤과 우리를 갈라놓는다.
> ⚠️ **발행 전 확인 필요:** 특정 사찰·유물 이름을 본문에 넣을 경우 형/제가 1차 출처를 확인한 뒤 넣습니다. 초안에는 검증 가능한 일반 서술(동물 머리 수호신·시간과 방위 수호)만 사용했습니다.

**제품 연결(중요):** 12지신은 **시간(時)**을 지킨다 → 우리 앱은 **태어난 시(時柱)를 이미 계산한다**. 즉 "네 탄생 시각을 지키는 수호신은 누구인가"는 **없는 기능을 파는 게 아니라 있는 기능으로 보내는** 콘텐츠다. (궁합과 결정적으로 다른 점)

**12지신 기본표 (콘텐츠 공용 마스터 — 이 표를 모든 제작물의 사실 기준으로 삼는다)**

| # | 動物 | Animal | 지지 | 오행 | 수호 시간(KST) | 방위 |
|---|---|---|---|---|---|---|
| 1 | 쥐 | Rat | 子 | Water | 23:00–01:00 | North |
| 2 | 소 | Ox | 丑 | Earth | 01:00–03:00 | NNE |
| 3 | 호랑이 | Tiger | 寅 | Wood | 03:00–05:00 | ENE |
| 4 | 토끼 | Rabbit | 卯 | Wood | 05:00–07:00 | East |
| 5 | 용 | Dragon | 辰 | Earth | 07:00–09:00 | ESE |
| 6 | 뱀 | Snake | 巳 | Fire | 09:00–11:00 | SSE |
| 7 | 말 | Horse | 午 | Fire | 11:00–13:00 | South |
| 8 | 양 | Goat | 未 | Earth | 13:00–15:00 | SSW |
| 9 | 원숭이 | Monkey | 申 | Metal | 15:00–17:00 | WSW |
| 10 | 닭 | Rooster | 酉 | Metal | 17:00–19:00 | West |
| 11 | 개 | Dog | 戌 | Earth | 19:00–21:00 | WNW |
| 12 | 돼지 | Pig | 亥 | Water | 21:00–23:00 | NNW |

### 5-2. 블로그 글감 (영어, blog.k-saju.me)

> ⚠️ W33에서 **SEO 신규발행 중단**이 확정돼 있습니다. 아래 글들은 **SEO 재개 요청이 아니라**, 인스타/숏폼에서 링크를 받을 **랜딩(도착지)** 목적입니다. 링크 보낼 곳이 없으면 소셜 콘텐츠가 앱으로 이어지지 않습니다. 이 프레이밍은 narae 확인이 필요합니다(§10).

| # | SEO title | slug | 역할 |
|---|---|---|---|
| **B1** ★ | What Is Your Korean Zodiac Animal? Find Yours by Birth Year (Full Chart) | `/korean-zodiac-animal-by-birth-year` | **피라 랜딩** — 모든 IG "내 띠 찾기"가 여기로 |
| **B2** ★ | The 12 Guardians of the Korean Zodiac: Your Animal, Your Hour, Your Direction | `/12-guardians-korean-zodiac` | 필러 — 브랜드 차별화 축 |
| **B3** | Which Guardian Rules the Hour You Were Born? | `/zodiac-guardian-of-your-birth-hour` | **앱 기능(시주)으로 직결** = 전환 최우선 |
| **B4** | Korean Zodiac vs Chinese Zodiac: Same 12 Animals, Different Story | `/korean-vs-chinese-zodiac` | 대형 키워드에서 우리 쪽으로 다리 |
| **B5~B16** | *(12편 시리즈)* Year of the {Rat…Pig}: Personality, Element, Lucky Hour & Best Matches | `/year-of-the-{animal}` | 롱테일 12편 + 궁합·운세로 내부링크 허브 |

**B1 도입부 (복붙 가능 초안)**

> **SEO title:** What Is Your Korean Zodiac Animal? Find Yours by Birth Year (Full Chart)
> **Meta:** Find your Korean zodiac animal by birth year, then see the element, hour, and direction it guards. A complete 12-animal chart — no birth time needed.
> **Keywords:** korean zodiac animal · zodiac by birth year · 12 zodiac animals

Most people can name their zodiac animal and stop there. "I'm a Tiger." Fine — but in the Korean tradition that animal isn't just a label you were assigned at birth. It's a **guardian**: one of twelve figures who each hold a two-hour watch over the day and face a fixed direction on the compass.
So the useful question isn't *which animal are you*. It's *what does your guardian actually do*.
Here's the chart. Find your birth year, then keep reading — your animal comes with an element, an hour, and a direction, and those three tell you far more than the animal alone.

*(→ 12행 표 삽입 · 각 행에서 B5~B16 개별 글로 내부링크)*

**주의:** 띠는 **입춘(2월 초) 기준**으로 바뀐다. 1~2월 초 출생자는 전년도 띠일 수 있다 — 표 아래 이 단서를 반드시 넣는다. (7/8 감사에서 "사주=음력 기반" 오해가 지적된 바 있음. 양력 1/1 기준으로 쓰면 매년 수천 명에게 틀린 답을 준다.)

**푸터 고정:** *For entertainment & self-reflection — not professional (medical, legal, or financial) advice.*

### 5-3. 데일리 카드 포맷 (n8n 파이프라인 — 기존 v4_ig 재사용)

**포맷 A — "Today's Guardian on Duty" (1장, 매일)** ← §2 수정 후에만 가능
```
오늘의 수호신: {동물}  ·  {오행} day
─────────────────────
"{한 줄 무드}"
🎨 {오행 컬러}   🧭 {방위}   ⏰ {수호 시간}
✅ 오늘 해볼 작은 일 1개
─────────────────────
for entertainment & self-reflection
```
- 데이터: `dayPillar()`의 **지지** → `BRANCH_ANIMAL` + `BRANCH_ELEMENT` (전부 기존 상수)
- **실제 값으로 검증한 다음 3일치** *(수정된 계산 기준, 발행 전 cto 재확인 필요)*:
  - **8/18(월) = 甲子 · Rat day** ← **60일 간지 주기가 새로 시작되는 날(甲子일)**
  - 8/19(화) = 乙丑 · Ox day
  - 8/20(수) = 丙寅 · Tiger day
- 🎁 **런칭 훅:** 8/18이 **60일 주기의 1일차**다. "The 60-day cycle restarts today" — 지어낸 희소성이 아니라 **달력상 사실인** 런칭 명분. 이 날짜를 놓치면 다음 기회는 60일 뒤다.

**포맷 B — "12 Zodiacs Today" (12칸 캐러셀, 매일 또는 주 3회)**
6/28 승인 기획서의 관계 매핑(same=Focus / resourced=Support / output=Express / wealth=Gain / pressure=Temper)을 그대로 사용. 오행일이 바뀌면 12띠의 관계 분포가 통째로 재배열 → 매일 신선. **문구는 관계별 템플릿 복붙이 아니라 띠별 변주**(복붙 티 방지).

**포맷 C — "Guardian of the Hour" (주 1회, 앱 유도용)**
"지금 이 시각은 {동물}의 시간입니다" → "그럼 **네가 태어난 시각**의 수호신은? → 무료로 확인" → 앱(시주 계산은 이미 존재).

**포맷 D — "Your Animal This Week" (일요일, 주간 요약 캐러셀)**
주중 카드 재활용 = 신규 제작 부담 0.

### 5-4. 인스타 포스트 아이디어 (@ksaju.daily)

| # | 포맷 | 내용 | 배포 장치 |
|---|---|---|---|
| **I1** ★ | 캐러셀 12장 | "Find your animal" — 연도표 1장 + 동물 12장 | 12개 띠 해시태그 동시 진입 |
| **I2** | 단일 카드 | 포맷 A 데일리 (매일) | 계정 활동성·일관성 |
| **I3** ★ | 캐러셀 4장 | **"The 4 friend circles"** — 삼합 3인조 4그룹. "네 두 동맹을 태그해" | **태그 유발 = 최강 공유장치** |
| **I4** | 릴스 12초 | 12마리를 오행 컬러로 빠르게 넘기며 "which one are you?" 끝에 정지 | 릴스 = 팔로워 0에서도 도달 나는 유일 포맷 [추정] |
| **I5** | 단일 카드 | "이 시각의 수호신" — 하루 중 해당 시간대에 발행 | 시간 훅 |

**I1 캡션 (복붙 가능)**
> Everyone knows their animal. Almost no one knows what it guards. 🐅
> In the Korean tradition each of the 12 zodiac animals is a **guardian** — each holds a two-hour watch over the day and faces one direction on the compass. Your animal comes with an element, an hour, and a direction.
> Swipe to find your birth year → then check what your guardian actually rules.
> One note: the zodiac year turns at **early February**, not January 1. Born in January? You may be the previous animal.
> Which one are you? 👇
> *For entertainment & self-reflection only — not professional advice.*
> Free reading, no card needed → k-saju.me (link in bio)
> #koreanzodiac #chinesezodiac #zodiacanimals #yearofthetiger #saju #fourpillars #eastermastrology #zodiacsigns

*(해시태그는 12띠별 포스트마다 해당 동물 태그로 교체 — #yearoftherat, #yearoftheox … 12개 커뮤니티에 분산 진입)*

**I3 캡션 (복붙 가능 — 태그 유발형)**
> Some people just *click* with you. The Korean zodiac has a name for it. ✨
> Twelve animals fall into **four trios** — each trio shares one element and, traditionally, one temperament. If you've ever wondered why one friend gets you instantly, check whether they're in your circle.
> 🌊 Water trio — Rat · Dragon · Monkey
> ⚙️ Metal trio — Ox · Snake · Rooster
> 🔥 Fire trio — Tiger · Horse · Dog
> 🌿 Wood trio — Rabbit · Goat · Pig
> Find your trio → tag the two who complete it. 👇
> *For entertainment & self-reflection only — not professional advice.*

> ✅ **정직 점검:** 위 삼합 그룹은 고전 규칙(申子辰·巳酉丑·寅午戌·亥卯未)의 정확한 반영이며 지어낸 조합이 아닙니다.

---

## 6. P1 — 궁합 (앱 기능 없이 지금 가능)

### 6-1. 왜 기능 없이 되는가

궁합의 고전 규칙 3종은 **띠(태어난 해)만으로 확정**된다. 계산도 개인화도 필요 없다.

| 규칙 | 내용 | 콘텐츠화 |
|---|---|---|
| **삼합(三合)** | 申子辰(Water) · 巳酉丑(Metal) · 寅午戌(Fire) · 亥卯未(Wood) | "네 3인조" — 정체성·태그 (I3) |
| **육합(六合)** | 子丑 · 寅亥 · 卯戌 · 辰酉 · 巳申 · 午未 | "짝" — 연인·베프 앵글 |
| **충(沖)** | 子午 · 丑未 · 寅申 · 卯酉 · 辰戌 · 巳亥 | **"마찰"** — 아래 톤 규칙 준수 |

### 6-2. 🔴 톤 규칙 — 충(沖)을 "저주"로 팔지 않는다

형 핵심 원칙(공포 마케팅 금지) 직결 항목입니다. 궁합 콘텐츠는 불안 조장으로 결제를 유도하기 가장 쉬운 주제입니다.

- ❌ 금지: "이 조합은 최악" · "헤어질 운명" · "이 사람과는 결혼하지 마세요"
- ✅ 사용: **"마찰의 종류"**로 서술 — *"A clash isn't a verdict. It's a description of where the friction usually shows up — and knowing that is what lets two people work around it."*
- ✅ 모든 궁합 글에 1줄 고정: *"Compatibility here describes tendencies, not outcomes. No chart decides a relationship — two people do."*

### 6-3. 산출물

**블로그**
| # | SEO title | slug |
|---|---|---|
| **C1** ★ | Korean Zodiac Compatibility Chart: All 12 Animals (Full Grid) | `/korean-zodiac-compatibility-chart` |
| **C2** | The Four Trios: Why Some Zodiac Animals Instantly Get Along | `/korean-zodiac-three-harmonies` |
| **C3** | Zodiac Clashes Explained — and Why a Clash Is Not a Dealbreaker | `/zodiac-clash-not-a-dealbreaker` |
| **C4~** | *(선택 12편)* Who Is the {Rat} Most Compatible With? | `/{animal}-compatibility` |

> C1은 12×12 격자를 **표 이미지**로 제작 → 저장·스크린샷 공유가 일어나는 유일한 형태. (이미지 제작은 media/coo 발주 §10)

**데일리 카드 / IG**
- "오늘 잘 맞는 띠" 1줄 카드(일진 지지와 육합·삼합 관계인 띠 표시) — 데일리 카드에 한 줄로 얹기, 제작비 0
- 주 1회 "Pair of the week" — 육합 6쌍을 6주 순환
- I3 4인조 캐러셀(§5-4)

**팔자·운세와의 관계:** 궁합은 앱 기능이 없으므로 **CTA를 궁합으로 걸지 않는다.** "궁합 보러 가기" 버튼을 만들면 없는 기능을 약속하는 것 → 금지. CTA는 항상 **존재하는 기능**(무료 사주 리딩·데일리 카드·시주)으로만 보낸다. ← sales-head-jio 정합 확인 필요

---

## 7. P2 — 운세 (포맷, P0에 흡수)

별도 제작 라인 아님. P0 포맷 A/B가 곧 "오늘의 운세". 추가로 확장 가능한 주기만 정리.

| 주기 | 산출물 | 신규 제작량 |
|---|---|---|
| 일 | 포맷 A(수호신) + B(12띠) | 자동 |
| 주 | 포맷 D(주간 요약) | 재활용 |
| 월 | "Month of the {지지}: what shifts" 블로그 1편 | 월 1편 |
| 연/절기 | 입춘(띠가 바뀌는 날) 특집 — **연 1회 최대 트래픽 기회** | 사전 제작 |

> 블로그 기존 자산 `saju-new-month-energy-forecast-how-to-read`, `monthly-energy-flow-saju-trends`가 이미 있음 → 월간 운세는 **신규 집필이 아니라 기존 글 갱신**으로 처리.

---

## 8. P3 — 팔자 (신규 아님, 앵글 전환)

§3에서 보고드린 대로 기존 글과 중복이 큽니다. 신규 12편을 쓰는 대신 **주 1편 에세이**로 정서적 깊이만 담당합니다.

| # | 제목 | 비고 |
|---|---|---|
| P1 | "Palja": The Korean Word for the Life You Were Handed | 단어 자체를 소개 — 문화 앵글, 신규성 있음 |
| P2 | Can You Change Your Palja? What Koreans Actually Believe | 기존 `fate-vs-free-will` **리라이트**(신규 아님) |
| P3 | Why Koreans Say "Don't Curse Your Palja" | 관용구 문화 콘텐츠 |

**톤:** 팔자는 운명론이라 공포 마케팅으로 미끄러지기 가장 쉽습니다. 결론은 항상 **"운명을 알아서 체념하려는 게 아니라, 패턴을 알아서 선택을 낫게 하려는 것"**으로 닫습니다.

---

## 9. 2주 실행 일정 (8/18~8/31) 및 결재 항목

**전제:** 인스타 이벤트(캐러셀)는 그대로 진행. 아래는 **이벤트가 쓰지 않는 요일/슬롯만** 사용하며, 이벤트 게시물과 같은 날 겹치면 **이벤트가 우선**입니다.

### Week 1 (8/18~8/24) — 고치고, 하나 띄운다

| 날짜 | 작업 | 담당 |
|---|---|---|
| **8/18(월)** | 🔴 **일진 지지 계산 수정 + 회귀테스트**(§2) | cto-seojin |
| 8/18(월) | B1 "Find your animal by birth year" 발행 (랜딩 확보) | 서아 |
| 8/18(월) | **I1 캐러셀 12장 발행** — *"60일 주기가 오늘 새로 시작"* 훅 | 서아 + 이미지 발주 |
| 8/19(화)~ | 포맷 A 데일리 수호신 카드 **수동 5일 운영**(자동화 전 검증) | 서아 |
| 8/20(수) | B2 "The 12 Guardians" 필러 발행 | 서아 |
| 8/22(금) | **I3 4인조 캐러셀**(태그 유발) 발행 | 서아 |
| 8/24(일) | 1주차 실측 — 도달·저장·해시태그 유입 (기준선=조회 0~1) | 서아 → narae |

> **수동 5일 먼저 돌리는 이유:** 자동화부터 붙이면 틀린 걸 자동으로 매일 발행하게 됩니다(§2가 정확히 그 사고였습니다). 5일 수동 검증 후 n8n 이관.

### Week 2 (8/25~8/31) — 되는 게 보이면 양산

| 날짜 | 작업 |
|---|---|
| 8/25(월) | 1주차 실측 리뷰 → **계속/중단 판단**. 도달이 여전히 0이면 콘텐츠가 아니라 배포 문제로 재확정하고 **양산 중단**(§0) |
| 8/25~ | 데일리 수호신 카드 **n8n 자동화 이관**(v4_ig 재사용) |
| 8/26(화) | C1 궁합 12×12 격자 발행(+표 이미지) |
| 8/27(목) | B3 "탄생 시각의 수호신" 발행 — 앱 전환 링크 |
| 8/28(금) | I4 릴스 12초 |
| 8/25~8/31 | B5~B16 12편 배치 집필(띠별) — 되는 게 확인된 경우에만 |
| 8/31(일) | 2주 종합 실측 → 수익리뷰 인계 |

### 🔴 형 결재 필요 3건

| # | 항목 | 제안 |
|---|---|---|
| **①** | 일진 지지 2칸 오차 수정을 cto에 발주 (§2) — **12지신 라인 착수의 선행조건이자, §2-1대로 라이브 유료 리포트가 이미 틀린 일주 동물·오행을 출력 중인 결함**. 12지신을 안 하기로 하셔도 수리 필요 + data-finance에 영향 결제건수 조회 병행 | **승인 권장 (최우선)** |
| **②** | 12지신 블로그 4~5편 발행 — W33 "SEO 신규발행 중단"과의 관계 정리 (SEO 베팅이 아니라 소셜 랜딩 목적) | **승인 권장** (narae 확인 병행) |
| **③** | 8/18 런칭 강행 여부 — 60일 간지주기 시작일, 놓치면 다음은 60일 뒤 | **승인 권장** |

---

## 10. 리스크·미해결

| 항목 | 상태 |
|---|---|
| **narae(강나라) 도달 불가** — `No agent named 'growth-head-narae' is reachable`. 이벤트 슬롯 충돌 여부·SEO 프레이밍 합의를 못 받았습니다. **CSO 8/16 문서에서 data-finance에 이어 3번째 에이전트 도달불가**로, 구조 결함이 계속되는 중 | 🔴 미해결 — 형/secretary 중계 필요 |
| 이미지 자산(캐러셀 12장·12×12 격자·릴스) | coo-dohyun / media-head-siwoo 발주 필요. **텍스트만 발행 금지**(형 방침) |
| 궁합 CTA가 없는 기능을 약속하지 않도록 | sales-head-jio 정합 확인 |
| 십이지신 유물·사찰 구체 언급 | 1차 출처 확인 전 본문 삽입 금지 |
| 가격 표기 | 2026-08-17 라이브 확인 완료(무료 3회·카드 불필요 / $4.99 / $7.99·7일체험). 단, 단건 **$29 리프라이싱안이 검토 중**이므로 카피는 **"free, no card needed"** 안전표현을 기본으로 사용해 가격 변경에도 안 깨지게 작성 |
| **유료 리포트 일주 동물·오행 오류 (§2-1)** — 콘텐츠 범위를 넘는 제품 결함. 수리=cto / 영향 결제건수=data-finance / 고객 고지 여부=형 | 🔴 **에스컬레이션** — 12지신 진행 여부와 무관하게 처리 필요 |
| 도달 실패 시 | §0대로 **양산 중단**. 주제를 더 늘리는 게 답이 아니라는 판단을 8/25에 내립니다 |
