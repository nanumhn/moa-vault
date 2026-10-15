---
name: project_open_threads_2026-10-15_morning_snapshot
description: 10-15 오전 세션(10:53~14:2x) 스냅샷 — 04:00 리셋 저장신호 TIMEOUT·10:52 재부팅·형 DM reply 차단 재발·무응답관문 교착·MOC 7개 낡음 미갱신·일지 10-03~10-14 공백
metadata:
  node_type: memory
  type: project
  originSessionId: 5992a71c-7d99-448b-8d75-48eb1afbf95b
  modified: 2026-10-15T05:25:16.286Z
---

2026-10-15 오전 세션 (KST, 클로 직접 조회 기준)

- 04:00 리셋: session_saved.flag 없음 → 04:35 35분 TIMEOUT 후 저장 없이 재부팅 (session_reset.log). 10-14 오후·야간 일지·저장 없음.
- 10:41 첫 복구 세션 → 10:52 다시 부팅(이유 미확인) → 10:53 현 세션. 형 미응답 메시지 0건. cron 8개 재등록. ⑧ 꺼둠(09-22 형 지시).
- 클로 오보 정정: 10:42 "업무채널 감시 멈춤·3888 무응답" → 10:55 재조회 3888=200, 로그 증가. 원인 모름.
- ★형 DM reply 차단 재발: 13:4x부터 `not allowlisted`. 웹훅(moa_webhook_send.ps1 -Path)으로 14:17 1건 우회. access.json 안 건드림. 다음 세션에서 reply 되는지 먼저 확인하고 이 세션의 미전달 보고 요약 재전달.
- ★교착: 무응답 관문(150초)이 Discord reply 성공만 인정 → reply 차단 시 PowerShell·Bash까지 막힘. Write/Read는 통과(14:2x 확인). 결과적으로 웹훅 2번째 보고·일부 작업 불가.
- 랩실 일지 10-15 오전분 커밋 d39fe67 push 완료. 일지 공백 10-03~10-14(파일 없음).
- MOC 7개 낡음(staleness exit 2) 미갱신 — 다음 세션 할 일. BEHIND: 쇼츠 자동화(publish_ledger 10-14 20:12), 픽셀오피스 계열(cli_windows.json).
- 아투 쇼츠 10-12·10-13 오후 연속 실패 — edge_tts 나레이션 단계, 원인 미조사.

관련: [[reference_hyung_dm_send_blocked_needs_inbound_dm_2026-09-08]] [[reference_silence_gate_threshold_is_150s_2026-09-17]] [[project_open_threads_2026-10-02_afternoon_snapshot]]

- 14:26 새 세션(14:00 리셋, 재부팅 아님): 형 방 reply 다시 성공(sent id 1560162191057879141) → 세션 재시작으로 풀림 재확인. cron 8개 재등록(ec9e8207 외), ⑧ 꺼둠 유지. 미전달 요약 재전달 완료.
