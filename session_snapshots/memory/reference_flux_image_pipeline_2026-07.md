---
name: reference_flux_image_pipeline_2026-07
description: "모아 이미지 양산 파이프라인 — 로컬 ComfyUI Flux.1 Schnell Q4로 $0 생성, 비율/글자깨짐/PPT임베드/디스코드 전송한도 대응 노하우"
metadata: 
  node_type: memory
  type: reference
  originSessionId: fdbadc66-c231-46ec-91be-2b3150f85ac4
  modified: 2026-07-26T00:42:15.421Z
---

모아 비주얼 자산(용어집·카드·블로그 이미지)은 **로컬 ComfyUI(포트 8188) + Flux.1 Schnell GGUF Q4**로 직접비용 $0 생성. 2026-07-23 용어집 27장 제작으로 확립. 담당 = [[media-head-siwoo]].

**엔진/스크립트:**
- ComfyUI 꺼져있으면 `run_nvidia_gpu.bat`로 기동(모델 그대로).
- 스크립트 원형: `D:\Develop\ComfyUIPtb\gen_glossary_3d.py` (복사 후 ITEMS만 교체 → 톤 동일).
- 노드: UnetLoaderGGUF=flux1-schnell-Q4_K_S.gguf / DualCLIPLoaderGGUF(t5-v1_1-xxl-encoder-Q4_K_M + clip_l, type=flux) / VAELoader=ae.safetensors.
- KSampler: steps=6, cfg=1.0, euler, simple, denoise=1.0. cfg1이라 네거티브 없음(빈 CLIPTextEncode 연결).
- 장당 ~46초(6GB 노트북 RTX3060).

**★ 비율은 EmptySD3LatentImage에서 결정** — 가로 1216×832 / 세로 832×1216. 스타일 영향 없음. **삽입 영역(패널) 비율에 맞춰 생성**해야 여백0. 안 맞으면 python-pptx cover-crop(넘치는 쪽만 크롭)으로 채움.

**★★ Flux 글자 버릇 (제일 큰 함정):** 화면·버튼·문서·라벨·코드 개념(MCP·IDE·API·DB·터미널 등)에서 엉터리 글자/진짜 영단어를 그려버림. 대응:
1. 프롬프트에 개념 영단어(save 등) 노출 금지 → 그 단어를 화면에 그대로 그림.
2. "버튼에 글자/문서에 텍스트" 대신 아이콘·도형으로 묘사. STYLE 접미에 `absolutely no text, no letters, no words, no numbers` 박기.
3. 코드화면은 `abstract green pixel grid, no readable letters`.
4. **생성 후 전수 육안검수 필수**, 글자 새면 시드 바꿔 재생성. (27장 중 3장 재생성 사례)
5. **★네거티브 프롬프트는 cfg=1.0에서 무효 — 실측 확정(2026-07-26).** 동일 시드로 네거티브 빈칸 vs 가득 채움을 돌려 **픽셀 차이 0**(파일 md5는 PNG에 워크플로우가 박혀서 달라짐 → md5로 판정하면 오진). 글자 억제는 오직 프롬프트·소재 설계로만 가능.
6. **★매크로 클로즈업 + 공산품(칩·기판·차량)이 글자 사고 최악 조합** — 실제 부품 각인을 흉내 내 "2200 / MJELBUNTS" 같은 가짜 글자를 크게 박는다. 매크로는 **재질·표면(녹·금속결·유리·콘크리트·케이블)** 쪽으로 몰면 거의 사라진다. 아이소메트릭 도식은 `clean unlabeled geometric forms` 보다 **`solid matte blank surfaces with no printed or engraved markings`** 가 유의하게 낫다(시드 2쌍 A/B로 확인).

**귀여운 3D(B스타일) 템플릿:** CHAR 접두 = `a cute friendly small robot character, glossy white and light-gray rounded body, big round head, large glossy cyan-blue eyes, gentle happy smile, chunky rounded limbs,` + 개념묘사 + STYLE_B 접미(soft 3D render, clay-like, pastel mint/coral/yellow, mobile app onboarding style, blender/octane look, plain white bg, no text). 형 채택 스타일. C(미래형)는 세미나 표지용 킵.

**★ PPT 임베드 → 디스코드 전송 함정:** PNG 27장 임베드하면 pptx가 16.5MB로 커져 **디스코드 reply 전송이 "Request entity too large"로 반송**(이 경로 한도 ~8MB, 부스트 서버 25MB 아님). 해결 = 임베드 이미지를 **PNG→JPG quality 90 재압축**(해상도 유지), 3D 일러스트는 육안차 없음. 16.5MB→2.2MB. PNG 원본은 보존, 빌드는 JPG 사본 참조. 6.3MB는 통과함(경계 8MB 근처).

관련: [[reference_media_stack_2026-07]] [[reference_local_hardware_spec]] [[reference_pptx_deck_toolkit]] [[feedback_publish_with_images]]
