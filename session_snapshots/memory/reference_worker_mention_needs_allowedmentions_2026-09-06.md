---
name: reference_worker_mention_needs_allowedmentions_2026-09-06
description: 워커가 멘션에 무응답이면 받는 쪽이 아니라 보내는 쪽 allowedMentions부터 볼 것
metadata: 
  node_type: memory
  type: reference
  originSessionId: f159c831-266a-4595-ad22-534fd911ebd3
  modified: 2026-09-05T18:50:50.044Z
---

덱스가 제나를 `<@숫자ID>` 태그로 불러도 제나가 안 깨어나던 건(2026-09-06 03:15·03:29 두 건)의 구조.

**연쇄**: `mentions.mjs`의 `renderNamedMentions`가 `@제나` **이름 표기만** 수집 → 본문에 직접 찍힌 `<@id>`가 `allowedMentions.users`에서 빠짐 → Discord가 허용 목록 밖 태그엔 **멘션 플래그를 안 붙임** → 받는 쪽 `index.mjs`의 `mentionsMe()`가 `message.mentions`를 보므로 false → 봇 무한루프 가드에 걸려 `verdict=context`(로그에 그대로 찍힘).

**How to apply**: 워커가 멘션에 무응답이면 ①받는 쪽 라우팅을 뜯기 전에 **보내는 쪽이 그 id를 `allowedMentions`에 담았는지**부터 본다 ②판정 근거는 `dex_jena_bridge_<이름>.out.log`의 `verdict=` 줄(본문은 안 찍히지만 판정은 찍힌다) ③`isExplicitWorkerMention`은 본문 정규식이라 멘션 플래그와 무관하지만, 그 앞의 `mentionsMe()` 게이트에서 이미 걸린다 — 두 층을 헷갈리지 말 것.

수리 후 부작용 1개: 덱스→제나 호출이 위임 경로를 타서 본문 맨 위에 `[DEX-JENA:…]` 표식이 붙는다(`@제나`로 부를 때와 동일한 기존 형식).

**★"왜 어제까지 되던 게 안 되나"의 답 (2026-09-06 03:58 추가)** — 숫자 태그만으로 깨운 적은 **원래 없었다.** 예전 성공 사례(08-28 `1542780445576396841`)는 덱스가 **마지막 줄에 `<@형> <@제나>` 두 멘션을 나란히** 붙인 것이고, 그건 `delegation.mjs`의 위임 계약이라 **멘션 플래그와 무관한 별도 통로**로 통과한다(그 메시지엔 `[DEX-JENA:…]` 표식이 찍혀 있다). 실패한 09-06 두 건은 마지막 줄이 **형 멘션 하나뿐**이라 계약 밖이었다.
08-29 커밋 `558f61f`가 "멘션만으로도 부르기"(`isExplicitWorkerMention`) 통로를 더했지만, 그 앞의 `mentionsMe()` 게이트 때문에 **이름 표기에만 통했다** — 겉보기엔 계약이 필요 없어 보이는데 실제로는 반쪽이었다. [추측] 그래서 끝줄 생략이 굳어졌다. **반증**: 08-29 이후 끝줄 없이 숫자 태그만으로 제나가 깨어난 사례가 나오면 이 설명은 폐기.

**교훈**: "되던 게 안 된다"는 신고에서 **코드가 안 바뀌었으면 입력 형태가 바뀐 것**이다. 성공 사례와 실패 사례의 **원문을 나란히 놓고 diff** 하는 것이 가장 빠르다 — 이번에도 마지막 줄 하나 차이였다.

관련: [[project_jena_bridge_injection_blocked_2026-09-06]](주입 게이트는 이것과 **다른** 층) · [[reference_dex_jena_discord_ids_2026-09-02]]
