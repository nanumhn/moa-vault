# 모아 AI 생성 스택 감사 — 2026-07 (1회차)

> 작성: media-head-siwoo | 날짜: 2026-07-07 | 유형: 월 정기 감사 첫 회차
> 제약: 이번 감사는 **리서치·분석·추천만**. ComfyUI/GPU 병행 점유(지브리 재생성) 중이라 실행/다운로드/생성 없음. 실측 필요 항목은 "테스트 필요(나중)" 표시.
> 기준 하드웨어: RTX 3060 Laptop **6GB VRAM** (최대 병목). 6GB 초과 = 로컬 불가 → 클라우드/API로 명시.

---

## 0. 요약 한 줄
우리 이미지 base(Z-Image Turbo)는 **의외로 2026-07 6GB 티어 최신 트렌드와 일치** — base 교체 급하지 않음. 진짜 갭은 **① 얼굴 보존(PuLID/ReActor 미설치) ② 해부학/디테일 보정(Impact-Pack FaceDetailer 미설치) ③ 회의 LLM(Qwen2.5-7B → Qwen3 8B 무료 업글)**. 셋 다 무료·6GB OK.

---

## 1. 항목별 갭 + 우선순위 (스캔용 표)

| # | 항목 | 우리 현재 | 2026-07 최신 후보 | 6GB 적합성 | 비용 | 우선순위 | 뭐가 좋아지나 |
|---|------|-----------|-------------------|------------|------|----------|----------------|
| 1 | 이미지 base 모델 | FLUX schnell Q4(6.8GB, 빡빡), SDXL base+Lightning, **Z-Image Turbo Q4(4.98GB)** | Z-Image Turbo(6B, 9step) / Qwen-Image-2512(20B) / FLUX.2(32B) | Z-Image=OK(우리 이미 보유). Qwen-Image Q4 ~12-13GB=**로컬 불가**. FLUX.2 Q4 18-24GB=**로컬 불가** | 무료(로컬) | **하** | 이미 최신 티어. base 교체 이득 적음, 오히려 워크플로우 개선이 답 |
| 2 | 스타일 LoRA / 변환 | 지브리 첫 도입(이번), 스타일 LoRA 빈약 | Civitai SDXL Ghibli LoRA(#106712, #137562), Flux-Ghibli(#692955), **IPAdapter=1장 레퍼런스 스타일 전이** | SDXL LoRA=OK, IPAdapter SDXL=OK | 무료 | **중** | 스타일 다양화 + img2img 전역변형 리스크 감소 |
| 3 | 업스케일러 | 기본 스케일만 | Impact-Pack Upscaler, PMRF 초고속(2x 3.79s), 모델 기반(ESRGAN류) | OK(타일드) | 무료 | **중** | 저해상 6GB 결과물을 납품급으로 |
| 4 | **얼굴 보존(약점)** | IPAdapter/InstantID/PuLID/ReActor **전부 미설치** | **PuLID(≤8GB 권장)**, ReActor(insightface, 경량), InstantID(제일 무거움), InfiniteYou(FLUX기반=무거움) | PuLID/ReActor=OK, InstantID=빡빡, InfiniteYou=**로컬 불가 가능성** | 무료 | **상** | 우리 최대 약점 직격. 실사 인물 얼굴 유지 |
| 5 | ComfyUI 본체·노드 | 구버전 [추정], Impact-Pack 미설치 | Nodes 2.0/새 확장매니저, **Impact-Pack(FaceDetailer/Detailer)**, Style Transfer Handbook(2026-03) | OK | 무료 | **상** | **지브리 해부학 아티팩트 자동 보정**(FaceDetailer가 얼굴·손 재디테일) |
| 6 | 로컬 영상 | Remotion(코드템플릿), 생성형 약함 | Wan 2.2 14B GGUF(6GB~ offload), Wan 2.1 1.3B, LTX-Video 양자화, **Wan2GP(6GB 타깃 래퍼)**, HunyuanVideo | 6GB 가능하나 느림·저해상·짧음 | 무료(로컬)/구독 | **하** | 로컬은 b-roll용 실험만. 양산 쇼츠는 구독이 여전히 답 |
| 7 | 경량 LLM(회의/텍스트) | qwen2.5-7b-instruct Q4 | **Qwen3 8B(Q4 ~4.6GB)**, Qwen3.6-35B-A3B MoE(6GB llama.cpp ~30tps), EXAONE(LG, 한국어) | Qwen3 8B=OK, 35B-A3B=위험한 곡예, Gemma4 27B=불가 | 무료 | **중** | 한국어+추론 향상(8B 이하 HumanEval 최고), 무료 교체 |

---

## 2. 지금 당장 적용할 Quick Win 톱 3 (무료·6GB OK·효과 큼)

> 셋 다 **직접비 $0**, 6GB 내 동작. 단 다운로드/GPU 필요 → **현재 GPU가 지브리로 점유 중이라 "GPU 여유 시 즉시 적용" 대기열**로 둠. 형 추가 결재 불필요(무료·보유자원).

1. **ComfyUI Impact-Pack 설치 → FaceDetailer/Detailer** — 이번 지브리에서 터진 **해부학/얼굴 아티팩트를 자동 재디테일**로 보정. 우리가 겪은 그 통증을 직접 해결. (테스트 필요: 우리 지브리 워크플로우에 얼마나 붙나)
2. **PuLID 설치(저VRAM 얼굴보존)** — 우리 **#1 약점(얼굴 보존)** 직격. ReActor도 같이(경량 face swap 대안). ComfyUI-InstantID는 3~4회 반복 시 얼굴 열화 버그 있어 후순위. (테스트 필요: PuLID SDXL/PuLID-FLUX 중 6GB에서 도는 쪽 확인)
3. **회의 LLM 교체: Qwen2.5-7B → Qwen3 8B(Q4)** — LM Studio에서 모델 다운+스왑만. 6GB 안착(~4.6GB), 한국어·추론 향상. 회의·콘텐츠 품질 무료 상승.

---

## 3. 형 결정 필요 항목 (비용/투자)

| 항목 | 왜 결정 필요 | 옵션·추천 |
|------|--------------|-----------|
| **영상 구독** (쇼츠 양산) | 로컬 6GB 영상은 느림·저품질·짧음 → 하루 2~3개 양산엔 부적합. 구독이 단가 우위 | 그록 등 정액 구독 1개 → 브라우저 조종(차단회피 원칙 적용). **(내가추천)** 이게 방침과도 일치 |
| **클라우드 GPU** (간헐 고품질) | FLUX.2 / Qwen-Image / InfiniteYou 급 **결정적 고품질·정밀 얼굴보존**은 6GB 로컬 불가 | Runpod 등 시간당 임대, "결정적 순간만" 종량. 상시 아님. 필요 건별 형 승인 |
| **이미지 생성 API** (예외) | 방침상 이미 예외 허용. 결정적 고품질 필요 시만 | 건별 승인 유지. 상시 전환 아님 |

> 로컬로 커버되는 Quick Win 3개는 결재 불필요(무료). 위 3개만 형 판단 영역.

---

## 4. 월 정기 감사 루틴 제안

- **담당:** media-head-siwoo (시우) / **주기:** 월 1회(매월 첫째 주). 큰 릴리스(FLUX/Qwen/Wan 신버전) 감지 시 임시 1회 추가.
- **훑을 소스(고정 목록):**
  1. HuggingFace Trending (models, this week 필터)
  2. Civitai Trending (LoRA·checkpoint, 지난 30일)
  3. ComfyUI 공식 blog.comfy.org + GitHub Releases(본체·Manager)
  4. r/StableDiffusion, r/LocalLLaMA (top/month)
  5. LTX / Wan / Alibaba(Z-Image·Qwen-Image) 릴리스 노트
  6. 뉴스레터 1~2개(선정 후 고정)
- **기록 위치:** `D:/Develop/moa-vault/10_Wiki/YYYY-MM-DD_ai_stack_audit.md` (이 파일 네이밍 규칙 유지). 직전 회차와 **델타(무엇이 바뀌었나)** 중심으로.
- **자동화 검토:**
  - **n8n 월간 cron 워크플로우 (반자동, 추천):** RSS/HuggingFace API/Reddit API 수집 → 로컬 qwen(1234)로 요약 → vault에 draft `.md` 초안 생성 → 시우가 6GB 적합성·우선순위 판단해 확정. n8n은 이미 도입(5678)이라 추가비용 0.
  - watchdog(파일시스템 감시)은 부적합(외부 웹소스 폴링 아님). n8n cron이 정답.
  - 완전자동 금지: 6GB 적합성·우선순위 판단은 사람(시우)이. 수집·요약만 자동.

---

## 5. 참고 소스 (2026-07 조사)
- Local AI Master, Botmonster, WillItRunAI — 6GB 이미지 모델·VRAM 가이드
- Medium Diffusion Doodles — Z-Image Turbo / Qwen-Image-2512 / FLUX.2 Dev 런다운
- comfyui.org, blog.comfy.org — Style Transfer Handbook, InstantID/PuLID/IPAdapter, InfiniteYou
- github ltdrdata/ComfyUI-Impact-Pack, cubiq/ComfyUI_InstantID
- Civitai — Ghibli LoRA #106712 / #137562 / Flux #692955
- LTX Blog, Local AI Master, Hyperstack — 오픈소스 영상모델(Wan/LTX/Hunyuan) 6GB
- Qwen3 / Qwen3.6 VRAM 가이드, siliconflow/benchlm 한국어 LLM

> [추정] 표시: 우리 ComfyUI 정확한 버전, EXAONE 6GB 실동작, InfiniteYou 6GB 가부 — 미검증. 테스트/확인 후 다음 회차 보정.
