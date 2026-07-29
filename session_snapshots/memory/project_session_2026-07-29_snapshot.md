---
name: project_session_2026-07-29_snapshot
description: 2026-07-29 세션 스냅샷 — 아투 창작 원인 수정·라이브 6편 복구·클로2 배선·중복세션 버그. 형 대기 3건
metadata: 
  node_type: memory
  type: project
  originSessionId: 29c54c49-d2c2-4901-908c-7ba438cd2d1f
  modified: 2026-07-29T15:26:41.602Z
---

재개용. 이날 한 일과 형이 결정할 것.

**형 대기 3건**
1. **클로2(봇②) 토큰** — 배선 완료, `C:\Users\user\.claude\channels\discord2\.env`에 `DISCORD_BOT_TOKEN=` 한 줄이면 기동. 기동기 `.moa\moa_launch_clo2.ps1`(토큰 없음/봇①과 동일이면 실행 거부). 미검증: claude가 MCP 서버에 env를 물려주는지.
2. **MoaSessionReset 권한 상향** — UAC 필요. 급하지 않음(실패 시 중단+알림하도록 고침).
3. **아투 채널 방향** — 형이 "쇼케이스로 키워보자" 확정. 각도=뉴스 유지 + 한국 영향 해석 심화(별도 시리즈 X).

**아투 파이프라인 — 오늘 고친 것 (미커밋)**
`tools/atz-pipeline/generate.mjs`: 확장 프롬프트의 산업 5칸 목록 제거 / target 인자 전달 / 지시문 길이 실측 / `qualityGate(minLen)`·`rankCandidate(cap)`를 자연 분량 기반으로 / **제목이 소제목으로 새는 것 차단**(SECTION_TITLES) / 지시문 예시 문장 제거(모델이 그대로 베껴 발행됨).
신설 테스트: `expand-prompt.test.mjs`(6) · `title-gate.test.mjs`(10). 전체 37개 통과.

**라이브 복구 6편** — 정전협정·미-이란·관세상시·12.5%·애플마이크론(창작 제거) + 젤렌스키회동(제목·유출문구·중복). 전부 `update-post.mjs`(posts.patch)로, 제목·라벨 재조회 확인.

**오늘 낸 실수 4건 (같은 실수 반복 방지용)**
- `posts.update`로 제목·라벨 날림 → [[reference_blogger_update_wipes_fields]]
- 바이트를 글자 수로 읽어 근거량 2.4배 과장(9,330 → 실제 3,889자)
- ack 봇을 "정체불명 발신"으로 오진 — 로그 30초면 확인됐다
- 프롬프트에 베낄 예시 문장을 준 것 자체가 유출 원인

**★형에게 정정할 것 (아침에)** — 형에게 "오늘 밤 21시 실행"이라고 두 번 말했는데 **틀렸다.** 실제 스케줄은 `MoaAtzPublish` **06:00 / 19:30 KST**다(작업 스케줄러 실측). 그리고 07-29 19:30 실행분은 **1차 수정(산업목록 제거·target 전달)만** 담겼고, **제목 게이트·프롬프트 유출 수정은 그 뒤(20:15경)에 들어갔다.** 전부 담긴 첫 실행은 **07-30 06:00**이다.

**미착수**
- 게이트 수치 요구가 숫자 없는 사안(기념사)에 창작을 유도 → 사안 유형별 분기 필요
- EU구글 1편(창작 아닌 일반론)
- 계측 모드 → 차단 모드 전환(조건: 통과율 3회 연속 100%)
- 승인 카드에 제목 표시(형이 승인 전에 제목을 보게)

관련 [[project_atz_fabrication_root_cause_2026-07-29]] · [[reference_atz_youtube_channel_economics]]
