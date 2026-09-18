---
name: reference_bridge_ignores_all_bot_messages_2026-09-18
description: "덱스·제나 브리지가 모든 봇 메시지를 verdict=ignore로 버린다 — 클로(봇 계정)는 공유채널에서 워커에게 말을 걸 수 없다. '중간 결재는 덱스 위임' 지시가 구조적으로 실행 불가"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 28ffe74f-d0f8-4fa6-97a6-f98d6b7fb9cd
  modified: 2026-09-17T22:11:16.519Z
---

**한 줄**: 클로가 공유 채널에 올리는 글은 **덱스·제나 CLI에 한 글자도 안 들어간다.** 브리지가 봇 계정 메시지를 조건 없이 버리기 때문이다. 카드를 올려놓고 "전달됐다"고 믿으면 안 된다.

## 실측 (2026-09-18 06:09)
06:00 발행 멈춤 재실행 결재(`REQ-20260918-ATZ-01`)를 그들만의업무(1534714627383099493)에 덱스 멘션까지 달아 올렸다. 디스코드에는 정상 게시됐다(메시지 `1550252299174289410`).
그런데 [확인: dex_jena_bridge_dex.out.log 직접 조회] 브리지 판정은:

```
[win] ch=1534714627383099493 dm=false gated=true verdict=ignore who=dex
```

**`verdict=ignore`** — 덱스에게 전달되지 않았다.

## 원인 (코드 직접 열람)
`dex-jena-bridge` 의 `src/routing.mjs` `classifyMessage()` 144~148행:

```js
if (isMe) return 'ignore';
if (isBot && isBotAcknowledgement(content)) return 'ignore';
if (isBot) return 'ignore';        // ← 조건 없이 모든 봇
if (!allowed) return 'ignore';
```

- 클로의 글은 **"달려라 클로" 봇 계정**(`1501853366622621876`)으로 나가므로 **항상 세 번째 줄에 걸린다.**
- `isTrustedBot` 파라미터가 선언돼 있고 `src/index.mjs` 561·724·1548행에서 `TRUSTED_BOT_IDS.has(...)` 로 **계산해 넘기는데, 함수 안에서 한 번도 참조하지 않는다.** `.env` 의 `TRUSTED_BOT_IDS` 설정도 **효력이 없다**(값은 열어보지 않음).
- 커밋 이력에 `c51fe3e fix(bridge): 서브에이전트 승인 교착과 봇 응답 반복 차단` 이 있다. **봇 루프를 막으려던 조치의 부작용일 가능성** — 다만 의도인지 사고인지는 **확인하지 못했다.**
- ★`src/routing.mjs` 는 작업트리 수정 상태(`git status` = `M`)다. 지금 도는 건 이 작업트리 코드다.

## 무엇이 깨져 있나
형 지시(2026-09-06) *"중간중간 결재건은 덱스에게 위임한다"* [[feedback_interim_approvals_delegated_to_dex_2026-09-06]] 가 **클로 쪽에서 원리적으로 실행 불가능하다.**
[확인: fetch_messages 조회] 그들만의업무 방이 **2026-09-10 이후 8일째 무대화**인 것도 이것과 맞물린다.

## How to apply
- 워커에게 뭘 올렸으면 **`dex_jena_bridge_dex.out.log` / `..._jena.out.log` 의 `verdict=` 줄로 전달 여부를 확인**할 것. 디스코드 전송 성공(`sent (id: ...)`)은 전달 보증이 아니다 → [[reference_runs_but_not_counted_pattern_2026-09-06]] 계열.
- `verdict=ignore` 면 **형께 직접 올리는 수밖에 없다.** "덱스에게 올렸습니다"라고 보고하면 거짓이 된다.
- 수리는 브리지 코드라 덱스 몫인데 **그 덱스에게 닿을 방법이 지금 없다** — 형이 직접 그 방에 한 줄 쓰시거나 CLI 창으로 전달해야 한다.

관련: [[reference_worker_mention_needs_allowedmentions_2026-09-06]] · [[reference_discord_bot_messages_never_reach_session_2026-08-25]](반대 방향: 봇 글이 클로 세션에 안 오는 것) · [[reference_bridge_reads_screen_only_no_scrollback_2026-08-26]]
