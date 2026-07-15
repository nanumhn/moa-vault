---
name: Discord 보고 간격 규칙 (3-tier)
description: When working on Discord-channel tasks, report at three triggers — per milestone, every 5 minutes if a single step runs long, and immediately on any issue
type: feedback
originSessionId: 8c0330e2-674a-4bf5-b00a-4c79a2540161
---
When executing tasks initiated from the Discord channel, follow this 3-tier reporting cadence (decided 2026-05-11):

1. **마일스톤별 보고** — Every time a discrete step / phase completes, send a short Discord update. Don't bundle multiple milestones into one wrap-up at the end.
2. **10분 무음 컷** — If a single step is running longer than ~10 minutes (large download, long LLM job, slow build), send an interim status reply BEFORE the 10-minute mark. Never let the channel stay silent for 10+ minutes during active work. (Adjusted from 5min → 10min on 2026-05-15 per user feedback — 5min interim was too noisy for genuinely long stages.)
3. **이슈 즉시 보고** — The moment an error, empty result, unexpected output, or blocker appears, **send a Discord message FIRST** announcing the issue (one line). Then debug. Do NOT silently debug — transcript text doesn't reach the user; from their POV, silence = stuck.
4. **진행 과정 실시간 중계** (2026-05-29 강화) — Even short multi-step work (1-2분짜리 조사, 에이전트 실행, 파일 여러 개 생성, 긴 설계 답변 작성)에서도 침묵하지 말 것. 작업 시작할 때 "지금 X 하는 중", 끝나면 "X 됨, 다음 Y" 식으로 한 줄씩 중계. 10분 무음컷(#2)은 진짜 단일 장기작업용이고, 그 외엔 더 촘촘하게. User quote: "회신이 바로바로 오면 좋겠어. 진행과정이 안 보여서 궁금하네." (Explore 에이전트 1-2분 + 메모리 저장 여러 개 + 긴 설계 답변을 쓰는 동안 침묵해서 답답해함.)

**Why:** User cannot see tool calls or stdout. Silence indistinguishable from being stuck/crashed. User explicitly asked for this on 2026-05-11 after a 10-min silent debug session where an LLM was returning empty strings and user had to ping to ask status. Quote: "단계별, 길면 5분마다, 이슈 발생시 이러면 어때?" — and reinforced 2026-05-29: even 1-2 min silences during research/design feel too long; user wants near-continuous play-by-play.

**How to apply:**
- After every major task step: 1-3 line Discord reply summarizing what just finished and what's next.
- Long-running steps (>3min estimated): kick off, then send an interim "still working on X, ~N% done" within 3-4 minutes.
- Errors/issues: drop everything, send a one-line `⚠️ 이슈: [요약]. 원인 찾는 중` reply, THEN debug.
- This rule reinforces and extends `feedback_acknowledge_first.md` — that one covers the initial ack, this one covers the work in between.
