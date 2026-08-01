---
name: project_atz_held_queue_and_slot_monitoring_2026-08-01
description: "아투 오늘자 미발행 소동 — 원인은 재부팅이 아니라 QA 게이트 오탐 + 보류큐 소비자 부재. 정시발행 감시 신설, 세션cron 추가"
metadata: 
  node_type: memory
  type: project
  originSessionId: a5faaf90-9bc4-408d-9eba-7ef115b04f4c
  modified: 2026-08-01T04:24:10.756Z
---

2026-08-01 형이 "오늘 아투 포스팅 보고 없어" 지적 → 조사한 결과.

## ★ 내가 처음에 형에게 한 추측은 틀렸다
"새벽 4시 재부팅 때 세션 cron이 날아갔을 것"이라고 형에게 먼저 보고했는데 **오답**이었다. 아투 발행은 Windows 작업 스케줄러 `MoaAtzPublish`(하루 2회 06:00/19:30, `C:\Users\user\.moa\atz_scheduled.ps1`)로 도는 별도 스케줄이라 재부팅과 무관하고, 실제로 그날 06:00에도 정상 실행됐다. [[feedback_find_counterexample_first]]대로 반례부터 찾았어야 했는데 그럴싸한 첫 가설(재부팅=최근 사고 패턴)에 바로 갔던 게 패인.

## 진짜 원인 — 2단
1. **QA 게이트 오탐 2건**이 오늘 06:00분 글을 발행 차단: ①인용 대조가 소제목의 조사(`를`) 하나 때문에 어긋남(부분문자열 매칭이 너무 엄격) ②고유관점 절 탐색 정규식이 '영향'만 알고 '의미'는 몰라서 GPT 글은 늘 "해석절 없음"으로 오판 — 이건 발행은 안 막았지만 originality-gate 계측치를 상시 오염시키고 있었다.
2. **보류함(`out/held/`) 소비자가 존재하지 않았다.** 2026-07-27 형 지시로 "보류분은 형에게 바로 안 보내고 큐에 쌓았다가 재검수"하는 설계였는데, 그 재검수를 도는 코드/cron이 어디에도 없어서 **보류=조용한 유실**이었다. 증거: 7/29 보류건이 3일째 그대로 방치.

## 처리
- 게이트 2건 수정(회귀테스트 9건 추가, 아투 전체 276 passed), 오늘 아침분 재검수 통과 → 발행 완료(https://www.american-todayz.com/2026/08/blog-post.html, 총 193→194).
- **정시발행 감시 신설**: `healthcheck.config.json`에 `publishSlotsKST: ["06:00","19:30"]`+`slotGraceMinutes: 60` 추가, `moa_healthcheck.ps1`에 "예정 슬롯+유예 지나도 최신글이 그보다 오래됐으면 🔴" 로직(기존 `staleAlertHours` 방식과 별개 병행 — 그건 26시간짜리라 하루 1회 누락을 못 잡음). 슬롯테스트 7/7 통과, DryRun으로 오늘 사고 재현 케이스도 검증됨.
- **세션 cron 신설**(`session_bootstrap.md`에 ⑤로 영구 등록): `15 7,21 * * *`, 보류큐 확인해서 검수 라우팅. 이게 없으면 게이트를 아무리 고쳐도 다음 오탐 때 또 조용히 쌓인다.

## 형 결정 완료 (2026-08-01 04:23)
- 7/29 방치건("트럼프 이란 보복 예고") → **폐기 확정**. `out/held/discarded/`로 이동 + status:"discarded" 마킹 완료.
- 이번 수정분(qa-gate.mjs, originality-gate.mjs, shorts-run.mjs 썸네일) → **커밋 진행 승인**, cto-seojin에 위임(기존 미커밋 20여 건과 섞지 않는 스코프로).

## 같은 맹점이 남은 다른 파이프라인 (당장 안 급함, 목록만)
아투 쇼츠(`staleAlertHours:72`, 최대 3일 늦게 잡힘) · n8n 데일리카드/블로그자동생성(maxAgeHours 28) · MoaSearchConsole·MoaMcpGuard·MoaAckBot·MoaSessionReset(scheduledTasks 감시 대상에 아예 없음).

관련: [[reference_atz_shorts_thumbnail_bug_2026-08-01]] · [[reference_moa_healthcheck]] · [[feedback_find_counterexample_first]] · [[feedback_ontime_publish_over_qa]]
