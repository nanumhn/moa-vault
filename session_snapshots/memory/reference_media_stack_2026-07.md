---
name: reference_media_stack_2026-07
description: 모아 AI 생성 스택 현황(2026-07 감사) + 미적용 무료 quick win + 지브리 LoRA 도입 + 월 정기 최신화 루틴
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4e434952-0e4a-4a91-9a85-1b63b25294aa
  modified: 2026-07-20T08:18:03.447Z
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

**★2026-07-20 재감사(실측) + 비즈컴 재현 벤치 (형 지시):** 형이 남의 "비즈컴류(클라우드 노드캔버스 SaaS, nano-banana/Flux Pro급)" 이미지편집 결과 보고 ①우리 재현 ②모델 재점검 ③6GB 최신모델 탐색 요청. 시우 결과:
- **① 재현 성공·비즈컴과 대등**: "웨딩드레스 추출→머리·팔 없는 마네킹 제품컷"을 우리 ComfyUI **Flux Kontext dev Q4 GGUF(6GB 로컬)**로 실제 재현. 품질 대등(우리 게 오히려 배경 더 깔끔), **직접비 $0**. 열세=속도(장당 ~4분 vs 클라우드 수초)뿐. 미세디테일 드리프트는 비즈컴도 동일(편집모델 공통특성, 6GB 한계 아님). 결론="제품컷·스타일변환류는 로컬 무료 자립 가능". 비교이미지 `moa-vault/10_Wiki/Marketing/media_bench_2026-07-20/COMPARE_dress.png`.
- **② 실측 감사**: 최신 보유=Z-Image(6B)·Flux schnell·LTX2.3영상 ✅. **오늘 Flux Kontext(편집모델) 신규설치**(이전엔 편집모델 가중치 0=아예 없었음). ⚠️**quick-win 톱3 중 실제 적용은 1/3만**: Qwen3=✅(qwen_3_4b 있음) / **FaceDetailer=❌(YOLO/SAM 검출모델 없어 동작불가)** / **PuLID·IPAdapter·PhotoMaker=❌(노드만 있고 가중치 폴더 전부 빈 placeholder)**. controlnet·범용업스케일러(ESRGAN)도 없음. → **얼굴보존·해부학 갭 그대로**(인물 반복노출=모아 인플루언서의 급소).
- **③ 6GB 추천**: Flux Kontext Q4(도입완료), Qwen-Image-Edit(완전오픈·상업안전이나 20B라 느림), 영상은 LTX2.3 distilled(보유가 정답). 출처링크는 vault 벤치보고서에.
- **★형 결재 대기(무료·1GB 미만)**: 얼굴보존 무료팩 도입 = FaceDetailer YOLO+SAM + PuLID/IPAdapter clip_vision 가중치 + RealESRGAN. 승인 시 시우가 설치→인물 품질 갭 닫힘. (Higgsfield MCP는 서브에이전트엔 미노출, 클라우드 비교 필요시 오케스트레이터(클로)가 직접 호출.)
- 작업 중 ComfyUI 프로세스 죽어(크래시로그 없음) 시우가 재시작 복구, 8188 정상.

**★2026-07-20 Kaggle 무료 16GB GPU 언락 — 영상/립싱크 병목 해결책 (형 발견·시우 구축):** 형이 유튜브(행글라이터)에서 본 방법 = **Kaggle이 16GB GPU를 무료로**(주 30h, 폰인증 필요) 주니 로컬 6GB로 무거웠던 **LTX-2.3 영상(이미지→영상+한국어 립싱크)**을 공짜로 돌린다. 우리 최대 약점(6GB→영상 약함)을 $0로 우회하는 길.
- 시우 구축완료: `D:\Develop\Claude_Channels\kaggle_ltx\` — `ltx23_kaggle_i2v.ipynb`(17셀, ComfyUI+LTX-2.3 distilled fp8, 480x704 i2v+오디오립싱크, 모델URL 5종 HTTP200 실측·무료), 형용 `KAGGLE_가입_토큰_안내서.md`, 테스트 입력이미지 `assets/test_input_portrait.png`(로컬 무료생성), 실행스크립트.
- **★한국어 립싱크 = 된다(실물 증거).** LTX-2.3은 오디오 파형→latent→비디오latent concat 동시샘플링, **음소기반이라 언어무관**(한국어 OK). 증거=이미 6GB 로컬로 뽑은 립싱크 mp4 `assets/PRIOR_PROOF_lipsync_local_6gb.mp4`(영상·오디오 9.96초 일치, moa_song 음성구동). 로컬 워크플로우 `ltx_scene_workflow.py`. 백업안=MuseTalk/LatentSync 후처리 립싱크(둘 다 16GB OK). 출처=LTX-2 arxiv·nemovideo·introl 블로그.
- **툴 지도 확정**: 이미지=로컬 ComfyUI(무료·빠름) / 영상·립싱크=**Kaggle 무료16GB+LTX-2.3**(오늘 뚫음) / 급할때 고퀄=Higgsfield 크레딧.
- **블로커**: 형 Kaggle 계정+`kaggle.json` 토큰 필요(계정·폰인증은 형만). 토큰 오면 push_kaggle.sh로 자동실행, 첫영상 ~10~15분(모델다운 26GB 포함)·이후 1~3분. ★토큰은 비밀=메모리·git·vault·출력 절대 금지. ★첫 Kaggle런은 검증런(fresh ComfyUI-LTXVideo 노드명 실제로 돌려 확정, 추측금지).

관련: [[reference_local_hardware_spec]] [[project_moa_influencer]] [[project_eco_sort_game]] [[project_moa_lora_video_limit]]
