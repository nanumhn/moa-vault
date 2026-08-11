---
name: reference_atz_shorts_approval_channel
description: "아투 쇼츠·블로그 승인 카드는 형 DM이 아니라 아투 채널 1529814918658785350 이 정상 경로 — 여기를 \"도달 실패\"로 판정해 없는 고장을 만들었다"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 40e8dc24-ed5f-4539-acc2-feab081b2c60
  modified: 2026-08-11T15:23:14.501Z
---

**아투(american-todayz) 승인·보고 카드의 정상 목적지는 아투 채널 `1529814918658785350` 이다.** 형 DM 채널(`1501858476362829834`)이 아니다.

## 무엇을 틀렸나 (2026-07-28~29)
`youtube-publish/discord.mjs` 에 `OWNER_CHANNEL_ID = 1501858476362829834` 를 박고, 카드가 거기 안 가면 `reachedOwner:false` + 경고를 내게 해뒀다. 그래서 매 실행마다 "형 채널로 안 갑니다. SHORTS_APPROVAL_WEBHOOK 을 넣으세요" 가 찍혔다.

**나는 그 경고를 검증 없이 형에게 옮겨 "승인 카드 배선이 비어 있다"고 보고했다.** 형 답: *"아투 채널에 보고해야지. 영상과 함께."* — 카드는 처음부터 제 자리에 가 있었다.

두 웹훅의 `channel_id` 를 실제 조회하면 끝날 일이었다(웹훅 URL에 GET → `channel_id`). 블로그 카드도 같은 채널이고 형은 거기서 보고 "발행" 한다.

## 진짜 결손은 채널이 아니라 **영상**이었다
카드에 글만 있었다. 원본 mp4 가 50MB 대라 디스코드가 안 받는다.
→ `makeWebCopy()` 신설: 8MB 초과면 ffmpeg `crf 30` 으로 굽는다(53초 1080x1920 → 6.0MB). 실패해도 카드는 나간다(승인을 막으면 발행이 멈춘다).

## 교훈
- **코드가 뱉은 경고도 "관측"이지 "사실"이 아니다.** 그 경고의 기준값을 누가 정했는지 확인하고 형에게 옮겨라. 내가 어제 박은 상수를 오늘 근거로 인용했다.
- 채널 판정은 추측하지 말고 웹훅 메타 GET 으로 `channel_id` 를 찍어라.

## 추가 확인(2026-08-11): "발행" 답장을 자동으로 받아 처리하는 리스너는 없다
형이 "발행"이라고 답해도 그걸 감지해서 `publish.mjs`를 자동 호출하는 코드가 `discord.mjs`에 없다(2026-08-11 cto 확인). 카드는 아투채널(`reachedOwner:true`)에 정상 도달하지만, 그 뒤 공개 전환은 **사람(클로/cto)이 카드를 보고 `bun publish.mjs --live --video <id>`를 직접 실행**해야 하는 수동 구간이다. 형이 메인채널(형-클로 채널)에 "발행"이라 답해도 놓치는 게 아니라, 애초에 어느 채널에 답해도 자동 소비자가 없다. 반복되면 이 리스너 자동화가 다음 개선 대상.

관련: [[feedback_verified_facts_only]] [[feedback_find_counterexample_first]] [[reference_moa_logs_and_ledgers]]
