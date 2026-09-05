---
name: feedback_always_report_time_in_kst_2026-09-05
description: "형 지시(09-05): 클로는 시각을 항상 UTC+9(KST)로 맞춰서 말한다 — 디스코드 메시지 timestamp는 UTC라 그대로 쓰면 형과 9시간 어긋난다"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: c5083fed-eb95-4ee7-8f68-92e7fa919d3e
  modified: 2026-09-05T04:53:28.890Z
---

[엔블 005-05] 세션에서 제나의 테스트 진행시간을 보고하다가, 클로는 디스코드 메시지의 `ts`(UTC)를 그대로
"04:21" 식으로 말했고 형은 같은 시각을 "13:19"(KST)로 인지하고 있었다 — 9시간 어긋남. 형이 그 자리에서
지적: **"클로는 utc+9 시간 메모리에 설정해."**

## How to apply

- 디스코드 메시지의 `ts` 필드(예: `2026-09-05T04:21:31.116Z`)는 **UTC**다. 형·덱스·제나에게 시각을 보고할
  때는 **항상 +9시간 해서 KST로 변환**해서 말한다("04:21" 아니라 "13:21 KST").
- 이미 다른 사람(덱스·제나)의 메시지 안에 KST로 적힌 시각이 있으면 그걸 그대로 쓰면 된다 — 변환은
  클로 자신이 원본 `ts`에서 직접 계산해 말할 때만 필요하다.
- `date`/`Date.now()` 등 로컬 시스템 시각을 조회할 때도 이미 알려진 함정이 있다
  ([[reference_bash_date_clock_offset_2026-08-16]] — Bash `date`가 9시간 오프셋 버그가 있어 PowerShell
  `Get-Date`를 쓰라는 지침) — 이것과 별개로, **디스코드 ts 자체는 버그가 아니라 정의상 UTC**이므로
  혼동하지 말 것.

관련: [[reference_bash_date_clock_offset_2026-08-16]]
