---
name: reference_discord_bot_messages_never_reach_session_2026-08-25
description: 덱스·제나·웹훅 등 봇이 쓴 디스코드 글은 허용목록·멘션 검사 전에 버려져 클로 세션에 절대 도달하지 않는다 — 해결은 워치독 로그를 Monitor로 지켜보는 것(부트스트랩 ⑧)
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


## ★해결 (2026-08-25 16:19) — 로그를 경유해 나를 깨운다

봇 글이 못 들어오는 건 못 고친다(플러그인 소스). **대신 외부 워치독이 남기는 로그 줄을 세션 안에서 `tail -f` 로 지켜본다.** 워치독이 "미응답"으로 판정하면 로그에 `ALERT` 를 쓰고, 그 줄이 `Monitor` 이벤트로 나를 깨운다.

- 감시 대상 로그 **2개뿐**: `workchannel_watchdog_external.log`(**그들만의대화·그들만의업무·이슈처리-2026 포럼 셋이 다 여기 쓴다** — 라벨만 다름) · `atz_report_watchdog_external.log`. 둘 다 마커는 `ALERT`(ASCII라 한글 인코딩 사고와 무관).
- 평소 토큰 0 — 폴링은 세션 밖에서 돌고, `ALERT`일 때만 한 줄 들어온다. 2026-08-05에 형이 끈 5분 세션 워치독은 **아무 일 없어도 매번** 깨웠던 것이라 다르다.
- **세션 리셋(하루 2번)에 사라진다.** `session_bootstrap.md` **⑧번**에 재무장 절차와 명령 전문을 박아뒀다. `CronList`에 안 나오니 cron 점검만으로는 빠진 걸 못 본다.
- **걸었으면 양방향으로 시험할 것** — 로그에 `| [자체시험] ALERT ...` 를 넣어 울리는지, `| [자체시험] OK ...` 를 넣어 안 울리는지. 안 울리는 감시는 "이상 없음"과 구별이 안 된다.

## 이걸 안 만들어서 난 사고 (2026-08-25)

덱스가 **10:31:23에 브리지 재시작을 승인**했는데 나는 **16:16 형이 "지금 뭐 하고 있냐"고 물을 때까지 5시간 45분** 몰랐다. 그동안 브리지는 낡은 `855bdc1`로 돌아 빈 답 증상이 계속 났다. **10:29에 내가 직접 "이 감시를 만들겠다"고 형께 약속해놓고** 다른 일에 밀렸고, 14:00 리셋으로 세션이 바뀌며 통째로 증발했다. → 약속한 자동화는 **그 턴에 만들거나, 절차서에 박거나** 둘 중 하나를 즉시 해야 한다.

관련: [[reference_dex_jena_channel_no_live_push]] [[feedback_pinocchio_clo_dont_assert_without_checking]] [[reference_ps51_cp949_breaks_korean_files_2026-08-24]] [[reference_dex_jena_bridge_silent_loss_2026-08-24]]
