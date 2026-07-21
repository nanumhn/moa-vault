---
name: project_session_2026-07-21_snapshot
description: 2026-07-21 세션 열린작업 스냅샷 — 재시작 복구 완료 후 립싱크·얼굴팩·젬마A/B 진행 상태. 재개용
metadata: 
  node_type: memory
  type: project
  originSessionId: f4cd8864-98d1-46d7-bad5-78ac224aef2d
  modified: 2026-07-21T06:17:21.795Z
---

**2026-07-21 03:30 KST 갱신.** 이전 세션은 회신도구 씹힘으로 형이 재시작 지시 → **새 세션에서 회신도구 정상 복구 확인**. 복구 루틴(플래그 확인·유실메시지 회수·cron 2개 재등록) 완료. 형 지시 "연속 진행하자~"로 병렬 작업 중. [[feedback_verify_reply_delivery]]

**⚠️ 이번 세션에서 드러난 신규 장애 패턴:** 01:51~02:14 사이 형 메시지 5개(`A???`/`ping`/`???`/`시동 걸려`/`하이 클로~?`)가 **전부 무응답**. 세션은 계속 새로 떴는데(웹훅 "시동 ON" 6회 발송) Discord 실시간 수신이 안 되는 "귀 닫힘" 상태였음. 형이 50분 대기. → **웹훅 시동알림은 세션 생존 증거가 아니다**(웹훅은 claude와 독립). 5분 워치독 cron이 이 상황의 유일한 안전망. [[reference_discord_send_glitch_and_tz.md]]

## ✅ 완료

**립싱크(LatentSync) — 형 지적사항 해결**
- `D:\Develop\ComfyUIPtb\ComfyUI\output\latentsync_ko_00001-audio.mp4` (713,712B, 음성포함) / `latentsync_ko_00001.mp4` (655,212B, 무음). 2026-07-20 22:11 KST.
- 832x1216 / h264 / 25fps / 222프레임 / 8.88초 + AAC 16kHz mono. ffmpeg 전체 디코드 에러 0.
- 입 개폐가 오디오에 맞춰 교대 확인 = 형이 지적한 "입모양 부자연스러움" 해결.
- **잔존 한계:** 입 주변만 나머지 얼굴보다 소프트, 합성경계 옅게 보임. LatentSync가 얼굴을 256px 크롭·인페인트 후 되붙이는 구조상 아티팩트라 **재생성으로는 제거 불가** → FaceDetailer 후처리가 정공법.

**얼굴보존 팩 6항목 — 설치 완료 (실전 검증은 아님)**
FaceDetailer(Impact-Pack V8.28.3) / SAM(sam_vit_b_01ec64.pth 375,042,383B) / YOLO(face_yolov8m.pt 52,026,019B) / RealESRGAN(67,040,989B) / PuLID(pulid_v1.1.safetensors 984,405,232B, 312 tensors) / insightface antelopev2(onnx 5개 checker 통과).
- **전임 세션이 파일만 받고 끝나 있었음** — 그대로 뒀으면 형이 노드를 못 찾았을 상태. 이번에 실제로 고친 3가지: ①`segment_anything`·`dill`·`piexif` 미설치로 import 단계에서 죽던 것 설치 ②최신 Subpack이 레거시 `.pt`에 요구하는 화이트리스트에 `face_yolov8m.pt` 등재 ③PuLID/IPAdapter가 껍데기(노드만 있고 모델 0개)여서 모델 채움.
- **★검증 수준 단서: "노드 로드 + 파일 무결성"까지. GPU 실제 워크플로우 화질 테스트 미실시.** 설치 완료 ≠ 실전 검증 완료.

## 🙋 형 대기 (블로커)

**ComfyUI(8188) 재시작 — 형만 가능**
- 프로덕션 8188(PID 18548)은 7/20 17:05 기동, 얼굴팩은 21:55 설치 → **8188에 FaceDetailer 계열이 하나도 안 올라와 있음**(`/object_info` MISS 확인). ComfyUI는 기동 시 1회만 노드를 읽음.
- **관리자 권한 프로세스라 내 셸에서 종료 거부(Access Denied).** Manager reboot 엔드포인트는 이 버전에 없음(404). → 형이 창 닫고 재실행. 인자: `python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --listen 127.0.0.1 --port 8188`
- 03:22 형에게 요청 발송 완료, 미응답(새벽).

## ✅ 추가 완료 (KST 13:00 기준)

**젬마4 E4B 교체 — 불가 판정, qwen 유지 (서진 실측)**
- gemma-4-e4b = **6.33GB > 카드 6.14GB**. qwen 내리고 **단독 실행해도 1콜 8분 49초**. 경합 문제 아님.
- 모든 콜이 `content: ""`, `completion_tokens: 0`, 영어 사고 스텁 ~50토큰만 반환. `call_lm`은 content 비면 `reasoning_content`로 폴백하므로 **플립했으면 회의록에 영어 사고과정이 발화로 박혔음.**
- git 이력상 과거에 이미 gemma→qwen으로 이탈한 결정이었음(되돌릴 뻔함).
- ★교훈: 클로가 시우 벤치를 근거로 "젬마 압승, 교체" 자동채택 → **벤치가 틀렸음.** "플립 조건부" 지시가 사고를 막음. **자동채택엔 반드시 실측 검증을 붙일 것.**
- ★로드 상태 확인은 이 머신에선 **`lms ps`**가 기준. `/v1/models`는 *사용가능* 목록이라 부적절, `nvidia-smi --query-compute-apps`는 권한문제로 `used_gpu_memory`가 전부 `[N/A]`.

**qwen 한국어 게이트 — 구현·검증·main 머지 완료 (커밋 385eb74)**
- ★**"한글 비율" 지시 자체가 틀렸음.** 실측: 한글/전체알파벳은 정상 0.364~1.000 vs 오염 0.423·0.313 → **구간 겹쳐 사용 불가**(ComfyUI/Prisma 나열한 정상 발화가 중국어 오염보다 낮게 나옴). → **라틴문자를 분모에서 제외**한 한글/(한글+한자+카나)로 완전 분리(정상 34건 전부 1.000 vs 오염 0.755·0.431).
- 임계값: `CJK_RATIO_MIN 0.95` / `CJK_ABS_MIN 3`(관용 한자인용 통과) / `HANGUL_FLOOR 0.15` / 템플릿누출 정규식 `<\|[a-zA-Z_]+\|>` 별도.
- 실제 회의 2회 완주, **2회 다 실전 발동**(템플릿 누출 1건 + 중국어 540자 붕괴 1건). 최종 transcript 오염 0건.
- 재생성 1회 고정, 실패 시 `lang_flag` 남김(조용히 안 나감). 로그 `logs/lang_gate.jsonl`.
- 비용: 검사 326µs / **발동률 초기관측 18발화 중 2건(11%) — 표본 작음, 수주 후 재측정 필요** / 회의당 +10~25초.
- 함께 머지된 미커밋 201줄(gemma→qwen, `get_active_model()`, vault Skills 주입)은 CLAUDE.md 2026-06-13 기록된 의도된 작업. main에 `get_active_model()`이 없던 상태였음 = 유실 위험 구제.

**★소스 이미지 왜곡 발견 (시우)**
- `moa_face_ref_*`는 `crop_moa_face.py`가 **384x256 → 832x1216 강제 리사이즈(세로 4.75배)** 한 왜곡 파일. 4등분(256px) 경계가 실제 컷 경계(y=353, y=670)와 안 맞아 ref_2는 두 컷 걸침, ref_3은 뒤통수.
- **과거 산출물 오염 범위 추적 지시함** — 형이 예전 지적한 증거영상도 이 왜곡 소스였다면 "립싱크 품질 문제"의 일부가 실은 소스 왜곡.
- 최종 소스 = 모델시트에서 픽셀단위 경계검출로 크롭(395x352) → RealESRGAN 4배 → **`ComfyUIPtb\ComfyUI\input\moa_lipsync_src.png` (1580x1408)**. 라플라시안 4.3→48.3.
- 부수성과: RealESRGAN을 8188 프로덕션 워크플로우로 **실제 실행**해 산출물 냄 = 지안 재검조건 일부 충족(드롭다운 아닌 실행).

## ✅ 립싱크 후보 비교 (KST 15:20 기준)

**★형 지시(KST 14:21): "사실 관계 확인하고 검증된 사실만 얘기해, 추측하거나 거짓을 보고 하지 말고."** → [[feedback_verified_facts_only]] 신규. 보고에 **[확인]/[보고받음]/[추측]/[모름]** 출처 표기 시작.

**소스 확정:** `ComfyUIPtb\ComfyUI\input\moa_lipsync_src.png` (1580x1408). 형이 지정한 `Data\MOA-Model-Sheets.png`에서 픽셀단위 경계검출 크롭(395x352) + RealESRGAN 4배. **종횡비 1.122 — 서진이 독립 크롭한 값과 소수점 셋째자리까지 일치(교차검증).**

**Wav2Lip — 형 탈락 확정 (KST 14:31)**
- `output\wav2lip_moa_00001-audio.mp4` 2.3MB / 1580x1408 / 25fps / 10.4초
- 클로가 직접 프레임 추출·육안 확인 후 증거 이미지 첨부해 보고 → 형 "생성된 이미지는 탈락"
- (a)개구 1.16→**1.78배 개선**, 폐쇄프레임 0→3개 [보고받음] (b)얼굴 모션 0.137 = **마네킹 그대로** (c)음성동기 **[모름] — 시우도 클로도 영상 재생 불가** (d)입 영역 선명도 -78.8%, 96x96 처리 한계
- ★클로 오판: 4프레임만 샘플링해 "개구 여전히 작다"고 단정 → 260프레임 전수 측정치와 어긋나 정정함

**SadTalker — 실행 중 (KST 14:31 착수, 총 67분 예상)**
- numpy 2 비호환 2건 패치로 돌파: `face3d/util/preprocess.py:50`, `utils/preprocess.py:180` — 둘 다 크기1 배열에 `float()`. 수정은 `float(np.asarray(v).ravel()[0])`(numpy 1.x와 값 동일). 추론경로 전체 전수조사 후 안전한 것(파이썬 int·상수)은 미수정
- **VRAM 단독 피크 1796MiB** — 첫 시도의 5962는 qwen 4816 포함값이었음이 실측으로 확정
- ★**방향 4회 번복**(40분상한→완주→crop/256전환→완주확정). 클로가 근거만 보고 매번 빠르게 승인, **번복 자체가 비용**임을 계산에 안 넣음 → 못 박음: 완료/실패까지 방향 불변, 예외는 실패신호뿐
- ★교훈: **`full`+512로 바로 들어간 게 실수.** crop/256으로 "고개가 움직이나"만 싸게 확인 후 고화질로 갔어야. **다음 후보(MuseTalk)부터 이 순서 적용**

**왜곡 소스 조사 결론 (서진, 전부 [확인])**
- 실제 왜곡량은 **2.19배**(4.75는 세로확대율일 뿐). 원인은 **오른쪽 열이 3컷인데 4컷으로 가정**한 것(경계 y≈355/672)
- **형이 예전 지적한 증거영상은 왜곡과 무관** — `portrait_local.png`는 832x1216 SDXL txt2img 직생성, 게다가 **40대 남성 vs 젊은 여성으로 아예 다른 인물.** → **후보 비교 전제 무사, 재실행 불필요**
- ref_2/3/4는 소비처 0건(출력 PNG 190건 전수 스캔). 오염 산출물은 2026-05-08 썸네일 12건뿐, 립싱크 계열 0건
- 조치: `crop_moa_panels.py` 신규(구분선 자동검출·종횡비 보존), 구버전 `crop_moa_face.py`는 **폐기 주석 + 역추적표만** 남기고 보존(과거 산출물 재현 근거). `lipsync_moa_run.py` 기본값을 왜곡파일→`moa_lipsync_src.png`로 교체 + `check_source()` 차단장치(**단 범용 탐지기 아님, 알려진 파일 열거 방식**)

## 🔵 진행 중

- **시우** — 립싱크 후보 비교. **★SadTalker(0.93GB) 먼저 지시했는데 LatentSync(4.72+syncnet1.50=6.22GB > 6.14GB)로 건너뛴 정황 — 확인 중.** syncnet이 추론 상주 구성인지 확인 + VRAM 실측 후 근접 시 중단 지시함.
- **지안** — 화질 역행 경고(Wav2Lip 96 / SadTalker·MuseTalk 256 vs LatentSync 512). ★정리: **화질은 후처리로 복원 가능(RealESRGAN·FaceDetailer)하지만 머리 움직임은 후처리로 못 만든다** → SadTalker+후처리가 유력, 이 경우 얼굴팩은 "나중에"가 아니라 필수.
- **GPU 현황: qwen 언로드됨, 6.0GB 전부 가용, 회의 엔진 정지.** 시우 완료 신호 → 서진이 `lms load qwen2.5-7b-instruct --gpu max --context-length 8192`로 복구.

## 📋 시우 보정 패스 계획 (승인됨, 재시작 후 즉시 실행)

- 스크립트 `D:\Develop\Claude_Channels\lipsync_face_restore.py` — VHS_LoadVideoPath → FaceDetailer(SDXL+YOLO+SAM) → VHS_VideoCombine(오디오 재결합, 25fps). 8189 임시 인스턴스 스키마 덤프로 그래프 전체 정적 대조 PASS.
- "전" 기준 프레임 고정: `output\_compare\BEFORE_mouth_f60-83.png`·`BEFORE_full_f60-83.png`. **테스트 구간 60~83프레임** — 같은 입모양끼리 비교되게 하려는 설계.
- **리스크 3건(시우 사전 고지):** ①FaceDetailer는 얼굴을 다시 그리는 도구라 denoise 올리면 립싱크가 도로 깨짐 → `denoise=0.20`로 낮게. 대가로 **개선 폭도 제한적일 수 있음** ②프레임 독립 처리라 시간축 flicker 완전 제거 불가(seed 42 고정으로 억제, **재생해서** 확인 필수) ③전체 222프레임 20~50분 GPU 점유.
- **★판정 기준(클로 확정): (a) 소프트함·합성경계 개선 여부 / (b) 입모양 유지 여부. (b)가 깨지면 (a)가 좋아져도 실패.** 애초 고치려던 게 립싱크라 선명해졌는데 입이 어긋나면 원점 회귀.
- **★"개선이 미미하면 전체 돌리지 않고 그 사실부터 보고"** — 30분 태우고 "별 차이 없습니다"가 최악.

## 🟡 형 결정 대기 (이전부터)

- Eco Sort Phaser 트럭 버전 플레이 피드백 (`D:\Develop\eco-sort-phaser`, bun serve 8090, 폰 `192.168.0.107:8090` — 서버 생존 확인됨). canvas 원본 `D:\Develop\eco-sort` 보존 중.

## ★재개 순서

①형 ComfyUI 재시작 확인 ②서진 A/B 완료 확인 후 결과 결재 ③시우가 서진에게 GPU 사용 통보 → `--test` 24프레임 → 전/후 판정 → 개선 확인 시에만 전체 222프레임 ④지안 검수 결과 반영 ⑤Eco Sort 피드백

관련: [[project_eco_sort_game]] [[reference_media_stack_2026-07]] [[feedback_clo_orchestrates_agents_execute]] [[feedback_qa_gate_before_report]] [[feedback_verify_before_alarm]] [[project_moa_lora_video_limit]]
