---
name: feedback_reset_should_signal_and_wait
description: "세션 리셋/재부팅은 독립적 cron 타이밍 경주가 아니라 '저장작업 신호→완료확인→그때 종료' 순서로 강제해야 함(형 제안 2026-08-05)"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 05eeca17-d953-4fd5-9b1a-332286749eca
  modified: 2026-08-05T01:23:42.089Z
---

[[project_journal_gap_2026-08-05]]에서 발견한 "일지·세션저장 cron이 세션 리셋보다 늦게 도착해 구조적으로 못 도는" 문제에 대해, 형이 제안한 근본 해법(2026-08-05).

**형 제안**: 14:00에 리셋 시작을 "알리고", 저장·일지 등 일련의 마무리 작업이 **다 끝난 뒤에** 종료 명령을 실행한다. 04:00 재부팅도 동일 — 마무리 작업 완료 후에 재부팅 명령.

**Why**: 지금 구조는 "13:48에 저장 cron 돌아라"와 "14:00에 세션 죽어라"가 서로 독립적으로 예약돼 경주하는 구조라, cron 실행이 조금만 밀려도(실측 ~30분) 세션이 먼저 죽어버려 저장이 통째로 스킵된다. 시각을 앞당기는 건 경주에서 이기려는 임시방편일 뿐 경주 자체를 없애지 못한다.

**How to apply**: 외부 재시작 스크립트(`C:\Users\user\.moa\moa_session_reset.ps1`)가 실행 중인 세션에 "저장해" 신호를 주고, 완료 flag(`session_saved.flag` 같은 것)가 찍히길 기다렸다가 그 다음에 `claude.exe` 종료·재부팅 명령을 실행하는 구조로 바꿔야 한다. 단순 cron 시각 조정보다 손이 더 가는 작업 — cto-seojin에게 위임. 시각 조정(30~40분 앞당기기)은 이 제대로 된 구조가 완성되기 전까지의 임시방편으로만 쓸 것.

관련: [[project_journal_gap_2026-08-05]] [[project_daily_reset_and_watchdog_2026-07-27]]
