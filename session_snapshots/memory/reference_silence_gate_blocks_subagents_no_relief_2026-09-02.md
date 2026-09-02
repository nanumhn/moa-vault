---
name: silence-gate-blocks-subagents-no-relief
description: "무응답 관문은 서브에이전트에도 걸리는데, 해소 수단(디스코드 reply 도구)은 메인 세션에만 있다 — haru 실측 2026-09-02"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4a35f1c2-2a25-44db-ba41-5ab6c27ca634
  modified: 2026-09-01T19:27:22.454Z
---

`.claude/hooks/guard-silence-and-delegation.mjs`의 `checkSilence()`는 트랜스크립트에서 `mcp__plugin_discord_discord__reply` 호출 시각을 기준으로 무응답 시간을 잰다(haru가 코드 직접 조회, 227~242행 부근). 서브에이전트(archive-head-haru 등)는 이 도구 자체가 없어서(`No such tool available` 실측), 관문에 걸리면 **자기 힘으로는 절대 못 푼다** — 메인 세션(클로)이 디스코드에 한 줄 올려줘야 타이머가 갱신된다.

**Why:** 08-30 새벽에도 같은 증상이 한 번 확인된 적 있지만(서브에이전트 Write·Edit·Bash 통째 차단), 이번엔 haru가 원인을 코드까지 짚어 확정했다 — 위임 관문(대상 경로가 자기 프로젝트 안이면 통과)과는 별개로, 무응답 관문 하나만으로도 서브에이전트 장시간 작업이 **형 손 없이는 끝까지 못 간다.**

**How to apply:** 서브에이전트를 오래 걸리는 작업(일지 작성 등)에 위임했는데 완료 알림이 안 오고 "무응답 관문에 막혔다"는 메시지가 오면, 놀라지 말고 즉시 형 대화방(1501858476362829834)에 진행상황 한 줄을 reply로 올린 뒤 그 서브에이전트에게 SendMessage로 "이어서 진행해"라고 재개시킨다. 이 패턴이 반복되면 관문 자체(서브에이전트 예외 처리)를 harness-pending.md에 원장으로 올려 형 결재를 받는 근본 수정을 고려할 것.

관련: [[dont-coach-magic-phrase-past-guard]], [[reference_delegation_gate_bash_script_workaround_2026-09-01]]
