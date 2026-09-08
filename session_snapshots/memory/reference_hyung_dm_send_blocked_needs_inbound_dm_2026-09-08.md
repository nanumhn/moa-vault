---
name: reference_hyung_dm_send_blocked_needs_inbound_dm_2026-09-08
description: "형 대화방(DM)으로 회신이 \"not allowlisted\"로 막히는 미제 증상의 원인 — 형이 그 DM방에 한 줄 보내면 즉시 복구된다"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 91c4952c-d451-4df0-b4d0-b59e85343053
  modified: 2026-09-08T05:35:30.469Z
---

형 대화방 `1501858476362829834`은 **길드 채널이 아니라 DM**이다. 그래서 `access.json`의 `groups` 목록에 **원래 없고, 넣을 필요도 없다.** DM은 `allowFrom`(형 user id `348731432086274049`)으로 판정한다.

**막히는 조건** (2026-09-08 14:26 재현, `server.ts` 0.0.4 코드 직접 열람)

```
409~419행  fetchAllowedChannel()
  DM이면 → userId = ch.recipientId ?? dmChannelUsers.get(id)
           그 userId가 allowFrom에 있어야 통과
225행      dmChannelUsers = new Map()      ← 프로세스 메모리. 세션마다 빈 상태로 시작
931행      dmChannelUsers.set(...)          ← 형이 그 DM방에 글을 보낼 때만 채워진다
```

즉 **형이 이번 세션에 DM방으로 말을 건 적이 없으면 ②가 비고, ①(채널 캐시의 recipientId)만으로 버틴다.** ①이 끊기는 순간 **송신·수신(fetch_messages) 둘 다** 막힌다. 둘 다 같은 게이트를 탄다.

**★해제 방법 — 형이 그 DM방에 아무 글이나 한 줄 보내면 즉시 복구된다.** `/discord:access`로 뭘 추가할 필요 없다. `access.json`은 건드리지 않는다(플러그인 규칙상 금지).

**내가 할 수 있는 게 없다.** `fetch_messages`도 같은 게이트라 캐시를 되살리지 못한다. 폴백은 ①로그채널 웹훅(`moa_webhook_send.ps1`, 로그채널 `1517010882570485871`) ②`PushNotification`(형 CLI·휴대폰) 둘뿐이다. **DM엔 웹훅을 만들 수 없다**(디스코드 제약).

**실측 경위 (2026-09-08)** — 14:15·14:19 발송 성공 → 14:26부터 4회 연속 거부. 그날 형 메시지는 전부 005-07 스레드(`1546361310671929374`)에서 왔고 **DM방엔 한 줄도 없었다.** `access.json`은 08-31 16:52 이후 안 바뀜(내가 안 건드림).

[[project_open_threads_2026-09-08_afternoon_snapshot]]에 "형대화방 송신차단·원인미확인"으로 남아 있던 미제가 이것이다. [[reference_discord_mid_session_deallowlist_2026-08-01]]의 "세션 도중 de-allowlist"도 같은 자리로 보인다(추측 — 그때 로그를 재확인한 것은 아니다).
