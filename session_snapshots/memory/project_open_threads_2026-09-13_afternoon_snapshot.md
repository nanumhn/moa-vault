---
name: project_open_threads_2026-09-13_afternoon_snapshot
description: 09-13 14:2x 스냅샷 — 관리자3888 락 재발·아투am 결번(ComfyUI 멈춤 2번째)·인스타 09-12~13 결번, 결재 3건 형 무응답
metadata:
  type: project
---

09-13 오전 세션(04:28 재부팅~14:00 리셋) 끝 기준. 상세: 랩실 `70 Record/2026/09/2026-09-13.md` (커밋 42af3c9).

**형 결재 대기(오전 내내 무응답 — 클로는 상태 변경 0건)**
- REQ-20260913-MGR001-02 — manager.lock(옛 PID 2136) 삭제 + MoaManager 재실행. 3888 무응답, 워치독 로그 04:20/04:27 이후 정지, 다리 node 안 보임. [[reference_moa_manager_stale_lock_pid_reuse_2026-09-11]]
- REQ-20260913-ATZ001-02 — 아투 am 재실행(+쇼츠 1회). 06:00 발행이 ComfyUI 발행 중 기동 후 멈춤→07:00 강제종료(267014). 2번째 사례. [[project_atz_publish_hang_when_comfyui_started_inside_run_2026-09-11]]
- REQ-20260913-IG001-01 — ksajuCarouselV5 수동 재실행. 09-12·09-13 "자식 컨테이너 4개" 게시중단, 원인 미확인. [[reference_ksaju_ig_daily_two_failed_execs_2026-09-10]]
- (ATZ001-01 ComfyUI 사전기동은 무의미해짐)

**다음 세션 할 일**
- 결재 답 확인 → 승인분만 실행. 관리자 안 떠 있으면 배경감시 `[감시고장]`이 15분마다 울린다(정상 반응).
- 19:30 아투 pm 전 8188 확인(06:03 이후 떠 있었음 — 그대로인지 재조회).
- 오보 정정 기록: 04:17 스냅샷 "인스타 09-12 배달"은 틀림(IG UTC 오독).
- Discord 웹훅 주소가 세션 transcript에 출력됨(n8n 워크플로 export) — 형께 재발급 판단 알릴지 검토.
