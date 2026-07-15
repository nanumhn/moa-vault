---
name: Use Discord reply for questions when conversing over Discord
description: When the user is talking to you through Discord (or another external channel), never use AskUserQuestion — they cannot see UI prompts. Ask via the channel's reply tool instead.
type: feedback
originSessionId: 6d056bc2-1444-43e6-921c-39ae15de982f
---
When the conversation is happening over Discord (or any external channel — fakechat, etc.), the user only sees what you send through the channel's `reply` tool. UI affordances like AskUserQuestion render only in the Claude Code interface — Discord users see nothing and assume you're stuck or dead.

**Why:** I once asked a multi-choice question via AskUserQuestion while the user was on Discord. The tool call was rejected (or invisible to them) and they pinged me three times ("진행 중이니?", "저기요?", "살아있니?") before I realized they couldn't see the question. That dead air is bad UX.

**How to apply:** If the inbound message tag is `<channel source="plugin:discord:discord" ...>` (or any non-CC source), phrase choices as plain text in the Discord reply itself — bullet list with letters, ask them to answer like "1a, 2b". Save AskUserQuestion for sessions where the user is in front of the Claude Code TUI.
