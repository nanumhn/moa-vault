---
name: reference_silence_gate_threshold_is_150s_2026-09-17
description: "무응답 관문의 실제 기준은 30분이 아니라 150초 — 도구를 쓸 때마다 검사한다"
metadata:
  node_type: memory
  type: reference
---

무응답 관문(`.claude/hooks/guard-silence-and-delegation.mjs`)의 기준은 **150초**다. 15행 `const SILENCE_LIMIT_MS = 150 * 1000;` (2026-09-17 02:0x 코드 직접 열람).

- 기준점(anchor) = `lastReplyAt ?? timestampOf(turn[0])` — **이번 턴의 마지막 디스코드 회신**, 없으면 턴 시작 시각 (240~250행).
- `settings.json`의 `PostToolUse`는 **matcher 없이 전 도구**에 걸려 있다. 즉 **도구를 쓸 때마다** 검사한다. PreToolUse에도 Edit/Write/Bash/PowerShell에 같은 훅이 걸려 있다.
- 따라서 실제 규칙은 "N분마다 보고 강제"가 아니라 **"마지막 보고 후 150초를 넘겨서 무엇이든 하면 물린다"** 이다.

**★왜 적어두나 — 두 세션이 연달아 "30분마다"로 잘못 읽었다.** [[project_open_threads_2026-09-16_afternoon_snapshot]]에 "Monitor 30분 상한 × 무응답 관문"으로 적혀 있고, 09-16 오후 세션도 형께 올린 결재 카드(REQ-20260916-MON-01) 본문에 "30분마다 물린다"고 써서 형께 정정 회신을 보내야 했다. 30분으로 보이는 이유는 **관문이 30분이라서가 아니라, 대기 중일 때 클로의 유일한 활동이 30분짜리 Monitor 재무장이기 때문**이다. 실측: 대기만 할 땐 1800초대로 걸렸지만, 09-17 00~01시 포럼 504를 조사할 땐 **238초·941초** 만에도 걸렸다.

**How to apply:** 조사·점검처럼 도구를 연달아 쓰는 작업에 들어가기 전에는 **형 방에 글이 2.5분 간격으로 쌓일 것**을 전제하고 시작한다. 재무장 간격으로 부담을 추산하지 말 것. 관문을 우회하려 들지 말고([[feedback_no_self_declared_exceptions]]) 요구대로 한 줄 보고하되, 그 한 줄을 **직전에 형께 약속해 둔 후속 회신으로 갈음**하면 같은 글이 반복되지 않는다.
