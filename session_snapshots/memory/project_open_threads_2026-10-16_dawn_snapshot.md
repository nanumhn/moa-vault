---
name: project_open_threads_2026-10-16_dawn_snapshot
description: 10-16 새벽·오전 세션(04:26~14:2x) 스냅샷 — 재부팅 자동복구 정상·형 메시지 0건·보류큐 묵은글 18건 그대로·인스타 08:01 정상·MOC 3개 갱신(5개 미갱신)·일지 33f9ad2·IG 토큰은 httpQueryAuth의 value 필드
metadata:
  node_type: memory
  type: project
  originSessionId: 42698bdb-2678-4147-b497-9b168d2d1107
  modified: 2026-10-16T05:25:15.403Z
---

2026-10-16 새벽·오전 세션 (KST, 클로 직접 조회 기준)

- 04:26 재부팅(session_boot.flag boot=04:26:36) → 부트스트랩 자동 실행. 형 방 15건 조회 형 미응답 0건. flag 삭제. cron 8개 재등록(9f594f76·251e319c·5d5c66cc·2b7df77c·b52a92a5·38c968d5·df34964c·41f4365f). ⑧ 꺼둠 유지.
- 형 DM reply 이 세션 내내 정상(sent 반환). 형 메시지 0건.
- 07:45 보류큐: awaiting-qa-review 18건 동일(최신 10-11 06:10 am) → 발행 안 함. 정리 여부 형 판단 대기.
- 08:50 인스타: 10-16 08:01 https://www.instagram.com/p/DeiFvFojy-1/ Graph 재조회 확인. n8n 성공1·실패2(exec 627·628) 평소 패턴.
- ★IG 토큰 읽기: 자격증명 VCULFgF3wJiZOpmu는 httpQueryAuth 타입 → 토큰은 `data.value`. export는 stdout 앞에 안내문 2줄이 붙으니 --output 파일을 cat해서 파싱. ⑤-C cron 프롬프트에 반영할 것.
- 14:17 MOC 검사 exit 2: 하네스·덱스제나·쇼츠 3개 갱신. 미갱신 5개(모아스튜디오·아투·k-saju·ToastDM·nblog SaaS). ToastDM NOSOURCE. 하네스 BEHIND는 `session snapshot` 커밋이 evidence_ignore(`session-reset snapshot`)에 안 걸리는 오탐 [추측].
- 일지 10-16 오전분 직접 작성, 랩실 커밋 33f9ad2, ls-remote로 origin main 일치 확인. 랩실 push는 `wincredman` fatal이 떠도 실제로는 반영될 수 있음 → ls-remote(gh 헬퍼)로 판정.
- 미해결: 아투 pm 쇼츠 edge TTS 403(10-12·13·15 실패) 미조사 · 일지 10-03~10-14 공백.

관련: [[project_open_threads_2026-10-15_afternoon_snapshot]] [[reference_ig_token_readable_via_n8n_export_credentials_2026-09-17]]
