---
name: reference_harness_change_ledger
description: "하네스 변경은 \"넣기로 했다\"로 끝내지 말고 원장에 남겨 주간 리포트가 점검한다 — 결정이 추적 없이 잠드는 문제"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 771e9b4c-1ade-4980-828c-f82c0b7d539a
  modified: 2026-07-26T23:58:03.520Z
---

하네스(스킬·에이전트·cron·스크립트) 변경 결정은 **`D:\Develop\moa-studio\_workspace\harness-pending.md`** 에 기록한다. 즉시 반영하거나, 못 하면 "미반영(Open)"으로 남긴다. 주간 전략 리포트 cron이 매주 이 파일을 점검해 사업 아이템 착수 점검과 같은 루프에 태운다.

**Why:** 2026-07-26 GSC 복기에서 completion-gate에 넣기로 결정된 항목 2개가 미반영으로 잠들어 있다가, 2026-07-27 라벨 재분류에서 같은 유형의 사고(담당자가 "몇 건 더 있을 수 있다"고 자백 → 실제 22건)가 터지고 나서야 반영됐다. **결정은 있었고 실행이 없었다.**

이건 같은 날 주간 전략 리포트가 사업 아이템에 대해 진단한 것과 정확히 같은 구조다 — *"리뷰가 실행을 구속하지 못했다"*(W30 최우선을 k-saju로 못박았는데 자원은 100% 아투로 감). 리포트는 사업에서 이 패턴을 잡아내면서 **하네스 자체가 같은 병에 걸린 건 못 봤다.** 지적한 건 검수관(qa-lead-jian).

**How to apply:** 스킬·에이전트·cron을 고치기로 판단한 순간 원장에 한 줄. 반영하면 Closed로 옮기고 위치(파일·절 번호)를 적는다. 2주 연속 미반영이면 항목이 아니라 반영 구조를 고친다. 관련: [[feedback_verified_facts_only]] [[reference_moa_healthcheck]]
