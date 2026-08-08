---
name: reference-dex-jena-channel-no-live-push
description: "형-클로 메인채널과 달리 \"그들만의업무/회의/대화\" 채널은 클로에게 실시간 자동수신이 안 됨 — 능동 fetch나 cron 감시 필요"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6279da50-7746-403f-8908-ff9f9f98e5b4
  modified: 2026-08-08T15:00:08.704Z
---

형-클로 메인채널(`1501858476362829834`)은 디스코드 메시지가 실시간으로 이 세션에 자동 push된다(`<channel source="discord" ...>` 태그로 도착). 반면 덱스·제나와 공유하는 "그들만의업무/회의/대화" 3개 채널([[reference_dex_jena_shared_channels_2026-08-08]])은 **자동 push가 안 된다** — `mcp__plugin_discord_discord__fetch_messages`로 능동 조회해야만 그 채널의 새 메시지(덱스·제나의 @멘션·완료보고·에러보고 포함)를 알 수 있다.

**Why:** 2026-08-08 덱스가 업무채널에 파일권한 에러(`icacls` 필요)를 올리고 `@달려라 클로`로 멘션했는데, 클로가 못 보고 있다가 형이 스크린샷을 보내줘서야 알았음. 형이 "내용 아래에 클로 멘션이 있는데. 확인 안 하니?"라고 직접 지적.

**How to apply:** 처음엔 세션 cron(`*/7 * * * *`로 fetch_messages)으로 만들었으나 형이 "토큰 발생되잖아"라고 지적해서 **외부 PowerShell 워치독으로 교체**(토큰비용 0) — `MoaWorkChannelWatchdogExternal` 작업스케줄러(7분 간격), 스크립트 `C:\Users\user\.moa\moa_workchannel_watchdog_external.ps1`. 재부팅/세션리셋 무관 상시 감시라 **재등록 불필요**, `Get-ScheduledTaskInfo -TaskName MoaWorkChannelWatchdogExternal`로 생존만 확인. 덱스·제나에게 활발히 업무 배정 중일 때만 의미 있으니, 그 협업이 끝나면 정리해도 됨. 세션 cron으로 먼저 만들었다가 외부 스크립트로 바꾼 교훈은 [[reference_atz_report_watchdog... 계열]]과 동일 — 반복 폴링류 감시는 처음부터 외부 스크립트로 만드는 게 낫다.
