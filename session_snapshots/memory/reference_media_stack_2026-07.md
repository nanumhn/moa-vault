---
name: reference_media_stack_2026-07
description: 모아 AI 생성 스택 현황(2026-07 감사) + 미적용 무료 quick win + 지브리 LoRA 도입 + 월 정기 최신화 루틴
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4e434952-0e4a-4a91-9a85-1b63b25294aa
---

2026-07-07 형 지시로 media-head-siwoo가 "현 스택 vs 최신 트렌드" 1회 감사 실행. 전문: `moa-vault/10_Wiki/2026-07-07_ai_stack_audit.md`.

**감사 결론:** 우리 이미지 base(Z-Image Turbo Q4)는 의외로 2026-07 **6GB 티어 최신 수준과 이미 일치** → base 교체 급하지 않음. 진짜 갭 3곳 = **①얼굴보존 ②해부학(손·팔)보정 ③회의 LLM** — 셋 다 무료·6GB OK.

**★미적용 무료 Quick Win 톱3 (GPU 여유 시 클로가 적용·형 결재 불필요):**
1. **FaceDetailer(ComfyUI Impact-Pack)** — 얼굴·손 왜곡 자동 보정(지브리 '오른팔 2개' 류 아티팩트 자동 해결).
2. **PuLID(+ReActor)** — 얼굴 보존(우리 #1 약점). InstantID는 열화버그로 후순위.
3. **회의 LLM Qwen2.5-7B → Qwen3 8B**(Q4 ~4.6GB, 6GB 안착, 한국어·추론↑). LM Studio 모델 교체만.
→ 지브리 재생성이 GPU 점유해 대기열로 뒀음. GPU 나면 적용 후 결과 보고.

**형 결정 필요(비용):** 영상 구독(쇼츠 양산=로컬 6GB 부적합, 그록 등 정액 브라우저 조종 추천) / 클라우드 GPU 간헐(FLUX.2·Qwen-Image·정밀 얼굴보존은 6GB 로컬 불가, Runpod 건별) / 이미지 API(이미 예외 허용).

**월 정기 최신화 루틴(제안):** 시우 담당·매월 첫째주. 소스=HuggingFace 트렌딩/Civitai/ComfyUI releases/r/StableDiffusion·r/LocalLLaMA/Wan·LTX 릴리스. **n8n 월간 cron 반자동**(수집→로컬 qwen 요약→vault 초안→시우가 6GB 적합성·우선순위 확정). 추가비용 0.

**✅ 지브리 변환 개선(2026-07-07, 감사 첫 적용):** 무료 지브리 LoRA **artificialguybr StudioGhibli.Redmond-V2**(HuggingFace, SDXL base v1.0용, 트리거 `StdGBRRedmAF, Studio Ghibli`) 도입 = `ghibli_redmond.safetensors`. 비법: lightning 저스텝 LoRA 제거→정상 샘플링(dpmpp_2m/karras, steps~30, cfg~6), img2img denoise 0.68→0.50(원본 충실도↑·해부학 아티팩트↓), 네거티브 `extra arms,duplicated arm,fused limbs`. 재사용 스크립트/워크플로우 `.scratch`. [[project_moa_lora_video_limit]] 갱신 방향.

**★조직 개명(2026-07-07 형):** 그로스본부장 **강나래 → 강나라**. 반영완료: org.json 2개(clo_studio/dashboard/org/·org-app/data/), 조직도 이미지 render_org.py, agents/growth-head-narae.md. **내부 id·파일명 'narae'는 유지**(안정성), 표시 이름만 강나라. 향후 문서·메모리도 강나라로.

관련: [[reference_local_hardware_spec]] [[project_moa_influencer]]
