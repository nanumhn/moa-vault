---
name: reference_discord_bot_messages_never_reach_session_2026-08-25
description: 덱스·제나·웹훅 등 봇이 쓴 디스코드 글은 허용목록·멘션 검사 전에 버려져 클로 세션에 절대 도달하지 않는다
metadata: 
  node_type: memory
  type: reference
  originSessionId: 9ddbd072-62d3-4765-8383-8eab34251e4d
  modified: 2026-08-25T00:29:27.864Z
---

`server.ts` 887행 (`.claude/plugins/cache/claude-plugins-official/discord/0.0.4/`):

```
client.on('messageCreate', msg => {
  if (msg.author.bot) return          // ← gate() 호출 전이다
  handleInbound(msg)...
})
```

**`gate()`(허용목록·mentionPatterns 검사)는 892행이다.** 즉 봇 메시지는 그 앞에서 잘린다.

## 그래서 참인 것

- **덱스·제나가 나를 멘션해도 실시간으로 안 온다.** `@everyone`도, `access.json`의 `allowFrom`에 봇 id를 넣어도 소용없다 — 검사 자체에 도달을 못 한다.
- **웹훅 알림도 봇이라 나를 못 깨운다.** 외부 워치독(`moa_*_watchdog_external.ps1`)은 **형께 알리는 것까지만** 할 수 있다. "워치독을 걸면 형 손이 안 간다"는 말은 틀렸다 — 내가 2026-08-25에 형께 그렇게 말했다가 정정했다.
- **형(사람) 메시지만 실시간으로 들어온다.** 그래서 형이 매 턴 중계하시게 된다.

## 내가 실제로 저지른 실수

2026-08-24 "덱스가 무응답이다"라고 형께 보고 → 덱스는 계속 답하고 있었다. **그 방은 `fetch_messages`로 직접 긁어야만 보이는데 안 긁었다.**

## 대응

- 덱스·제나가 있는 방은 **답하기 전에 반드시 `fetch_messages`로 긁는다.** 안 긁고 "무응답"이라고 말하지 말 것.
- 감시 자동화는 `MoaCommandChannelWatchdogExternal`(업무보고방 1531912848433741825, 3분) / `MoaWorkChannelWatchdogExternal`(그들만의업무 1534714627383099493, 7분). 둘 다 형께 알림만 보낸다.

관련: [[reference_dex_jena_channel_no_live_push]] [[feedback_pinocchio_clo_dont_assert_without_checking]] [[reference_ps51_cp949_breaks_korean_files_2026-08-24]]
