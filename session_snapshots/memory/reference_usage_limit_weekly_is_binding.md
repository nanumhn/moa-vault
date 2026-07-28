---
name: reference_usage_limit_weekly_is_binding
description: "한도는 5시간 세션이 아니라 \"주간\"이 먼저 찬다 — 2026-07-28 /usage 실측. Fable은 별도 주머니"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 3f4a39c7-2b9b-4c6b-a7b0-ca4baa51399e
  modified: 2026-07-28T07:21:13.520Z
---

**막히는 것은 5시간 세션 한도가 아니라 주간 한도다.** 세션을 리셋해도 주간은 안 돌아온다.

## 실측 [확인 — 2026-07-28 16:17 KST, 형이 보낸 `/usage` 화면]
```
Current session        2% used    resets 21:09 (Asia/Seoul)
Current week (all)    85% used    resets Jul 29 23:59   ← 이게 걸린 것
Current week (Fable)   0% used    ← 통째로 비어 있는 별도 주머니
세션 비용 $2.17 / cache read 2.0m / output 13.1k
"+50% weekly limits promo through Aug 19 · clau.de/cc-50-promo"
```

2026-07-28 14:00 세션 리셋 직후 새 세션이 떴는데도 형 메시지에 3시간 동안 응답을 못 한 원인이 이것이다. "시동 ON"만 4번 나가고 대화는 못 했다. **세션이 살아있는 것과 응답할 수 있는 것은 다르다.**

## 그래서 바뀐 것
1. **워치독 5분 → 20분(07~22시) / 60분(23~06시)** — 형 메시지가 없어도 매 발화마다 컨텍스트 전체를 다시 읽는다. 자세한 비용 구조는 [[reference_session_cost_structure]]
2. **무거운 작업은 `Agent(model: 'fable')` 로** — Fable 주간 한도가 별도로 잡힌다(화면상 별도 막대). 원고 집필·일지 작성처럼 길고 무거운 것이 대상
3. 한도가 빠듯할 때 안 하는 것: 리서치·회의·전수 스캔

## 형에게 물어볼 것
- `/usage` 는 형이 터미널에 직접 쳐야 한다(에이전트 호출 불가). **80% 경고를 원하면 화면을 주기적으로 받아야 한다**
- 프로모(+50%, 8/19까지) 적용 여부 — 형 확인 필요

관련: [[reference_session_cost_structure]] [[project_daily_reset_and_watchdog_2026-07-27]]
