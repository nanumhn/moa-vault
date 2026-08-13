---
name: reference_atz_gate_quote_falsepositive_3rd_recur_2026-08-13
description: "아투 인용 축자대조 게이트가 정상인용을 3번째 오탐(한자병기/조사어미/소제목축약경로부재). cto수리+회귀테스트 진행중"
metadata:
  type: reference
  originSessionId: b8dfa7f0-1191-4e2e-b45b-98b7bc1b7173
  modified: 2026-08-13T13:04:11.646Z
---

2026-08-13 보류큐 소비 cron에서 "호르무즈 해협" 기사가 인용 근거 대조 실패로 보류 → qa-lead-jian이 sources.txt와 직접 대조해 **전부 오탐**으로 판정(진짜 왜곡·창작 없음).

**오탐 원인 3가지(qa-gate.mjs)**:
1. 한자병기 정규화 누락 — '한자혼입0' 규칙 때문에 본문은 한자를 뺄 수밖에 없는데, 인용대조 normQ는 원문의 `대(對)이란` 괄호를 못 지워서 `대이란`과 영원히 불일치. 두 규칙이 서로 모순.
2. isAbbrevOf 어절비교가 완전일치라 조사·어미 차이("미국은"vs"미국이")에서 깨짐.
3. 소제목 축약 완화가 "본문에 축자인용 존재"를 전제하는데, 본문이 서술문으로 처리하면(따옴표 없이) 완화경로 자체가 없음.

**Why 기록**: 파일 주석에 08-01·08-09 오탐 이력 이미 있음 — **같은 자리 3번째 재발**. 원리(qa-gate.mjs가 인용 축자대조로 환각을 막는 구조)는 [[reference_atz_gate_blindspot_plain_claims]]와 같은 파일이지만 이번은 다른 서브버그.
**How to apply**: cto-seojin에게 수리 지시함(정규화 추가+dropJosa+소제목전용 원문대조경로, 부정어NEGATION가드는 절대 건드리지 말 것 — 진짜 오보 차단의 핵심). 회귀테스트는 기존 gate-korean-anchor-20260804/gate-misquote-20260806/gate-translated-quote-20260803 패턴 따라 gate-*-20260813 신설 지시. **완화가 진짜 오보를 놓치는 구멍이 되면 안 됨 — 기존 회귀테스트 전체 통과가 필수 조건.** 수리 확인되면 `bun run.mjs --from=out/2026-08-13T10-30-08_pm_payload.json`로 재발행 예정. 다음에 인용대조 오탐 또 보이면 이 파일의 정규화 규칙이 또 빠진 케이스인지부터 의심할 것.

**★완료(2026-08-13)**: cto 수리 완료(commit 7980264, push됨) — 회귀테스트 42개 전체통과+돌연변이시험 KILLED13/SURVIVED0(부정어가드 검증누락도 잡아서 픽스처 재설계). `bun run.mjs --from=` 실제 재발행 성공 → https://www.american-todayz.com/2026/08/blog-post_41.html LIVE, 인용6건 전부 게이트 통과. held파일 done/으로 이동완료. **다음 추천(cto 제안)**: 오탐 3번째 재발이라, 보류뜨면 held json+sources를 그대로 회귀픽스처로 굳히는 절차를 vault Skills에 고정할 것.

관련: [[reference_atz_gate_blindspot_plain_claims]] [[project_atz_hallucination_fix_2026-07-27]]
