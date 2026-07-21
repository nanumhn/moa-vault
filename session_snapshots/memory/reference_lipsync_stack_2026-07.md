---
name: reference_lipsync_stack_2026-07
description: "립싱크 도구 선택 기준 — 정지이미지엔 SadTalker, 영상엔 LatentSync. lips_expression 진폭 파라미터. 6GB 후보별 실측 크기"
metadata: 
  node_type: memory
  type: reference
  originSessionId: f4cd8864-98d1-46d7-bad5-78ac224aef2d
  modified: 2026-07-21T08:04:01.642Z
---

**2026-07-21 립싱크 실패 규명에서 얻은 것.** 형 지적("입모양이 사람 얼굴과 어울리지 않고, 입을 크게 벌리지 않아")의 원인이 두 층으로 갈렸다.

## ★1. 도구-입력 형태 미스매치 (근본 원인)

**LatentSync·Wav2Lip·MuseTalk는 "말하는 영상"에 입만 갈아끼우는 도구다.** 원본 영상에 있던 턱·볼·눈 움직임 위에 입을 덮어쓴다.

우리 소스는 **정지 이미지 1장**(`portrait_local.png`)이었고, `VideoLengthAdjuster`의 `loop_to_audio`로 같은 프레임을 복제해 먹였다. → 얼굴은 완전히 굳고 입만 달싹이는 마네킹. **형이 "얼굴과 어울리지 않는다"고 한 게 정확히 이 상태.**

**정지 이미지 1장에는 SadTalker가 맞다** — 이미지 1장 전용 설계, 입뿐 아니라 **고개 움직임·눈 깜빡임·표정까지 생성**.

> **교훈: 파라미터를 만지기 전에 "이 도구가 이 입력 형태에 맞는 도구인가"를 먼저 물어라.** 우리는 이 질문을 안 하고 `lips_expression`만 올릴 뻔했다. 진폭을 키워도 얼굴이 안 움직이는 건 그대로다.

## ★2. lips_expression = 개구 진폭 파라미터

LatentSync 노드의 `lips_expression`(nodes.py:449, **기본 1.5 / 최대 3.0**)이 nodes.py:639에서 `guidance_scale=lips_expression`으로 직결된다. 높을수록 오디오 조건을 강하게 따라가고 그게 곧 개구 크기.

- 실패한 실행은 **1.5 = 기본값이자 최대의 절반**이었다.
- **우리 기존 스크립트 3개(`lipsync_workflow.py` 등)는 이미 2.0을 쓰고 주석에 `bump for singing (more pronounced mouth movement)`라고 적혀 있었다.** 알고 있던 지식이 다른 실행 경로에 반영 안 됐다 → **립싱크 실행 경로 통일 + 검증된 기본값 고정이 미해결 과제.**

## ★3. 실행 파라미터 복원법

**ComfyUI는 출력 PNG에 워크플로우를 통째로 임베드한다.** "직전에 뭘로 돌렸지?"는 추측하지 말고 출력 PNG에서 원본 그대로 복원할 것. 이번 규명의 결정타였다.

## 6GB(RTX 3060 Laptop, 실사용 6144MiB) 후보 실측

| 후보 | 가중치 | 비고 |
|---|---|---|
| Wav2Lip | ~0.4GB | 최경량, 96x96 처리라 화질 최하 |
| **SadTalker** | **0.93GB** | **정지이미지 전용**, 고개·표정 생성. wav2lip 내장 |
| MuseTalk V1.5 | 3.17GB | 256x256 (V1+V1.5 합계는 6.33GB — 하나만 받을 것) |
| LatentSync 1.6 | 4.72+1.5GB | 512x512 최고화질, 진폭 보수적 |
| MultiTalk/InfiniteTalk | Wan 14B | 6GB 불가 |

**qwen(회의모델) 4.46GB 로드 상태에서 여유는 약 1.3GB** → SadTalker·Wav2Lip은 회의 엔진 안 내리고 테스트 가능. MuseTalk·LatentSync는 qwen 언로드 필요(서진 조율).

## 오진했다가 철회한 것 (같은 실수 반복 금지)

- ❌ **"입 주변만 소프트, 크롭·인페인트 구조상 아티팩트"** → 무변경 영역인 볼이 -94.3%로 입(-92.5%)보다 더 떨어짐. 얼굴 **전 영역**이 512 리샘플·되붙이기로 흐려진 것.
- ❌ **"590kbps 저비트레이트가 원인"** → `crf 19`(이미 고품질)였다. **590kbps는 원인이 아니라 결과** — 소스에 디테일이 적어 x264가 적은 비트로 충분했던 것.
- ❌ **"오디오 레벨 부족"** → peak -4.95dB, 클리핑 0, 정상. 정규화 불필요.
- ❌ **"256px 크롭이라 저해상"** → 실행 로그상 **LatentSync 1.6 / 512x512**로 이미 돌았다.
- ℹ️ 꼬리 0.58초 = `silent_padding_sec: 0.5` + `loop_to_audio`. 파라미터로 제거 가능.

## ★후보 비교 최종 결과 (2026-07-21, 모아 정지이미지 1장 기준)

| 후보 | 고개·표정 생성 | 판정 | 근거 |
|---|---|---|---|
| LatentSync 1.6 | ❌ | 부적합 | 입 외 얼굴 모션 0.156 |
| Wav2Lip | ❌ | 부적합 | 모션 0.137, 입 영역 선명도 -78.8%(96x96 처리) |
| MuseTalk | ❌ | **부적합 — 실행 없이 문서로 확정** | 공식: *"exclusively modifies facial regions, not head pose"*, *"does not generate head movement"* |
| **SadTalker** | ✅ | **채택** | **모션 0.886**(타 후보의 6.5배), 입 패치 유사도 0.848(목표 0.85 최초 달성), 512 체크포인트로 화질 유지 |

- 산출물 `output\sadtalker_moa_full.mp4` (3.7MB / 1580x1408 / 30fps / 8.28초). 증거 프레임 `output\_compare\SADTALKER_*.png`
- **소요 약 2시간** — Face Renderer 104스텝이 21→45→59→78→115→131초/it로 **후반 발산**(원인 [모름], GPU 65°C로 발열설은 반증). seamlessClone 207스텝은 2.5초/it로 8분. → **다음 실측 기준: 1580x1408/full/512는 104스텝에 2시간**
- **[모름] 음성 동기·flicker·움직임의 자연스러움** — 클로도 시우도 영상 재생 불가. 형이 재생해야 판정 가능
- ★**MuseTalk은 "탈락"이 아니라 "이 입력 조건에서 부적합"**이다. 실제 *말하는 영상*이 소재면 고개가 원본에 이미 있으므로 약점이 사라진다. `bbox_shift` 파라미터가 입 벌림 조절(LatentSync `lips_expression` 대응) 기능.

**★가장 싼 검증은 실행하지 않고 문서를 읽는 것.** MuseTalk 결론을 GPU 0분·문서 3분으로 냈다. 단 **"실행 대신 문서"가 "실행 대신 기억"이 되면 안 된다** — 서진이 기억으로 "MuseTalk은 구동영상만 받는다"고 답했다가 반증됐다(실제로는 이미지도 받음). **결론은 맞고 근거가 틀린 경우**였고, 그대로 보고했으면 틀린 사실이 기록에 남았을 것. [[feedback_cheap_check_first]]

## 판정 규율

**영상 품질은 반드시 재생해서 판정한다.** 정지 프레임에서 "입이 열리고 닫힌다"를 확인하고 완료 판정했다가 형에게 불합격 받았다. **입이 열린다 ≠ 자연스럽다.** [[feedback_qa_gate_before_report]]

관련: [[reference_media_stack_2026-07]] [[project_moa_lora_video_limit]] [[reference_local_hardware_spec]] [[feedback_verify_before_alarm]]
