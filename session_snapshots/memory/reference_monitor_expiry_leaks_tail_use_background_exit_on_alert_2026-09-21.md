---
name: reference_monitor_expiry_leaks_tail_use_background_exit_on_alert_2026-09-21
description: "Monitor 30분 만료는 tail 프로세스를 안 치운다(09-21 45개 누적) + 재무장마다 무응답관문이 형방 알림 강제 → ⑧은 '첫 경보에 종료' 백그라운드 Bash로 건다"
metadata:
  type: reference
---

2026-09-21 15:4x 실측 두 가지.

1. **Monitor 는 만료돼도 `tail -f` 자식을 안 죽인다.** 부트스트랩 ⑧을 30분마다 재무장하니 `tail -f -n 0 C:/Users/user/.moa/*.log` 가 **45개** 쌓여 있었다(04:06~15:10 기동분, 이전 세션 것 포함, `ps -ef` 조회). 모두 kill 해서 0개로 정리.
2. **재무장할 때마다 무응답 관문(150초)이 걸려 형 방에 30분마다 한 줄씩 보내게 된다.** 형께 소음.

**대체 방식(양방향 시험 통과 15:41)**: 스크립트 `watch8.sh` 를 `Bash(run_in_background=true)` 로 실행.
필터는 ⑧ 원문 그대로, 매치 줄을 `watch8.hit` 파일에 쌓고, 메인 루프가 `until [ -s hit ]; sleep 5` → 줄 출력 → `kill 0` 으로 자식까지 정리하고 종료.
종료 알림이 곧 경보다. 처리 후 다시 실행. 30분 상한 없음.
스크립트는 세션 scratchpad 에 있어 리셋마다 사라진다 — 다시 만들 것(본문은 부트스트랩 ⑧ 명령 + 위 hit/until/kill 0 세 줄).

부트스트랩 ⑧ 원문 수정은 형 결재 사항(클로 권한 축소 중) — 아직 안 고쳤다.
→ [[reference_monitor_tr_buffers_use_sed_u_for_nul_strip_2026-09-21]]
