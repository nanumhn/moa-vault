---
name: project_atz_am_shorts_stopped_by_hyung_2026-09-23
description: 형 지시로 아투 오전(am) 유튜브 쇼츠 발행 중단 — MoaAtzShorts 06:30 트리거만 끔, pm 20:00은 유지
metadata:
  type: project
---

2026-09-23 13:36 형 지시: *"아투 오전 유튜브 쇼츠는 발행 중단해."*

- 조치: 예약작업 `MoaAtzShorts` 첫 트리거(06:30) `Enabled=false`. 20:00(pm) 트리거는 그대로. 백업 `C:\Users\user\.moa\MoaAtzShorts.task.bak-20260923.xml`.
- 보류큐 cron(⑤-B)·`session_bootstrap.md` 에서 am 쇼츠 단계 제거/주석. REQ-20260923-ATZ-01 에서도 am 쇼츠 단계 삭제(블로그 공개만).
- 아투 am **블로그** 발행(`MoaAtzPublish` 06:00)은 지시 범위 밖 — 그대로 둠.
- 되돌리기: 트리거[0].Enabled=true 로 Set-ScheduledTask 또는 백업 XML 재등록.

**Why:** 형 직접 지시(이유는 안 말씀하심 — 모릅니다).
**How to apply:** 형이 재개 지시 전엔 am 쇼츠를 어떤 경로로도(start_shorts_task -Slot am 포함) 돌리지 말 것. 헬스체크 MoaAtzShorts maxAgeHours 26 은 pm 하루 1회로도 충족.
