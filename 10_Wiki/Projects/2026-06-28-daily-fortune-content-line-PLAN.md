---
title: "오늘의 운세 (Daily Fortune) — 콘텐츠 라인 실행 기획서"
date: 2026-06-28
author: content-head-seoa (콘텐츠마케팅본부장 이서아)
status: 형 결재 대기 — 콘텐츠 포맷/샘플 확정, 자동화 빌드는 결재 후 cto/growth/media 착수
product: k-saju (k-saju.me)
related:
  - 10_Wiki/Marketing/k-saju_daily_card_content.md (오전 사주 카드 — 자매 라인)
  - 10_Wiki/Marketing/n8n_daily_saju_card_v4_ig.json (재사용 파이프라인)
  - saju-studio/src/lib/saju/engine.ts (데이터 엔진 — 재사용)
  - saju-studio/src/app/api/og/daily-card/route.tsx (카드 OG 렌더 — 패턴 재사용)
---

# 오늘의 운세 (Daily Fortune) — 콘텐츠 라인 실행 기획서

> **한 줄 요약:** 오전 "사주 카드"(개인 생일 기반)에 이어, 오후에 **누구나 보는 보편 운세** = (A) 오늘의 오행 기운 + (B) 12지 띠별 운세를 인스타+블로그로 매일 발행한다. **데이터는 새로 만들 필요 없음 — saju-studio 엔진이 이미 오행·12지 계산을 전부 보유**(결정론적·무료·Vercel 호환). 모든 발행물은 **이미지 풍부**(형 2026-06-27 방침: 텍스트만 발행 금지)로 나간다.

---

## 0. 전제 — 두 데일리 라인의 분리

| | 오전 라인 (기존) | **오후 라인 (신규 = 이 기획)** |
|---|---|---|
| 이름 | Daily Saju Card | **Daily Fortune (오늘의 운세)** |
| 기준 | **개인 생일**(사주 명식) | **보편 일진**(생일 불필요, 누구나 동일) |
| 내용 | 내 일간 × 오늘 기운 관계 | (A) 오늘의 오행 + (B) 12지 띠별 |
| 발행 | 07:30 KST 자동발송 (셋업됨) | **신규 — 정오 KST 권장** |
| 채널 | IG + (구독자 카드) | **IG + 블로그** |
| 진입장벽 | 가입/생일 입력 필요 | **0 — 띠만 알면 됨 → 도달 넓음** |

핵심 차별점: 오전 카드는 "내 카드"라 **가입 유도**가 강하지만 진입장벽이 있다. 오후 운세는 **띠(태어난 해)만 알면 누구나** 자기 줄을 찾는다 → 저장·공유·태그가 잘 일어나는 **상단 깔때기(top-of-funnel)** 콘텐츠. 둘이 역할이 다르므로 카니발 없이 보완.

---

## 1. 콘텐츠 포맷 정의

### (A) 오늘의 오행 기운 — "Today's Element"
오늘 날짜의 **일진(日辰) 천간 → 오행**을 뽑아 영어 카피로. (엔진 `dayPillar()` → `STEM_ELEMENT` 그대로. 이미 `/api/og/daily-card`가 매일 이 값을 산출 중.)

구성(카드 1장 + 블로그 상단 섹션):
- **헤드라인:** `Today is a {Fire 火 / Water 水 …} Day — {한 줄 무드}`
- **본문 2~3문장:** 오행 성질 + 오늘 권하는 마음가짐 (호기심 유발, 단정 금지)
- **호기심 요소 3종 (럭키 박스):**
  - 🎨 **Lucky color** — 오행 정색 (Wood=green, Fire=red, Earth=yellow/brown, Metal=white/gold, Water=deep blue/black)
  - 🧭 **Lucky direction** — 오행 방위 (Wood=East, Fire=South, Earth=Center, Metal=West, Water=North)
  - ✅ **One small action** — 오늘 해보면 좋은 작은 행동 1개 (실용·따뜻)
- 면책: "for entertainment & self-reflection — not professional advice"

### (B) 12지 띠별 운세 — "Your Zodiac Today"
12지 각각 **한 줄**(영어). 데이터는 **엔진 재사용**: 각 띠의 지지 오행(`BRANCH_ELEMENT`)과 오늘 오행의 **상생·상극 관계**(`relationOf` = same/resourced/output/wealth/pressure)를 판정 → 관계별 운세 톤 결정. (=오전 카드가 쓰는 바로 그 로직.)
- 길이: 카드/캐러셀용 **10~16단어**, 신비롭되 실행 가능한 nudge 1개.
- 12지 영문 라벨: Rat · Ox · Tiger · Rabbit · Dragon · Snake · Horse · Goat · Monkey · Rooster · Dog · Pig (엔진 `BRANCH_ANIMAL` 그대로).
- 관계→무드 매핑(고정): same=Focus(집중) · resourced=Support(지지) · output=Express(표현) · wealth=Gain(성취) · pressure=Temper(단련).

---

## 2. 샘플 1일치 — **2026-06-28 (KST) 기준, 복붙 가능 완성본**

> 엔진으로 실제 계산 검증함. 2026-06-28 KST 일진 = **癸亥 (Gye-Hae) · Yin Water day** → 오늘의 오행 = **Water 水**.

### (A) Today's Element — Water 水

**Today is a Water 水 Day — let stillness do the work.**

Water energy pulls everything inward: intuition over force, listening over speaking. Today's current (癸亥, Yin Water) runs deep and quiet, like rain soaking slowly into soil. Don't push against a closed door — flow around it. Rest isn't a detour today; it's the route.

- 🎨 **Lucky color:** Deep blue / black
- 🧭 **Lucky direction:** North
- ✅ **One small action:** Write down one honest thought before noon — and let one decision wait a day.

*For entertainment & self-reflection only — not professional advice.*

### (B) Your Zodiac Today — 12 one-liners (Water day)

| 띠 | 관계 | 한 줄 운세 (게시용 영어) |
|---|---|---|
| 🐀 **Rat** | Focus | Today's current is yours — protect one quiet block and do the deep work. |
| 🐂 **Ox** | Gain | Reach, don't just wish. A practical ask made today quietly lands well. |
| 🐅 **Tiger** | Support | Support flows toward you — receive help without guilt, let someone wiser pour in. |
| 🐇 **Rabbit** | Support | Refill before you spend. A short pause this morning pays you back all week. |
| 🐉 **Dragon** | Gain | Pick one goal and commit. What you move toward today moves toward you. |
| 🐍 **Snake** | Temper | Resistance is information. Don't force the closed door — note what pushes back. |
| 🐎 **Horse** | Temper | Slow before you react. One measured breath outruns a quick mistake today. |
| 🐐 **Goat** | Gain | Tend one tangible thing. Small concrete wins gather like rain into a stream. |
| 🐒 **Monkey** | Express | Ideas want out today. Ship the small thing — visible beats perfect this morning. |
| 🐓 **Rooster** | Express | Say it aloud. Speaking the idea today reveals its true, final shape. |
| 🐕 **Dog** | Gain | Make the offer, take the meeting — initiative is rewarded under today's quiet tide. |
| 🐖 **Pig** | Focus | The water knows your name today. Trust your pace; begin without permission. |

> 위 12줄은 관계 5종(Focus/Support/Express/Gain/Temper)에서 파생 — 같은 관계라도 띠별로 문구를 변주해 "복붙 티" 안 나게 작성. 매일 오행이 바뀌면 12지 관계 분포가 통째로 달라짐(예: Fire day면 Rat·Pig가 Temper로 이동) → 매일 신선.

---

## 3. 발행 포맷별 설계 (★이미지 풍부 — 형 방침: "이미지 자리 0개"가 발행 완료 기준)

> **원칙(2026-06-27 형 확정):** 텍스트만 발행 금지. 모든 발행물은 실제 이미지로 채워서 내보낸다. placeholder 발행 금지. 아래 각 포맷에 **필요 이미지 수·종류**를 명시하고 생성 owner=**미디어본부 시우(ComfyUI 1순위)**.

### 3-1. 인스타그램 — 캐러셀 (4:5, 1080×1350)
한 장에 다 넣으면 12지가 깨알이 되므로 **캐러셀 4~5장** 권장.

| 슬라이드 | 내용 | **필요 이미지 / 종류** | owner |
|---|---|---|---|
| 1 (커버) | "Today is a Water 水 Day" 헤드라인 + 날짜 + 무드 한 줄 | 오행 무드 배경 1 (기존 `/public/daily-bg/{element}.jpg` 재사용 가능) + 오행 심볼 글리프 | 시우 (기존 자산 재사용) |
| 2 | 오행 본문 + 럭키 컬러/방위/액션 박스 | 오행 컬러 배경 1 + 방위 나침반/컬러 스와치 아이콘 3 | 시우 |
| 3 | 12지 띠별 (1/2): Rat~Snake 6줄 | **띠 동물 일러스트 6** (신비/먹그림 톤) | 시우 (ComfyUI) |
| 4 | 12지 띠별 (2/2): Horse~Pig 6줄 | **띠 동물 일러스트 6** | 시우 (ComfyUI) |
| 5 (CTA) | "Find your full chart" + k-saju.me | 브랜드 엔드카드 1 (로고+버튼) | 시우 (템플릿) |

- **카드당 이미지 수: 커버1+오행1+띠일러12+엔드1 = 최소 15장 자산**(띠 일러는 **1회 생성 후 영구 재사용** → 매일 새로 만들 필요 없음. 매일 바뀌는 건 텍스트+오행 배경뿐).
- 첫 구축 시 시우가 **12지 동물 일러스트 12종 + 오행 배경 5종(이미 보유)**을 1회 양산 → 이후 매일 자동 합성.
- 캡션: 헤드라인 + 띠별 12줄 요약 + 면책 + CTA(link in bio) + 해시태그(아래 §7).
- 단일 카드 대안(저비용): 4:5 한 장에 오행 상단 + 12지 그리드 하단. 단 가독성 떨어짐 → 캐러셀 권장.

### 3-2. 블로그 — 매일 새 글 (blog.k-saju.me / Next.js+MDX)
- **제목 패턴(SEO):** `Daily Korean Fortune — {Month Day}: {Element} Day + Zodiac Reading`
  - 예) `Daily Korean Fortune — June 28: Water Day + 12 Zodiac Reading`
- **슬러그:** `/blog/daily-fortune-2026-06-28`
- **메타 디스크립션:** `Today's Korean Saju fortune for June 28 — a Water 水 day. Your lucky color, direction, and a one-line reading for all 12 zodiac animals. Entertainment & self-reflection.`
- **본문 구조(H2):**
  1. `Today's Energy: A Water 水 Day` — 오행 카피 + 럭키 박스
  2. `What a Water Day Means` — 오행 성질 2~3문장(에버그린, SEO 내부 깊이)
  3. `Your Zodiac Today` — 12지 12줄 (각 띠 소제목 H3 + 동물 일러스트)
  4. `How This Works (and What It Isn't)` — 면책 + 일진 원리 한 단락
  5. `Get Your Personal Reading` — CTA → k-saju.me
- **글당 필요 이미지(★풍부):** owner=시우
  - 히어로 이미지 1 (오행 무드, 1200×630, OG 겸용)
  - 오행 심볼 일러스트 1 (본문 §1)
  - 12지 동물 일러스트 12 (각 H3 옆 — 1회 생성 후 영구 재사용)
  - 무드/디바이더 이미지 1~2 (선택)
  - → **글당 화면에 보이는 이미지 최소 14장**, 그중 12장은 재사용 자산. 매일 새로 만드는 건 히어로 오행 이미지(5종 중 택1 재사용 가능) → 사실상 **신규 생성 0~1장/일**.
- **CTA + UTM:** `https://k-saju.me/?utm_source=blog&utm_medium=daily_fortune&utm_campaign=daily_fortune&utm_content=2026-06-28`
  - 인스타 bio/스토리 링크: `utm_source=instagram&utm_medium=daily_fortune&utm_campaign=daily_fortune`

---

## 4. 발행 캘린더 / 시각 (KST)

| 시각(KST) | 라인 | 채널 | 상태 |
|---|---|---|---|
| **07:30** | Daily Saju Card (개인) | IG | 기존 자동발송 |
| **12:00 (정오) ← 권장 (내가추천)** | **Daily Fortune (오늘의 운세)** | IG 캐러셀 + 블로그 | 신규 |

**정오(12:00 KST) 권장 근거:**
- 오전 카드와 **4.5시간 간격** → 피드 피로 없이 하루 2발행 리듬.
- 미국 타깃 기준 KST 12:00 = **US 서부 PT 전날 20:00(저녁 황금시간)** / 동부 ET 전날 23:00 → IG 저녁 스크롤 윈도우. [추정]
- "오후 발행"이라는 형 프레이밍 충족.

**대안(A/B 테스트 권장):** **KST 21:00** = US 동부 ET 08:00(아침)/서부 PT 05:00 → "오늘의 운세"가 미국 독자의 **하루 시작**에 닿음(운세는 아침에 보는 게 정서적으로 맞음). 단 KST상으론 저녁이라 "오후" 프레이밍과 어긋남.
→ **결론: 정오로 시작 → 2주 후 21:00과 저장·도달 A/B**. 수치는 실측 전까지 [추정].

---

## 5. 자동화 데이터 소스 — **결론: 새로 만들 필요 없음. 엔진 재사용.**

코드 확인 결과(`saju-studio/src/lib/saju/engine.ts`), 필요한 계산이 **이미 전부 구현**돼 있고 **결정론적·외부의존 0·Vercel 라이브 동작**한다.

| 필요 데이터 | 이미 있는 것 | 비고 |
|---|---|---|
| 오늘 일진→오행 | `dayPillar()` + `STEM_ELEMENT` (`/api/og/daily-card`가 매일 산출) | 그대로 재사용 |
| 12지 영문 라벨 | `BRANCH_ANIMAL` (Rat/Ox/Tiger…) | 그대로 |
| 12지×오늘 관계 | `relationOf()` + `RELATION_COPY` + `RELATION_LABEL` | 띠 운세 엔진 = 오전 카드 엔진과 동일 |
| 럭키 컬러/방위 | `ELEMENT_LABEL`(글리프) 보유, 컬러·방위 표만 추가하면 됨 | 소량 상수 추가 |

**권장 구현 (cto 빌드, 형 결재 후):**
- **신규 엔드포인트 `/api/og/daily-fortune`** 을 `daily-card` 라우트 패턴 복제로 추가:
  - `?data=1` → JSON `{ date, element, glyph, headline, body, luckyColor, luckyDirection, luckyAction, zodiac:[{animal, relation, line} ×12] }`
  - (이미지 없이) → 캐러셀 합성 전 데이터 소스
  - `?fmt=carousel&slide=N` → 슬라이드별 카드 이미지 렌더(OG 패턴)
- **LLM(qwen) 필요 없음.** 12지 문구 풀을 라우트 안 상수로(오전 카드 `COPY` 풀과 동형) 두면 결정론적·무료·라이브. 
  - qwen2.5-7b(LM Studio 1234)는 **선택적**: 문구 풀을 주기적으로 신선화(월 1회 오프라인 배치 생성→풀 교체)할 때만. 매일 호출 불필요(Vercel은 localhost LLM 접근 불가 — 메모리 `project_ksaju_live` 동일 제약).
  - 만약 풀 신선화에 qwen 쓸 경우 프롬프트 템플릿:
    > "Write 5 one-line daily fortunes (10–16 words each, English) for a person whose zodiac element has a '{relation}' relationship to today's element. Tone: mystical but grounded, actionable nudge, no fear, no prediction of specific events. Frame as self-reflection."

**기존 n8n 파이프라인 재사용:** `n8n_daily_saju_card_v4_ig.json` 구조를 그대로 복제해 `daily-fortune` 워크플로우 신설:
1. Schedule 12:00 KST (timezone 이미 Asia/Seoul)
2. HTTP GET `/api/og/daily-fortune?data=1`
3. **이미지 합성 단계(신규·★)** — 캐러셀 슬라이드 이미지들을 OG 라우트로 받거나 시우 자산과 합성 (텍스트만 발행 방지)
4. Build Caption (12지 요약+면책+해시태그)
5. Discord 미리보기 → IG Create Media (캐러셀 = `children` 멀티) → Wait → Publish
6. 블로그 자동포스팅은 `n8n_blog_autopost.json` 재사용 + 이미지 삽입 단계 추가

---

## 6. 유입 기여 (k-saju 유입 병목 대응 — 과장 없이)

어제(2026-06-27) 수익리뷰 병목 = **"k-saju 실고객 유입"**. 이 라인의 기여 경로:

1. **블로그 매일 새 글 = SEO 인덱싱 면적 2배.** "daily korean fortune", "zodiac today", "{element} day meaning" 등 **반복 검색 롱테일**을 매일 새 URL로 흡수. 누적 글이 곧 누적 유입 자산. (애드센스 라인과도 시너지 — blog.k-saju.me 노출↑)
2. **인스타 발행 빈도 2배(1→2/일) = 알고리즘 노출·도달 증가.** 띠별 운세는 **"내 띠 찾기→저장→친구 태그"**가 자연 발생 → 오전 개인카드보다 **공유 계수**가 높은 top-of-funnel. [추정]
3. **무게중심 깔때기:** 보편 운세(진입장벽 0)로 도달 → CTA로 "내 개인 사주 카드/리포트" = 가입·결제 라인으로 연결. 넓게 들어와 깊게 전환.
4. **이미지 풍부 → 저장·체류↑:** 캐러셀/삽화가 많을수록 IG 저장·블로그 체류시간↑ = 알고리즘·SEO 양쪽 가산. [추정]

> 정직 단서: 위 도달·공유·전환 수치는 **실측 전까지 전부 [추정]**. go-live 후 UTM·IG 인사이트로 실측해 다음 수익리뷰에 반영. 가짜 수치·가짜 희소성·공포 마케팅 0(형 1순위 원칙 준수).

---

## 7. 해시태그 / 캡션 자산 (게시용)

**IG 캡션 템플릿 (오늘 2026-06-28 예시):**
```
🌊 Today is a Water 水 Day — let stillness do the work.

Intuition over force. Listening over speaking. Don't push a closed door — flow around it.
🎨 Lucky color: deep blue/black · 🧭 Direction: North · ✅ Write one honest thought before noon.

Your zodiac today 👇 (swipe)
🐀 Rat — protect one quiet block, do the deep work.
🐂 Ox — reach, don't just wish; a practical ask lands well.
… (12지 전체는 캐러셀 슬라이드 3·4)

🔮 Find your personal chart → link in bio · k-saju.me
For entertainment & self-reflection only — not professional advice.

#dailyfortune #koreanzodiac #saju #fourpillars #chinesezodiac #fiveelements #ksaju #koreanastrology #zodiacsigns #spirituality #astrologydaily #selfreflection
```

---

## 8. Owner · 일정 (주차별)

| 작업 | Owner | 비고 |
|---|---|---|
| 콘텐츠 포맷·문구 풀·면책 톤·캡션/SEO 카피 | **서아 (콘텐츠)** | 본 기획 + 12지 문구 풀 12×5 |
| 12지 동물 일러스트 12 + 오행 배경(보유) + 캐러셀 템플릿 + 블로그 삽화 | **시우 (미디어)** | ComfyUI 1순위, 1회 양산 후 재사용 |
| `/api/og/daily-fortune` 엔드포인트(데이터+이미지) | **cto (서진)** | daily-card 라우트 복제 |
| n8n daily-fortune 워크플로우(이미지 합성 단계 포함) + 블로그 오토포스트 | **growth (나래) + cto** | v4 IG json 복제 |
| 데이터 정합(일진 계산·관계 매핑) 검증 | **cto** | 엔진 재사용이라 리스크 낮음 |

**주차 로드맵(결재 후):**
- **W1:** 서아 문구 풀(12×5) 완성 + 시우 12지 일러스트 12종 1차 양산. cto `daily-fortune?data=1` JSON 라우트.
- **W2:** 시우 캐러셀/블로그 이미지 템플릿 + cto 이미지 렌더 라우트 + 블로그 글 템플릿(MDX). 수동 1주 시범발행(이미지 풀 채움).
- **W3:** n8n 자동화(스케줄 12:00 + 이미지 합성 + IG 캐러셀 + 블로그) 연결, Discord 미리보기 게이트.
- **W4:** 정오 vs 21:00 A/B + UTM 실측 → 수익리뷰 반영.

---

## 9. 형 결재 / 결정 필요

1. **발행 시각:** 정오 12:00 KST로 시작(권장) — 승인? 아니면 21:00(US 아침)로 바로?
2. **인스타 형식:** 캐러셀 4~5장(권장, 이미지 풍부·가독성) vs 단일 카드 1장(저비용)?
3. **자동화 빌드 착수 결재:** 엔진 재사용이라 신규 데이터 비용 0. `/api/og/daily-fortune` + n8n 복제 빌드를 cto/growth/media에 발주할지.
4. **(계정 의존) IG 비즈니스 토큰/웹훅** — n8n 자동발행은 형의 Meta 토큰·Discord 웹훅 필요(코드는 클로가 다 셋업, 키는 형만).

## 10. 막힌 것 / 리스크
- **IG 자동발행 Meta 차단 이력**(메모리 `reference_n8n_ig_meta_block`) — 캐러셀 자동포스팅도 동일 리스크. 시각 랜덤화+사람 속도 우회 필요. 초기엔 **Discord 미리보기→반자동(형 클릭)**으로 시작 권장.
- 12지 띠 매핑은 정밀 만세력이 아닌 v0 엔진 기준(입춘·절기 미보정) — "entertainment & self-reflection" 면책으로 커버. 정밀화는 별도 페이즈.
- 발행 시각/도달/전환 효과는 전부 **[추정]** — 실측 데이터 누적 전까지 단정 금지.
</content>
</invoke>
