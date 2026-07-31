---
name: reference_colab_lipsync_feasibility_2026-07-31
description: 구글 코랩 무료 GPU는 정책상 자동화 금지(웹UI 우회·원격조종 금지). 무인 자동화가 되는 무료 대안은 Kaggle CLI. LTX-2.3이 로컬에 114GB 받아져 있으나 6GB로 못 돌림
metadata: 
  node_type: memory
  type: reference
  originSessionId: b09dd449-d149-4b1d-9d48-8552ad405f1c
  modified: 2026-07-31T14:57:08.049Z
---

형 질문 "구글 무료 GPU로 립싱크 영상, 우리가 컨트롤 가능한가"에 대한 조사 결과(media-head-siwoo, 2026-07-31).

## [확인] 코랩 무료 티어는 자동화가 정책 위반
공식 FAQ(https://research.google.com/colaboratory/faq.html, 2026-07-31 확인):
- 금지: *"bypassing the notebook UI to interact primarily via a web UI"* — ComfyUI/Gradio를 터널로 띄워 브라우저 조종하는 방식이 정확히 여기 걸린다(우리가 GPT 이미지 생성에 쓰는 chrome-devtools 패턴을 코랩에 그대로 옮기면 위반)
- 금지: *"remote control such as SSH shells, remote desktops"* — 스크립트 원격 실행도 차단
- 실행 API 없음. 예약 실행은 Colab **Enterprise**(Vertex AI, 유료)만 지원
- 전례: 2023년 무료 코랩에서 Stable Diffusion WebUI 자체가 같은 조항으로 차단됨(https://decrypt.co/197428/)

**결론: 코랩 무료는 사람이 매번 클릭해야 하는 "수동 전용"이다. 반자동(브라우저 조종)도 규칙 위반.**

## [확인] 대신 되는 길 — Kaggle CLI
Kaggle은 브라우저 없이 CLI로 GPU 배치 실행이 가능하다. 공식 문서(https://github.com/Kaggle/kaggle-api/blob/main/docs/kernels.md):
- `kaggle kernels push` = *"Pushes new code/notebook and metadata to a kernel, then **runs** the kernel"*, GPU/TPU 지정 옵션 있음
- `kernels status` 폴링 → `kernels output`으로 결과물 회수
- **우리 로컬 cron이 스케줄러, Kaggle은 계산만 — 사람 클릭 0.**

함정 [보고받음]:
- Kaggle **자체 예약 기능은 CPU 전용**(GPU 노트북 예약 불가) — 반드시 push 방식이어야 함
- 한도: GPU 주 30시간, 세션 12시간, 출력 20GB(https://www.kaggle.com/docs/notebooks) — 하루 2~3개면 넉넉
- [추측, 미검증] push 배치에 GPU가 즉시 할당되는지, 큰 모델을 Kaggle Dataset으로 사전 업로드해 재다운로드를 피할 수 있는지는 실제 1회 실행해봐야 확정

## 돈 쓰는 대안 — fal.ai
LTX-2.3 audio-to-video, 초당 $0.10(https://fal.ai/models/fal-ai/ltx-2.3/audio-to-video). 15초 1편 ≈ $1.5(약 2,100원), 하루 3개면 월 약 19만원. API라 100% 자동화, VRAM 무관.

## ★ 로컬에 LTX-2.3이 이미 114GB 받아져 있다 (클로가 실측)
```
D:\Develop\ComfyUIPtb\ComfyUI\models\checkpoints\ltx-2.3-22b-dev-fp8.safetensors                              28G
D:\Develop\ComfyUIPtb\ComfyUI\models\diffusion_models\ltx-2.3-22b-dev_transformer_only_bf16.safetensors        40G
D:\Develop\ComfyUIPtb\ComfyUI\models\diffusion_models\ltx-2.3-22b-dev_transformer_only_fp8_scaled.safetensors  22G
D:\Develop\ComfyUIPtb\ComfyUI\models\diffusion_models\ltx-2.3-22b-distilled_..._fp8_input_scaled_v3.safetensors 24G
```
공식 요구 VRAM 32GB(fp8은 24GB 권장), GGUF로 최소 12GB — **6GB 카드로는 이 중 어느 것도 못 돌린다.** 디스크만 차지하는 중, 삭제 여부는 형 판단 대기.

## 영상 확인 사항
"하트뮬라" = **HeartMuLa**(오픈소스 AI 음악 생성기, Apache 2.0, https://heart-mula.com/). 립싱크는 LTX-2.3의 공식 IA2V(Image+Audio→Video) 워크플로우(https://comfy.org/workflows/video_ltx2_3_ia2v-adca306765ce/) 또는 별도 LipDub IC-LoRA(https://www.runcomfy.com/comfyui-workflows/ltx-2-3-iclora-lipdub-in-comfyui-precise-lip-sync-video-creation) 사용으로 추정. 영상 본문 자체는 fetch 실패로 못 봄 — 동일 주제 자료 교차 확인 기반.

## ★★ 후속 업데이트 (같은 날 오후) — 우리 자체 노트북이 CUDA 오류로 실패, 이미 완성된 대안 발견

**7/20에 자체 제작한 Kaggle 노트북(`D:\Develop\Claude_Channels\kaggle_ltx\`)을 3회 실행했으나 전부 같은 지점에서 실패.**
- 원인 [확인, 클로가 `kagglesdk`의 `get_kernel_session_logs_stream`으로 직접 로그 추출]: `CUDA error: no kernel image is available for execution on the device` (torch.AcceleratorError), 노드 `LTXVAudioVAEEncode`(오디오→영상 결합 단계)에서 발생. 앞선 ComfyUI 설치·모델 다운로드·이미지 노드는 전부 정상 통과 — **설정 오류가 아니라 설치한 torch/CUDA 빌드가 Kaggle이 배정한 GPU 아키텍처와 안 맞는 것.** 재시도로 안 풀림.
- ★교훈: `kaggle kernels output -p <dir>`은 ComfyUI+모델 전체를 "출력물"로 통째로 받아와 수십GB가 될 수 있다 — **로그만 필요하면 `kagglesdk`의 `get_kernel_session_logs_stream` API를 직접 호출해라**(77KB JSON, 수 초 내). CLI 대신 python으로:
  ```python
  from kagglesdk import KaggleClient
  from kagglesdk.kernels.types.kernels_api_service import ApiGetKernelSessionLogsStreamRequest
  req = ApiGetKernelSessionLogsStreamRequest(); req.user_name='...'; req.kernel_slug='...'
  res = KaggleClient().kernels.kernels_api_client.get_kernel_session_logs_stream(req)
  # res.text 에 로그 전체
  ```
- ★Windows에서 `kaggle kernels push`가 `'cp949' codec can't decode byte...`로 실패할 수 있다 — `PYTHONIOENCODING=utf-8 PYTHONUTF8=1` 환경변수로 우회.

**★★ 진짜 발견 — 우리가 처음부터 만들 필요가 없었다.** 형이 본 그 유튜브 영상(행글라이터, https://youtu.be/Hqgu2I8Lgl4) 설명란에 **이미 완성돼 공개된 한국어판 Kaggle 노트북**이 있다(https://www.storywinner.co.kr/free-gpu/):
```
LTX-2.3 립싱크 한국어판   https://www.kaggle.com/code/hangglewriter/ltx-2-3        모델 30GB
HeartMuLa 한국어판(노래)  https://www.kaggle.com/code/hangglewriter/heartmula      모델 22GB
Krea-2-Turbo(인물이미지)  https://www.kaggle.com/code/hangglewriter/krea-2-turbo   모델 18GB
Real-ESRGAN(업스케일)    https://www.kaggle.com/code/hangglewriter/real-esrgan-1080p 모델 80MB
```
원저작자는 AIQUEST Academy(https://www.youtube.com/@AIQuestAcademy), 행글라이터가 한국어화+다운로드 안정화+엔진 버전 고정을 추가(코드에 `[행글라이터]` 주석으로 표시). **Apache 2.0 라이선스로 공개, `Copy & Edit`으로 즉시 복사 가능.**

**공식 안내 함정 4가지** (안 알면 겪는다고 명시):
1. **Accelerator를 T4 x2로, Internet On으로** 맞춰야 함(우리 실패가 이것 때문일 가능성 있음 — 확인 필요)
2. **브라우저 닫지 말고 "Stop Session"을 눌러야 함** — 안 그러면 세션이 최대 12시간까지 돌며 주간 할당량(30시간)의 40%가 사라짐
3. **크롬 자동번역이 Kaggle 화면을 깨뜨림** — "원본 표시"로 꺼야 함
4. **저장은 "Quick Save"로** — 기본값(Save & Run All)으로 저장하면 처음부터 재실행돼 모델을 또 받으며 GPU 시간 낭비

**결론(정정)**: 자체 제작 대신 **이 공개 노트북을 형 계정으로 Copy & Edit** 하는 게 훨씬 빠르고 검증돼 있다. 다음 시도는 이걸로.

## ★★★ 실제로 pull→push해서 검증한 결과 (같은 날, 클로가 직접 실행)
`hangglewriter/ltx-2-3`를 `kaggle kernels pull`로 받아 `blackheart00/ltx-2-3-copy`로 push했다.

**[확인] 좋은 소식 — CUDA 오류가 사라졌다.** `docker_image`가 고정돼 있고 모델이 Kaggle Dataset(`hangglewriter/ltx-2-3-lipsync-models`)으로 미리 첨부돼 있어, 환경 준비~모델 연결까지 **39초** 만에 전부 통과했다(로그 실측). 우리 자체 노트북이 걸렸던 `CUDA error: no kernel image` 재현 안 됨.

**[확인] ★그런데 API/CLI로 push해도 실제 생성은 안 된다 — 설계상 그렇다.** 로그에 명시:
```
"ℹ️ Save & Run All(배치 실행)이 감지되어 화면 띄우기는 건너뜁니다.
   영상을 만들려면 노트북을 열어 Run All 로 실행하세요."
```
이 노트북은 **Gradio 인터페이스를 띄워 사람이 입력(사진+노래)을 넣는 구조**라, `kaggle kernels push`(배치 실행)로 돌리면 코드가 스스로 그 단계를 건너뛴다. `kernels status`는 COMPLETE로 뜨지만 mp4가 안 나온다(출력 파일에 `run_ia2v.py`만 있고 영상 없음).

**→ 결론 갱신: 이 특정 공개 노트북은 "설치 문제"는 해결됐지만 "완전 무인 자동화"는 구조상 안 된다.** 완전 자동화하려면:
1. 노트북 내부의 실제 생성 함수(Gradio 콜백)를 직접 호출하는 방식으로 다시 짜거나(원저작자 코드를 참고해 우리 파이프라인용으로 변형),
2. 아니면 브라우저 자동조종(chrome-devtools, 우리가 GPT 이미지에 쓰는 패턴)으로 Kaggle 노트북 UI를 사람처럼 조작하거나,
3. 아니면 사람(형)이 직접 열어서 클릭 — 가장 빠르고 확실하지만 무인화는 아님.

로그 확보 방법 재확인: `list_kernel_session_output`(kagglesdk)으로 출력 파일 목록 + 실행 로그를 가볍게(다운로드 없이) 볼 수 있다:
```python
from kagglesdk.kernels.types.kernels_api_service import ApiListKernelSessionOutputRequest
req = ApiListKernelSessionOutputRequest(); req.user_name='...'; req.kernel_slug='...'
res = KaggleClient().kernels.kernels_api_client.list_kernel_session_output(req)
```

## 추천 (기존, 유효)
1. 뮤비 1편만 필요하면 → 지금 **수동**으로 충분 (형이 클릭, 형 노래 파일 필요) — 이제는 위 공개 노트북으로 훨씬 쉬움
2. 파이프라인 자동 편입이 목표면 → **Kaggle CLI**로 위 노트북을 push(자체 제작 아님, 검증된 것 재사용)
3. 검증 안 하고 확실히 가려면 → **fal.ai 종량제**

## ★★★★ 실제 영상 생성 성공 (같은 날 저녁, 클로가 브라우저 조종으로 완주)
`blackheart00/ltx-2-3-copy` 인터랙티브 세션에서 막혔던 지점 해결 후 끝까지 완주했다.
- **막힘 원인 [확인]**: 세션 옵션 **Internet 스위치가 꺼져 있었다** → 2단계 `git clone`이 `Could not resolve host: github.com`로 실패. Internet On 토글은 **재시작 없이 즉시 적용**됨(재실행만 하면 됨). 이후 CUDA 문제 재현 없이 쭉 통과(2단계 설치 30초, 3단계 데이터셋 심볼릭링크 연결 수초).
- Gradio 앱은 gradio.live 임시 URL(1주 만료) + cloudflared 예비 터널 둘 다 자동 제공.
- 파일 업로드는 `mcp__chrome-devtools__upload_file`을 업로드 **버튼**이 아니라 그 상위 **드롭존 컨테이너**(uid)에 걸어야 성공 — 버튼에 걸면 "clicking it did not trigger a file chooser" 에러.
- 형 채널 inbox(`.claude/channels/discord/inbox/`)의 첨부파일은 워크스페이스 루트 밖이라 `upload_file`이 거부함 → 세션 scratchpad로 `cp` 복사 후 그 경로로 업로드.
- **실측 결과**: 2초 클립 생성에 **1101초(≈18.4분)** 소요(첫 컷, 모델 로딩 포함). seed 랜덤 지정 시 자동 배정.
- **★사진은 "첫 프레임" 그대로 쓰인다** — 4컷 모델시트(정면·측면·후면·클로즈업 모아찍기)를 통째로 넣었더니 영상도 그 4컷 콜라주 구도 그대로 살짝 움직이는 결과가 나왔다. 노트북 안내대로 **얼굴 1장(정면~살짝 측면, 상반신 크게)** 크롭이 필요 — 다음 시도는 크롭 이미지로.
- 결론 갱신: 완전 자동화(옵션 2 무인)는 여전히 미검증이지만, **형이 원하는 "된다/안된다" 질문에는 확답 가능 — 됩니다.** 브라우저 조종(클로 직접)으로 사진+노래→립싱크 영상 파이프라인이 실측 성공.

관련: [[reference_lipsync_stack_2026-07]] · [[reference_vram_contention_lm_vs_flux]] · [[reference_local_hardware_spec]]
