---
name: project_system_wide_review_2026-08-12
description: "형 요청(8/8예고)으로 진행한 모아 시스템 전체 리뷰 — 6개 서브시스템+워치독19개 전수조사, 정리후보 5건, 인포그래픽 발행"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4166856e-c7da-40b3-8c0d-8064c43df842
  modified: 2026-08-12T02:10:08.694Z
---

2026-08-12 11:50경 형이 옵시디언 활용에 대해 질문하다가 "전체 리뷰하고 옵시디언도 포함해서 할까?"로 확장 → 8/8에 예고됐던 [[project_full_system_review_pending_2026-08-08]]를 지금 실행함(12:43 링크검증 대기 중이라 여유있는 타이밍).

**5개 병렬 조사 에이전트 결과 요약**:
1. **세션리셋/저장**: 04:00 재부팅+14:00 재시작+flag대기(최대35분) 구조 정상 동작 확인(오늘 04:27 flag 감지). `MoaServerReboot`(Disabled, 8/5부터 정지)는 `MoaSessionReset -Reboot`와 완전 중복 — **삭제 후보 1순위**.
2. **아투 파이프라인**: 최근7일 13건 발행, 보류큐 비어있음, 정상. 잔재파일(nul, .bak 3종) 삭제 가능.
3. **덱스·제나 브릿지**: 오늘 00:00/00:50/10:10 반복 원인불명 다운, 10분 워치독이 매번 자동복구는 하지만 근본원인 미확정 — 조사 필요.
4. **회의엔진(clo_studio)**: LM Studio 정상, 페르소나16명·팀21개 있으나 8/8 이후 4일째 미사용 — 저활용. .tmp_* 11개+output 44개 무기한 누적, 아카이브 정책 없음.
5. **워치독 19개 전수**: 17개 살아있음, 1개 Disabled(MoaServerReboot), 1개 미확인(MoaAckBot, 04:28 이후 로그정지 — 조건부발동이라 방치인지 불명).
6. **옵시디언 활용**(먼저 조사됨): 쓰기(vault-learn, MOC)는 활발, "작업전 vault 읽기" 지시가 최소 4개 본부장 정의서에 명문화돼있음(모아오케스트레이터 Phase0, cto-seojin, cso-jiyoung, content-head, media-head) — 순수 write-only 아님. 단 런타임에서 실제 매번 지켜지는지는 로그로 검증 불가.

**산출물**: 인포그래픽 아티팩트 발행 https://claude.ai/code/artifact/9cb51242-0edd-4b63-912c-7312d49a09ce (파일: 스크래치패드 `moa-system-map.html`, 필요시 같은 URL로 재발행 가능)

**Why**: [[project_full_system_review_pending_2026-08-08]]가 "형이 먼저 안 물어봐도 클로가 상기시켜야 함" 항목이었는데, 이번에 옵시디언 질문을 계기로 상기시켜서 실행함.

**How to apply**: 정리후보 5건은 형 승인 대기 상태(아직 삭제 실행 안 함). 형이 승인하면: ①MoaServerReboot 작업+스크립트 삭제 ②atz-pipeline 잔재파일(nul, .bak 3종) 삭제 ③clo_studio .tmp_*+output 아카이브정책 수립 ④덱스제나 반복다운 근본원인 조사(cto나 덱스 자신에게) ⑤MoaAckBot 상태 확인. [[project_full_system_review_pending_2026-08-08]]는 이 리뷰로 완료됐으니 삭제 대상.

관련: [[project_full_system_review_pending_2026-08-08]] [[project_dex_jena_daemon_silent_death_2026-08-06]] [[project_nblog_linkbug_and_backlog_2026-08-12]]
