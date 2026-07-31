---
name: reference_vram_contention_lm_vs_flux
description: "6GB VRAM 경합 — 이미지 모델 속도 실측(turbo가 schnell보다 5배 느림). ★단, \"LM Studio 상주가 라이브를 마비시킨다\"는 결론은 반례로 취소됨"
metadata: 
  node_type: memory
  type: reference
  originSessionId: b09dd449-d149-4b1d-9d48-8552ad405f1c
  modified: 2026-07-31T00:08:04.806Z
---

RTX 3060 Laptop **6GB**. 2026-07-31 실측.

## [확인] 이미지 모델 속도 — 이름으로 판단하지 마라
같은 프롬프트·시드·1216x832, ComfyUI 유휴:
```
flux1-schnell-Q4_K_S    50.2초 / 42.2초
z_image_turbo-Q4_K_M   241.9초 / 202.7초   ← 약 5배 느림
```
**turbo/schnell 같은 이름은 속도 근거가 아니다.** 클로가 이름만 보고 "z_image_turbo가 제일 빠르다"고 형에게 답했다가 실측으로 반박당했다. 원인[추측]: Flux는 텍스트인코더가 t5-xxl Q4(~3GB)인데 Z-Image는 qwen_3_4b **7.5GB**라 6GB 카드에서 매번 스왑. 화질은 Z-Image가 낫고 글자를 안 그리지만(관측 1건), 4장/기사 기준 3분 vs 14분 → **Flux schnell 유지.**

## [확인] LM 상주 ↔ Flux 속도 — 통제 A/B 실측 (효과는 있다, 다만 작다)
flux 1024x768, 동일 프롬프트/시드, 조건마다 ComfyUI `/free` 후 시작:
```
              1회차(디스크 적재 포함)   2회차(정상상태)
A qwen 로드     94.6 / 80.8초           68.2 / 153.0초   ← 2~4.5배 느리고 편차 큼(스왑 증거)
B qwen 언로드   84.4 / 88.4초           34.1 / 34.2초    ← 일정
```
**1회차는 두 조건이 같다**(80~95초) — ComfyUI가 Flux를 디스크에서 올리는 시간이라 LM과 무관. **차이는 2회차부터.**
실이익: 기사당 Flux 생성은 2~3장이고 첫 장은 어차피 80~95초 → **절약분 약 1~4분/실행.**

## ★ 취소된 결론 — 여기서 배울 것
한때 이렇게 적었다: *"LM이 물고 있으면 Flux가 40초→**12분+**가 되고 타임아웃난다. 이게 아침 장애 전부의 원인이다."*

**틀렸다. 두 가지가 반박했다:**
1. **라이브 반례** — 07-29 am 이미지 4장 **2분 58초**, 07-30 pm **6분 49초**. 둘 다 qwen 상주 상태에서 **타임아웃 없이 완주.**
2. **재현 실패** — 통제 A/B 2회 반복에서 "12분+/타임아웃"이 **한 번도 재현되지 않았다.** 최악이 153초다.

12분은 그 직전에 돌린 **z-image 벤치가 qwen_3_4b 7.5GB를 ComfyUI 캐시에 올려둔** 1회성 오염 상태였다 — 라이브엔 없는 조건.
→ **아침 장애들(쇼츠 `TimeoutError`·`generate.mjs` `Unable to connect`·LM 무응답)의 원인은 이게 아니다.** 그건 여전히 미규명.

**교훈:** "A일 때 느렸다 + A를 없애니 빨라졌다"는 인과가 아니다. **A인데 안 느린 경우(라이브 2건)를 먼저 찾았어야 했다.** [[feedback_find_counterexample_first]]를 어겼다. 그리고 **1회 측정으로 배수를 말하지 마라** — 반복하니 12분이 153초가 됐다.

## [확인] Qwen-Image 계열 = 6GB에선 도입 불가 (2026-07-31 조사)
형이 "qwen 이미지 2.0/3.0"을 물어 조사한 결과:
- **2.0(2026-02-10)·3.0(2026-07-21) 둘 다 가중치 미공개** — 알리바바 클라우드 API / 챗 전용. **로컬 실행이 성립 안 함.** 3.0은 파라미터 수·벤치마크·기술보고서도 없음
- 오픈된 최신은 **Qwen-Image-2512**(2025-12-31, 20B, Apache 2.0 — 라이선스는 상업 사용 OK)
- **결정타는 텍스트인코더 크기**: `qwen_2.5_vl_7b` fp8이 **9.38GB**(최소), 원본 16.6GB. nvfp4 6.11GB는 Blackwell 전용이라 3060 불가. **z-image(7.5GB)보다 크다 → 같은 스왑 함정이 더 심하게 재현된다**
- 속도 [보고받음]: 8GB 4060에서 Q4가 **2~3분/장** (Flux schnell 42~50초 대비 3~4배)
- 반대 근거: 저비트 양자화가 깨진다(Q2_K "black image", Q4 "extremely saturated") — **무인 실행에서 산출물이 깨지면 아무도 안 본다**. "48GB VRAM 필요" 평가 존재. LoRA 생태계 빈약
- ★**전략적 불일치**: Qwen의 강점은 "글자를 잘 그림"인데 우리 문제는 "**가짜 영문자를 안 그렸으면** 함"이다. 사려는 장점이 우리 문제를 안 푼다. 한글 많은 산출물은 이미 HTML 렌더가 정답([[reference_image_tool_by_korean_text]])
- 6GB 성공 보고 **0건** (8GB 보고는 다수)

## ★ 공짜 실험 하나 (미실행)
`image-lab.mjs:55`가 z-image 인코더로 `qwen_3_4b.safetensors` **7.49GB**를 물고 있는데, 같은 폴더에 **`qwen_3_4b_fp8_mixed.safetensors` 5.25GB**가 받아만 놓고 안 쓰인다(클로가 파일 크기 직접 확인). **5.25GB는 6GB에 들어간다** → 한 줄 교체로 z-image 202~241초가 줄 가능성. z-image는 글자를 안 그리므로(관측 1건) 되면 **Flux 가짜 글자 문제의 해법**이 된다. 다운로드·비용 0.
[추측] fp8은 3060(Ampere)에서 네이티브 가속이 없어 기대만큼 안 빠를 수 있다 — 실측으로만 확정.

## 배선 위치 [확인]
`run.mjs`에서 언로드해도 **무효**다. `makeImages` 안에서 `buildScenes`(image.mjs:154)가 LM을 부르고 그 **뒤에** Flux(:205)가 돈다 → 앞에서 내려도 3초 만에 도로 올라온다. 효과 있는 유일한 지점은 **image.mjs의 buildScenes 직후·Flux 루프 직전 1줄**.
LM Studio를 쓰는 모듈은 `generate.mjs`·`scene-prompt.mjs`·`shorts-script.mjs` **셋뿐**(qa-gate·claims-audit·originality-gate·related는 안 씀). 언로드 후 JIT 재로드는 **3초**(실측).

## [확인] 실제로 확인된 경합 1건 — 우리 에이전트끼리
이미지 샘플 생성(06:19~07:12)이 GPU를 점유하는 동안 **06:30 쇼츠 실행**이 겹쳤고 로그에 `[shorts-meta] LM 실패 → 규칙 폴백 사용`이 남았다. 양보 장치 `waitForIdle()`이 **ComfyUI 큐만** 보는데 쇼츠는 **LM Studio**를 쓰므로 원리적으로 못 막았다.
→ **로컬 GPU/LM 작업은 서브에이전트 여러 개로 병렬화하지 마라.** 정규 스케줄(06:00·06:30·19:30) 시간대는 피하고, 양보 장치는 ComfyUI 큐와 LM Studio **둘 다** 봐야 한다.

관련: [[reference_local_hardware_spec]] · [[reference_flux_image_pipeline_2026-07]] · [[feedback_find_counterexample_first]] · [[feedback_verified_facts_only]]
