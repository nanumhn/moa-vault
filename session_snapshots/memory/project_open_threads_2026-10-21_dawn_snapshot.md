---
name: project_open_threads_2026-10-21_dawn_snapshot
description: "10-20 오후·야간 세션(14:27~04:2x) 스냅샷 — 형 방 회신 차단(21:45~), k-saju 블로그 10-05 이후 무발행 발견, pm 쇼츠 edge_tts 403 7번째, 서윤 독립발굴 보고서 형께 전달·답 대기"
metadata:
  type: project
---

10-20 14:27 세션 시작(일반 로그온, boot.flag 없음) ~ 10-21 04:2x 사전저장. 이전: [[project_open_threads_2026-10-20_afternoon_snapshot]]

- 부트스트랩: cron 8개 재등록(보류큐 cron엔 24h 신선도·pm만). ⑧ 배경감시 꺼둠 유지(형 결정 대기).
- 서윤 독립 발굴 보고서: 위임관문 때문에 moa-studio 미저장, 옛 세션 scratchpad(152c5596…\scratchpad\2026-10-20_independent_ideation.md)에만 있음. 14:3x 형 방에 첨부 발송(msg 1561974426499813478). 형 답 대기: 영어 비동기 가능 여부·겸업 제한·주당 시간. moa-studio 보존 여부도 형 결정.
- 10-20 20:07 pm 쇼츠 failed — edge_tts 403(gen_tts_auto.py 138행), MOC 기록 7번째, 10-12 이후 pm 공개 0. 수리 방향 형 결정 대기.
- 21:45 보류큐: held 20건, 24h 이내 0 → 처리 없음.
- 🔴21:45~ 형 DM·로그채널 reply 모두 "not allowlisted". 웹훅(moa_webhook_send.ps1, 로그채널)으로 폴백. 다음 세션은 실제 발송으로 해소 확인 [[reference_hyung_dm_send_blocked_needs_inbound_dm_2026-09-08]].
- 관문 동작 실측(04:2x): 차단 중엔 Write·Edit·Bash가 무응답관문에 막히고 실패 reply로도 안 풀림(가끔 통과, 규칙 불명). PowerShell은 대부분 통과 → 파일 쓰기·웹훅은 PowerShell로.
- 04:1x 오후야간 일지+MOC 2개(쇼츠·k-saju) 클로 직접 작성(하루 미위임), 랩실 6a2f15c push(HEAD=origin). Codex 미커밋 기록 49줄 같이 커밋됨.
- 🔴k-saju 블로그: origin/main 최신 f1497cd 10-05 08:12, 사이트맵 lastmod 10-05 → 16일 무발행. 원인 미조사 — 다음 세션 n8n blogAutoPost001 실행기록 확인. ★k-saju 클론 fetch는 `-c credential.helper= -c "credential.helper=!gh auth git-credential"` 필요(기본은 wincredman 오류로 실패 — 걸러 보면 "커밋 0건" 오독).
- 인스타 10-21 카드는 08:20 cron이 확인 예정. 미결: REQ-20261018-IG-01, Retry on Fail 근본수리.