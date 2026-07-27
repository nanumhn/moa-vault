---
name: reference_moa_logs_and_ledgers
description: 모아가 남기는 로그·원장 전체 목록 — 질문에 답하기 전 여기부터 뒤진다 (형 지시 2026-07-27)
metadata: 
  node_type: memory
  type: reference
  originSessionId: 771e9b4c-1ade-4980-828c-f82c0b7d539a
  modified: 2026-07-27T10:46:57.697Z
---

**★형 지시 2026-07-27: "작업 내용을 로그에 남기고 있잖아. 로그를 항상 참고해서 기록이 있는지 확인하고 대답하면 좋지."**

같은 날 "쇼츠 발행 몇 시냐"는 질문에 **작업 스케줄러와 n8n만 보고 "쇼츠 없음"이라고 답했다.** 실제로는 `published-ledger.json`에 7/25·7/27 두 건이 `published`로 남아 있었다 — **없는 게 아니라 자동이 아니었을 뿐.** 원장을 봤으면 30초에 정확히 답했다. 형이 두 번 되물어야 했다.

## 답하기 전에 뒤질 곳 (질문 유형별)

| 질문이 이런 것이면 | 여기부터 본다 |
|---|---|
| "X 발행됐나 / 몇 건 나갔나" | `youtube-publish/published-ledger.json` · `atz-pipeline/out/state.json`(drafts·published) · `.moa/blogger_count.state.json` · `.moa/youtube_count.state.json` |
| "X 파이프라인이 돌았나 / 왜 안 나왔나" | `.moa/atz_pipeline.log` · `atz-pipeline/out/*_result.json`·`*_curation.json` · `k-saju-blog/tools/last-run.mjs` |
| "서버·세션·재부팅이 어떻게 됐나" | `.moa/session_reset.log` · `server_reboot.log` · `boot_notify.log` · `launch_when_online.log` · `recovery_timeline.log` · `mcp_guard.log` |
| "사이트 살아있나 / 색인·유입은" | `.moa/healthcheck.log`·`healthcheck.state.json` · `search_console.log`·`search_console.state.json` · `index_state.json` |
| "이거 전에 하기로 하지 않았나" | `moa-studio/_workspace/harness-pending.md`(변경 원장) · `moa-vault`(결정 이력) · 내 메모리 |
| "형이 뭐라고 했었나" | `mcp__plugin_discord_discord__fetch_messages` (디스코드 히스토리가 원본) |
| "이 코드 누가 부르나" | `grep -rn` 전수. import 목록만 보고 단정 금지 ([[feedback_find_counterexample_first]]) |

전체 목록: `.moa/`에 로그 17개 + 상태 원장 13개 (2026-07-27 기준).

## How to apply
**순서가 중요하다 — ①이 ②보다 싸고 빠르다.**
```
① 우리 기록부터 뒤진다      "이거 전에 한 적 있나?"
② 반례를 찾는다             "A인데 안 그런 경우가 있나?"
③ 그때 원인·현황을 말한다
```
2026-07-27의 두 오답(쇼츠 "없음", 목차 "한글이라서") 모두 ①에서 걸렸을 사안이다.

**로그가 없어서 못 찾았다면 그건 "없다"가 아니라 "기록이 없다"**로 보고한다 — 부재의 증거로 쓰지 마라([[feedback_verified_facts_only]]).

관련: [[feedback_find_counterexample_first]] [[reference_harness_change_ledger]] [[reference_moa_healthcheck]]
