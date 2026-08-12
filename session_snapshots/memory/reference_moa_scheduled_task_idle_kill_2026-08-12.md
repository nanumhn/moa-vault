---
name: reference_moa_scheduled_task_idle_kill_2026-08-12
description: Windows 작업스케줄러 StopOnIdleEnd=True가 덱스제나 반복다운의 진짜 원인이었음(크래시 아님) — 같은 설정이 Moa 작업 18개 전부 기본값
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4166856e-c7da-40b3-8c0d-8064c43df842
  modified: 2026-08-12T03:30:52.225Z
---

**증상**: 덱스(MoaDexBridge)·제나(MoaJenaBridge)가 하루에도 여러 번(23:46, 00:34, 09:55 등 불규칙) 동시에 죽고 MoaDexJenaGuard가 10분마다 자동복구하는 게 며칠째 반복(2026-08-06부터 "원인미확정"으로 남아있던 이슈, [[project_dex_jena_daemon_silent_death_2026-08-06]]).

**진짜 원인**: 코드버그도 재부팅도 아니었음. 두 작업 모두 Task Scheduler `IdleSettings.StopOnIdleEnd=True`(기본값, IdleDuration=10분)가 걸려있어서, **PC가 10분+ 유휴상태였다가 다시 활동이 감지되는 순간** Task Scheduler가 실행 중인 작업 인스턴스를 강제종료함. 이벤트로그(`Microsoft-Windows-TaskScheduler/Operational`)에서 두 작업의 종료 return code가 매번 정확히 `3221225786`(=0xC000013A, STATUS_CONTROL_C_EXIT)으로 동일했던 게 결정적 단서 — 재부팅(04:00, return code 2147942404로 다름)과는 별개 현상이었음. 다운 시각이 불규칙했던 이유도 이걸로 설명됨(고정스케줄이 아니라 "유휴가 끝나는 순간"이라 매번 달랐음).

**조치(완료, 2026-08-12)**: `Set-ScheduledTask`로 MoaDexBridge·MoaJenaBridge 둘 다 `StopOnIdleEnd=False`로 변경 완료.

**완료(2026-08-12, 형 승인)**: 같은 `StopOnIdleEnd=True`가 Moa 작업 스케줄러 작업 **18개 전부**에 기본값으로 걸려있던 것 확인 → 형 승인받아 전부 `False`로 일괄수정 완료(전체 18개 확인됨). 과거 아투의 "알수없는 이유" 발행실패 중 일부가 이게 원인이었을 가능성 있으나 소급 확인은 안 함.

**Why**: 24/7 무인 자동화 시스템인데 "사람이 PC를 만지는 순간"이 트리거가 되는 설정은 설계 의도와 정면으로 배치됨 — 이 하네스의 모든 백그라운드 작업은 애초에 StopOnIdleEnd=False여야 했음(작업 생성 시 기본값을 안 끄고 넘어간 게 누적된 결과로 추정).

**How to apply**: 앞으로 새 Moa 작업스케줄러 작업 만들 때마다 `StopOnIdleEnd=$false`를 기본으로 설정할 것. 나머지 18개 일괄수정 승인 나면 같은 패턴(`Get-ScheduledTask -TaskName X; $s.IdleSettings.StopOnIdleEnd=$false; Set-ScheduledTask`)으로 처리.

관련: [[project_dex_jena_daemon_silent_death_2026-08-06]] [[project_system_wide_review_2026-08-12]]
