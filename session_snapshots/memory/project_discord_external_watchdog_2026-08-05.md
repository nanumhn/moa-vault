---
name: project_discord_external_watchdog_2026-08-05
description: 형 지시로 세션 밖 저비용 디스코드 감시 스크립트 신설 + 세션워치독과 실측 토큰 비교. 며칠 관찰 후 세션워치독 완화 여부 형 결정 대기
metadata: 
  node_type: memory
  type: project
  originSessionId: 3e9c8b5b-187d-45b5-825f-58fc27635897
  modified: 2026-08-05T07:21:46.066Z
---

형 지시(2026-08-05): "외부 체크 만들어서 실제 토큰사용량을 비교해 보자." 세션 크론 기반 수신 워치독의 비용 구조([[reference_session_cost_structure]])를 실제로 줄일 수 있는지 실측 검증.

## 실측 결과
- 세션(클로드) 워치독 "조용히 종료" 1사이클 = 약 19.5만~25.2만 토큰(같은 세션 안에서 35분 새 30% 증가 — 세션이 길어질수록 계속 커짐)
- 원인: fetch_messages 자체가 무거운 게 아니라, **크론이 발화해 세션을 깨우는 순간 자체가 그때까지 쌓인 대화 전체를 다시 읽기 때문**. 그래서 형이 처음 제안한 "플래그 변수로 0/1 체크"도 크론 프롬프트 안에서 하는 이상 똑같이 비쌈(기각, 형에게 설명 후 합의)
- 외부(세션 밖) REST 폴링 = 체크 1회 0토큰

## 만든 것
`C:\Users\user\.moa\moa_discord_watchdog_external.ps1` — 윈도우 작업 스케줄러 `MoaDiscordWatchdogExternal`(5분 간격)로 등록. 봇 토큰으로 채널 직접 조회, 형 메시지가 10분+ 무응답이면 웹훅 알림. **한계**: 알림만 가능, 직접 응답은 못함(판단·맥락 이해는 세션에서만 가능). 웹훅 알림은 형 메인 채널이 아니라 SystemLogs로 감([[reference_atz_shorts_approval_channel]]류와 같은 채널 불일치 이슈, 미해결).

## 함정 2개(실측으로 잡음, 재발 방지용 기록)
1. PowerShell 기본 User-Agent를 Discord/Cloudflare가 403(`internal network error`, code 40333)으로 거부함 — curl류 UA(`curl/8.0`)로 위장해야 통과. curl 명령은 같은 조건에서 정상 동작해서 처음엔 "봇 토큰 문제인가" 헷갈렸음, UA가 원인이었음
2. PS5.1이 BOM 없는 UTF-8 `.ps1`을 cp949로 오인해 한글 로그·알림 문구가 깨짐 — `[System.Text.UTF8Encoding($true)]`로 BOM 추가해야 함. `reference_moa_healthcheck`에 이미 있던 교훈("PS5.1 UTF-8 BOM 필수")과 같은 함정이 새 스크립트에서 또 재발 — **새 .ps1 스크립트를 쓸 때마다 BOM부터 확인할 것**

## 장점
시스템(작업 스케줄러) 레벨이라 세션 리셋에 안 죽음 — 세션 크론과 달리 `session_bootstrap.md` 재등록이 필요 없음.

## ★하트비트 스킵 1건 관찰 (2026-08-05 06:39 KST)
같은 세션 안에서 워치독 사이클이 정상 fetch_messages는 하고(로그에 51만 토큰 소비 기록 있음) **하트비트 reply를 안 보낸** 케이스 1건 발생 — 같은 프롬프트로 도는데 이유 불명. 형이 "토큰이 갑자기 늘었다"고 물어봐서 세션 로그 대조하다가 발견(형 지적 없었으면 못 잡았을 것). 재발하면 패턴 확인할 것 — 특정 조건(직전 턴이 무거웠을 때 등)과 상관있는지.

## ★★결정 완료 (2026-08-05 07:09) — 세션 워치독 중단, 외부 스크립트로 완전 대체
"관찰 후 결정" 단계를 건너뛰고 즉시 결론 남: 하트비트 도입 후 1시간도 안 돼 5분마다 거의 동일한 메시지가 채널에 쌓이는 걸 형이 스크린샷으로 직접 보고 "워치독은 문제가 있는것 같아 / 토큰 소진이 너무 심하네 / 중단하자"로 철회 지시. 세션 크론 2개(주간 df72d74c·새벽 73b28021) 삭제 완료, `session_bootstrap.md`에 재등록 금지 반영. **이제 세션 쪽엔 형 메시지에 대한 실응답만 있고, 안전망은 전적으로 `MoaDiscordWatchdogExternal`(외부, 0토큰)이 담당**. 검증: 삭제 후 8분간 세션 로그에 `[자동·수신워치독]` 트리거 0건 확인(형 요청으로 직접 검증).

## 다음 세션이 할 일
`MoaDiscordWatchdogExternal` 작업 스케줄러 상태만 가끔 확인(`Get-ScheduledTaskInfo -TaskName MoaDiscordWatchdogExternal`). 세션 기반 워치독을 다시 켜야 할 상황이 오면(실시간 게이트웨이가 실제로 메시지를 놓치는 사례가 발견되면) 이번엔 **매 사이클 reply 없이 진짜 놓친 메시지가 있을 때만** 응답하는 원래 방식으로 재설계할 것 — 하트비트 재도입 금지(1회 시도해서 바로 철회당함).

관련: [[reference_session_cost_structure]] [[reference_harness_change_ledger]] [[reference_moa_healthcheck]]
