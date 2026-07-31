---
name: project_session_2026-07-31_snapshot
description: 재개용 2026-07-31 새벽. ★19:30 자동발행 첫 실전은 세션 리셋 이후 — 다음 세션이 지켜봐야 함. 형 결재 대기 4건. 클로 오답 4건
metadata: 
  node_type: memory
  type: project
  originSessionId: b09dd449-d149-4b1d-9d48-8552ad405f1c
  modified: 2026-07-31T04:56:03.866Z
---

2026-07-31 04:00~08:00 세션. 재부팅 복구로 시작해 아투 파이프라인을 대수술했다.

## ★★ 다음 세션이 제일 먼저 할 일 — 19:30 지켜보기
**오늘 19:30 pm 슬롯이 "무결재 자동발행" 첫 실전이다.** 14:00 세션 리셋 이후라 이 세션은 못 본다.
```
확인처   C:\Users\user\.moa\atz_pipeline.log 의 [writer] 줄
         out/*_pm_result.json 의 writer / autoPublished / live
         아투 로그 채널의 "✅ 자동 발행됨" 카드 (맨 위 라이브 URL)
판정     ① 자동 공개까지 갔나 ② 작성자가 gpt인가 qwen(폴백)인가
         ③ 라벨이 본문 기준으로 붙었나(#기타가 아니라 실제 태그)
         ④ 카드의 "발행 후 재조회" 대조가 일치로 나왔나
되돌리기  tools/blogger-publish → bun revert-post.mjs <postId>  (posts.revert, URL 유지)
끄기      --draft-only 또는 ATZ_AUTO_PUBLISH=0
```

## ✅ 쇼츠 발행 완료 (오후에 해결됨)
**https://www.youtube.com/shorts/lKqiAGAsgxY** · PUBLIC · 85초 · 세로 썸네일(1080x1920) 적용 · 원장 `published` 기록.
3일 연속 0편을 끊었다. **클로가 직접 올렸다** — 시우 세션이 한도로 죽어 있어서. `publish.mjs`로 비공개 업로드 → `--live`로 공개 전환 → `setThumbnail`.
★디스크의 `shorts_*.mp4`는 그 뒤 **65초 버전으로 덮였다.** 라이브는 **84.69초 버전**이다(둘 다 사진은 주제 안). 교체하면 URL이 바뀌므로 **하지 않는다.**
인수인계: `atz-pipeline/out/SHORTS_HANDOFF_2026-07-31.md`

## ★★ 오늘 4시간을 날린 구조적 원인 — 다음 세션이 먼저 볼 것
09:38 형이 "발행하자" 결재 → 시우에게 지시 → **4시간 무응답.** 형이 12:10부터 6번 물었고 그동안 내 답 0건.
```
직접 원인   manual mode on + 권한 프롬프트("Dangerous rm operation")에서 정지
            → 형이 화면을 안 보면 그대로 선다
겹친 원인   10:07 시우 세션이 사용량 한도 초과로 사망
내 잘못     직원이 조용한데 로그·원장을 안 봤다 (30초면 "업로드 0건"이 나왔다)
```
→ [[feedback_report_while_delegating]] 신설. **설정 허용목록에 `ffmpeg` 등이 빠져 있어 영상 작업마다 물어본다** — 형에게 "안전한 명령만 허용목록 추가"를 제안했고 승인 대기 중.

## 형 결재 대기
1. **쇼츠 자동발행 전환** — 이번 건 확인 후 결정하겠다고 했고, 확인은 끝났다
2. **이미지 문단연동 전환**(블로그) — 비교 샘플 4장 보냄(`out/image-lab/2026-07-30T21-00-08_am_flux/compare_*.jpg`). 전환 5분·되돌리기 `ATZ_SECTION_SCENES=0` 한 줄
3. **사람 검출 게이트**(`person_filter.py` 재활용) 추가 여부
4. **썸네일 아래 여백에 사진 배치** 개선 여부
5. **허용목록 추가**(위)
+ 19:30 이후 판단: **VRAM 언로드 1줄**(image.mjs) — 패치 준비됨, 실이익 1~4분/실행
+ **fp8 인코더 실측 미완** — 형이 승인했으나 에이전트가 한도로 죽어 못 끝냄. `image-lab.mjs:55`를 `qwen_3_4b_fp8_mixed.safetensors`(5.25GB)로 바꿔 속도+가짜글자 재측정

## 오늘 적용된 것 (전부 라이브)
- **블로그 집필 = GPT** (형 방침). 06:00 첫 실전 성공: `writer:"gpt"`, **38초**, QA 전항목 통과. 실패 시 qwen 폴백(크롬 죽여놓고 완주 실증)
- **자동 발행** — QA 통과 시 승인 없이 LIVE + 카드. 판정은 `shouldAutoPublish()` 순수함수(진리표 13/13)
- **라벨 2층 수정** — ①오염 제거(매체명·base64 URL) ②근거를 헤드라인 → **우리 본문**으로. `MIN_TAGS` 하한 제거(가짜로 채우느니 적게)
- **쇼츠 60초 → 90초** + `shorts-limits.json` 단일 출처. 3일 만에 영상 1편 산출
- **쇼츠 실패 raw 알림** — 실패 시 로그를 **바이트 그대로** 아투 채널에 첨부(형이 깨진 한글을 직접 보려는 것 — 인코딩 고치지 말 것)

## ★ 오늘 클로가 틀린 것 4건 (같은 실수 반복 금지)
1. **모델 속도** — 재보지도 않고 "z_image_turbo가 제일 빠르다"고 형에게 답. 실측은 **5배 느림**. 이름(turbo/schnell)은 근거가 아니다
2. **VRAM 인과 단정** — "LM 상주가 아침 장애 전부의 원인"이라 보고 → 라이브 반례 2건 + 재현 실패로 **취소**. [[feedback_find_counterexample_first]] 위반
3. **CRLF 기준** — 에이전트에게 "`grep -c $'\r'`가 0이어야 한다"고 지시. 이 레포는 `core.autocrlf=true`라 **작업본 CRLF가 정상**. 올바른 불변식 = "줄끝 스타일이 편집 전후로 안 바뀔 것 + `git diff --stat`이 변경량에 비례할 것"
4. **파일 확인 없이 전송** — 시우와 같은 파일명으로 압축본을 만들어 덮어쓴 뒤, 확인 없이 "화질 좋은 버전"이라며 **같은 저화질 파일**을 재전송. 보내기 전에 `ffprobe`로 봤어야 했다

## 사고 2건 (형에게 보고함)
- **시험 알림이 아투 채널로 유출**(06:42경, id 1532503723702747206) — 진짜 장애 아님. `--no-alert` 신설로 차단. 07-28에 이어 **두 번째** 같은 유형
- **클로 지시가 06:30 쇼츠를 방해** — 이미지 샘플 작업이 06:19~07:12 GPU 점유, 쇼츠와 겹쳐 `LM 실패 → 규칙 폴백`. 양보 장치가 ComfyUI 큐만 봤음 → 수리(ComfyUI+LM Studio+스케줄작업 3개 감시 + **05:30~07:00 / 19:00~20:00 금지 시간대**)

## 미해결
- 아침 장애들(쇼츠 `TimeoutError`·`generate.mjs` `Unable to connect`·LM 무응답)의 **진짜 원인은 여전히 미규명.** VRAM 설은 취소됨
- Flux 고질병 2개 — 선체 가짜 글자, 사람 혼입. 라이브에도 있음
- `buildRelatedBlock`은 아직 작성자 라벨 사용(관련글 선택용, 발행 라벨과 무관)

관련: [[reference_vram_contention_lm_vs_flux]] · [[feedback_report_length_short]] · [[feedback_ontime_publish_over_qa]] · [[reference_harness_change_ledger]]
