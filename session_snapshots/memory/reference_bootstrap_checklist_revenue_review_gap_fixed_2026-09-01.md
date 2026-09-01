---
name: bootstrap-checklist-revenue-review-gap-fixed
description: session_bootstrap.md의 세션시작 cron 재등록 체크리스트에 revenue-review가 빠져 있던 것을 2026-09-01에 발견·수리함
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4a35f1c2-2a25-44db-ba41-5ab6c27ca634
  modified: 2026-09-01T05:36:05.584Z
---

CLAUDE.md는 세션 시작 시 재등록할 세션cron을 ①③④⑤ 4개로 부르고 ⑤=주간 수익 리뷰(`revenue-review`, 매주 월 10:00)라고 명시한다. 하지만 실제 실행 파일 `C:\Users\user\.moa\session_bootstrap.md`의 번호는 CLAUDE.md와 다르게 매겨져 있었고, 그 파일의 ⑤번은 "아투 보류큐 소비"였다 — revenue-review는 그 체크리스트 어디에도 없었다.

2026-09-01 세션 시작 시 CronList가 비어 있어(리셋 직후) 처음부터 재등록하다가 이 불일치를 발견. CLAUDE.md 자체가 "revenue-review가 2026-06-27~2026-08-12 7주간 미발화됐던 사고"([[project_revenue_review_lapsed_2026-08-12]])를 이 항목 옆에 적어 강하게 경고하고 있었는데도, 실제 부트스트랩 체크리스트엔 반영이 안 돼 있었다.

**Why:** 문서 두 개(CLAUDE.md ↔ session_bootstrap.md)가 같은 목록을 다른 번호·다른 내용으로 유지하고 있어서, 번호만 보고 "다 등록했다"고 착각하기 쉬운 구조였다. 실제로 세션이 바뀔 때마다 이 파일 하나만 보고 재등록하면 revenue-review가 계속 빠질 수 있었다.

**How to apply:** session_bootstrap.md에 ⑤-A(주간 수익 리뷰)를 신설해 CronCreate 전문까지 박아뒀다(2026-09-01). 앞으로 세션 시작 시 이 파일의 ⑤-A/⑤-B를 그대로 따라가면 되지만, **혹시 이 파일이 다시 예전 버전으로 되돌아가 있거나 새로 고칠 일이 생기면, CronList 재등록 전에 반드시 CLAUDE.md의 세션cron 번호(①~⑤)와 session_bootstrap.md의 실제 항목을 서로 대조**할 것 — 번호가 같다고 내용이 같다고 가정하지 말 것.
