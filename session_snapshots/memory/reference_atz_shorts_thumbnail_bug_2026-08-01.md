---
name: reference_atz_shorts_thumbnail_bug_2026-08-01
description: "아투 쇼츠 자동발행에 썸네일 첨부 단계가 통째로 빠져있던 버그, 원인·수정·백필 기록"
metadata: 
  node_type: memory
  type: reference
  originSessionId: a5faaf90-9bc4-408d-9eba-7ef115b04f4c
  modified: 2026-08-01T03:13:11.575Z
---

2026-08-01 형 지시("ShortsID aKdi0zoGIQY 썸네일 챙겨서 발행")로 발견. 한시우가 조사·수정.

## 원인
`D:\Develop\moa-studio\tools\atz-pipeline\shorts-run.mjs`가 `publish.mjs` 호출 시 **`--thumb`를 한 번도 넘기지 않았다.** `--first-frame-branded` 플래그만 줬는데, 이건 "첫 프레임이 브랜드 커버다"라는 단언(assertion)일 뿐 실제 `thumbnails.set` API를 호출하지 않는다. `setThumbnail`·`AtzThumbnail` Still·`render_thumb.sh` 등 배선 자체는 다 있었는데 **호출 코드만 빠져있었음.**

결과: 자동 파이프라인이 만든 쇼츠는 전부 유튜브가 임의로 고른 프레임이 썸네일이 됐다. 실측 확인된 피해: `lKqiAGAsgxY`(7/31), `PUujkJeWNsE`(7/29) — 브랜드 커버가 아니라 본편 중간 프레임. (`3GO2ufomlEA`·`zQEMU6PiNTQ`·`DCzDQgChpak`는 사람이 손으로 붙이던 시절이라 정상)

## 수정
`shorts-run.mjs`에 ⑥-1 단계 추가: 렌더된 mp4의 0.2초 프레임을 ffmpeg로 뽑아 `--thumb`으로 전달. remotion still 재렌더 대신 이 방식을 쓴 이유는 화소차 실측 1.39/255로 사실상 동일한데 비용이 0에 가깝고 ffmpeg가 이미 필수 의존이라 새 실패 지점이 안 늘어남. **9:16(1080×1920)**로 만듦 — 기존 `ThumbnailWide`(16:9)는 쇼츠 선반에서 가운데만 잘려 좌측 카피가 날아감. 썸네일 실패해도 업로드는 안 막음([[feedback_ontime_publish_over_qa]] 원칙 준수).

백필: `aKdi0zoGIQY`(신규), `PUujkJeWNsE`·`lKqiAGAsgxY`(기존 2건) 브랜드 커버로 교체 완료(공개 상태는 안 건드림).

## 미결
- `QrC6UDbNEJ0`(7/30, "트럼프 이란 보복 경고")가 비공개 대기 상태로 남아있음 — 발행/폐기 형 결정 대기.
- `shorts-run.mjs` 수정분이 git 미추적(`??`) 상태 — moa-studio 레포에 미커밋 변경 20여 건 쌓여있어 한시우가 임의로 커밋 안 함. 서진이 정리 필요.

관련: [[reference_atz_shorts_approval_channel]] · [[feedback_ontime_publish_over_qa]]
