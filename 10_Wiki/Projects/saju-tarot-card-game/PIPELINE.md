# Saju Tarot — 생성 & 자동화 파이프라인 (PIPELINE)

> 작성: 정도현 COO · 2026-06-22
> 대상: CELESTIAL PILLARS (Saju Tarot) + FIVE PHASES (card game)
> 목표: **아트 배치 생성 → PDF 패키징 → Etsy/Gumroad 자동 리스팅** 까지 사람 손 최소화

---

## 0. 자산·포트 맵 (현 보유)

| 자산 | 위치/포트 | 역할 |
|---|---|---|
| ComfyUI | `http://localhost:8188` (D:\Develop\ComfyUIPtb) | 카드 일러스트 배치 생성 (SDXL base 1.0) |
| LM Studio | `http://localhost:1234` (qwen2.5-7b-instruct Q4) | 카드 해석문·가이드북·개인화 리딩 텍스트 |
| n8n | `http://localhost:5678` (Docker, vol n8n_data) | 워크플로우 오케스트레이션 |
| Next.js | 자체 사이트 (celestialpillars.com 예정) | 브랜드 허브 + 개인화 백엔드 + Stripe |
| Printful | API (POD) | 타로덱 실물 인쇄·드랍십 |
| TheGameCrafter | (B 게임) | 카드게임 POD |

> ⚠️ 하드웨어 제약(메모리: reference_local_hardware_spec): RTX 3060 Laptop **6GB VRAM**. SDXL 1216px 장당 30~90s. 배치는 **순차** 권장(동시 X). 78장 풀덱 = 약 1.5~3시간 무인 배치.
> ⚠️ Vercel/클라우드는 로컬 LLM·ComfyUI 접근 불가(메모리: project_ksaju_live) → **자산은 로컬에서 사전 생성 후 업로드**.

---

## 1. 아트 생성 파이프라인 (ComfyUI)

### 1.1 워크플로우 (검증된 SDXL 그래프 — gen_tarot_samples.py)

```
CheckpointLoaderSimple(sd_xl_base_1.0)
  → CLIPTextEncode(positive) + CLIPTextEncode(negative)
  → EmptyLatentImage(832x1216, 타로 세로비)
  → KSampler(seed, steps=28, cfg=7.0, dpmpp_2m, karras, denoise=1.0)
  → VAEDecode → SaveImage(prefix=tarot_*)
```

- **해상도**: 832×1216 (≈2:3 타로 표준비). POD 인쇄용 최종은 **upscale 2x → 1664×2432** (300DPI ≈ 2.75"×4.75" 카드).
- **공통 STYLE 토큰**: `tarot card illustration, mystical Korean Eastern astrology, ornate golden frame border, deep indigo night sky, gold accents, starfield, nebula, constellations, ethereal glow, ink-wash meets cosmic, premium spiritual art, symmetrical, no text`
- **공통 NEG**: `text, letters, words, numbers, watermark, signature, ugly, low quality, blurry, deformed, extra limbs, modern objects, photo, nsfw, childish`
- **시드 고정**: 카드별 고정 시드(SAMPLE_PROMPTS.md에 명시) → 재현·리롤 관리.

### 1.2 배치 생성 절차 (78장 풀덱)

1. `SAMPLE_PROMPTS.md`의 78개(+오행5) 프롬프트 테이블을 JSON으로 export.
2. `gen_tarot_samples.py` 패턴으로 순차 POST → `/history` 폴링 → output 회수.
3. ComfyUI output → `D:\Develop\moa-vault\00_Raw\<date>\...` 1차 저장.
4. **품질 게이트**: 파일 200KB↑, 832×1216, 텍스트 누출 없음 시각 점검 → 불합격은 시드+1 리롤.
5. 합격분만 `02_Curated/` 이동 + upscale(2x) → POD 마스터.

> **400 파싱 버그 주의**(메모리: reference_lmstudio_parse400) — qwen은 텍스트용. 이미지는 ComfyUI라 무관. 단, 해석문 생성 시 일부 400 → regen 재시도 or 후처리 직접 작성.

### 1.3 후처리 (프레임·타이포)

- ComfyUI는 **아트만**(no text). 카드명·번호·테두리 타이포는 별도 **템플릿 합성**:
  - 옵션 A: Next.js + sharp/canvas로 PNG 위에 골드 프레임+카드명 SVG 오버레이(자동, 추천).
  - 옵션 B: ComfyUI 빈 골드프레임 1장 → 모든 카드 공통 합성.
- 폰트: serif(Cinzel 류, 영성 톤). 78장 일괄 합성 스크립트화.

---

## 2. 텍스트 생성 (LM Studio qwen2.5-7b)

- **가이드북**: 카드 1장당 정/역방향 의미 + 사주 매핑 해설 ~150단어 × 78 = 가이드북 PDF.
- **개인화 리딩($29.9)**: 입력(생년월일시) → 60갑자 산출(결정론적 계산) → qwen으로 해석문 생성 → PDF.
- 프롬프트 템플릿(시스템): *"You are a master of Korean Saju (Four Pillars). Write a calm, mature, self-reflective interpretation. No fear-mongering, entertainment & self-reflection only."* (가드레일 내장)
- 토큰 누출/400 시 자동 regen 1회 → 실패분만 사람 검수 큐.

---

## 3. PDF 패키징

- 입력: 합성 완료 78장 PNG + 가이드북 텍스트(MD).
- 도구: Next.js 서버 라우트 + `@react-pdf` 또는 `puppeteer` HTML→PDF.
- 산출:
  1. **Printable Deck PDF** (78장, 인쇄 가이드 포함) — 디지털 상품($19.9).
  2. **Guidebook PDF** (의미집).
  3. **POD 업로드용 개별 PNG**(Printful 카드별).
- 워터마크: 디지털 미리보기엔 워터마크, 구매본엔 제거(Gumroad 자동 딜리버리).

---

## 4. n8n 자동화 설계

### 4.1 워크플로우 W1 — "Art Batch → Curate"
```
[Manual/Cron Trigger]
  → [HTTP Request: ComfyUI /prompt] (loop over prompt list, sequential)
  → [Wait/Poll: ComfyUI /history/{id}]
  → [Read output file] → [IF size<200KB → reroll seed+1]
  → [Move to Curated folder] → [Notify Discord(요약)]
```

### 4.2 워크플로우 W2 — "Curated → PDF Package"
```
[Trigger: Curated folder ready (78 files)]
  → [HTTP: Next.js /api/compose (frame+title overlay)]
  → [HTTP: LM Studio /v1/chat (guidebook text, per card)]
  → [HTTP: Next.js /api/pdf (build Deck PDF + Guidebook PDF)]
  → [Store to /dist] → [Notify Discord]
```

### 4.3 워크플로우 W3 — "Auto Listing (Gumroad / Etsy)"
```
[Trigger: PDF package ready]
  → [Gumroad API: create/update product] (digital $19.9, attach PDF)
       - Gumroad has API for product CRUD + file upload → 완전 자동 가능
  → [Etsy API: create draft listing] (digital download)
       - Etsy API v3 OAuth2. 'createDraftListing' + upload files.
       - ⚠️ Etsy는 신규 리스팅 정책상 'draft' 생성까지 자동, 최종 publish는 1회 사람 확인 권장(정책 리스크).
  → [Printful API: create sync product] (POD physical, 78 card images → deck template)
  → [Notify Discord: 리스팅 URL + 상태]
```

### 4.4 워크플로우 W4 — "개인화 리딩 주문 처리 (런타임)"
```
[Webhook: 자체사이트 주문(생년월일시)]
  → [Function: 60갑자 계산]
  → [HTTP: LM Studio 해석문 생성]
  → [HTTP: Next.js /api/pdf (personalized report)]
  → [Email: 구매자에게 PDF 자동 발송]  (Brevo SMTP 재활용, 메모리: reference_ksaju_email_setup)
```

### 4.5 자동화 단계별 위험도

| 단계 | 자동화 수준 | 비고 |
|---|---|---|
| 아트 배치 생성 | 완전 자동 | 품질 시각검수만 사람 |
| 텍스트 생성 | 완전 자동 + 400 regen | 최종 톤 검수 1회 |
| PDF 패키징 | 완전 자동 | |
| Gumroad 리스팅 | 완전 자동 | API 성숙 |
| Etsy 리스팅 | 반자동(draft까지) | publish 사람 확인(정책) |
| Printful POD | 완전 자동(sync) | 첫 샘플 물성 검수 후 |
| 개인화 주문 | 완전 자동(런타임) | |

---

## 5. B (Five Phases) 파이프라인 차이점

- 아트: A덱 오행 캐릭터 재활용 → 카드 프레임/스탯만 별도 합성(가성비).
- PnP PDF($12.9): 룰북 + 카드 시트(자르기선) → Gumroad/Etsy 동일 W3 재활용.
- POD: TheGameCrafter는 API 제한적 → 카드 이미지 일괄 업로드(수동 1회) + 템플릿 재사용.
- Kickstarter: 자동화 대상 아님(캠페인은 수동 운영), 단 프로토타입 PnP는 위 자동라인 재활용.

---

## 6. 즉시 실행 가능 항목 (P0 무인 배치)

1. `gen_tarot_samples.py` — 오행 5장 (✅ 본 작업에서 실행)
2. 확장: `SAMPLE_PROMPTS.md` 30장 → 동일 스크립트 ITEMS 교체로 무인 배치.
3. n8n W1 노드 구성(ComfyUI HTTP 루프) — 다음 스프린트.

> 다음 추천 단계: **SAMPLE_PROMPTS 30장 → ComfyUI 무인 배치(야간) → 합격분으로 PDF 1차 패키징** → Gumroad 테스트 리스팅($19.9 draft).
