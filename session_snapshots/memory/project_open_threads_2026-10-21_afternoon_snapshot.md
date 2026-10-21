---
name: project_open_threads_2026-10-21_afternoon_snapshot
description: "10-21 오전 세션(04:27 재부팅~14:2x) 스냅샷 — 형 방 회신 차단 풀림, cron 8개 재등록, 인스타 정상, 보류큐 0, 오전 일지·MOC 3개 c043e1f push, 형 답 대기 2건"
metadata:
  node_type: memory
  type: project
  originSessionId: 1d568706-7f28-4075-b671-00d821d7a44c
  modified: 2026-10-21T05:25:17.529Z
---

10-21 04:27 재부팅(boot.flag 04:27:05) ~ 14:2x 사전저장. 이전: [[project_open_threads_2026-10-21_dawn_snapshot]]

- 부트스트랩: 미응답 형 메시지 0(fetch 15건), cron 8개 재등록 04:29, boot.flag 삭제. ⑧ 배경감시 꺼둠 유지(형 결정 대기).
- 형 방 reply 차단(10-20 21:45~) 해소 — 재부팅 뒤 reply 1562185897418690721 성공. [[reference_hyung_dm_send_blocked_needs_inbound_dm_2026-09-08]] 재시작으로 풀린 4번째 사례.
- 07:45 보류큐: held 20건, 24h 이내 0 → 처리 없음.
- 08:50 인스타: https://www.instagram.com/p/Deu9tPaAROa/ 게시 08:01:11 KST(Graph 재조회). 자격증명 VCULFgF3wJiZOpmu는 httpHeaderAuth 형식(data.name=access_token, data.value=토큰) — export:credentials에서 value를 쓸 것.
- 덱스 27040·제나 3124(04:29 재기동) 14:2x 생존(tasklist).
- 14:1x 오전 일지 + MOC 3개(쇼츠·하네스·덱스제나) 클로 직접 작성, 랩실 c043e1f push(ls-remote 일치). ToastDM MOC NOSOURCE 그대로.
- 형 답 대기: 서윤 독립발굴 보고서 질문 3개(영어 비동기·겸업 제한·주당 시간), pm 쇼츠 edge_tts 403 수리 방향(10-12 이후 pm 공개 0, 오늘 20:00도 실패 가능성 [추측]).
- 미조사: k-saju 블로그 10-05 이후 무발행(n8n blogAutoPost001 실행기록 확인 필요). 미결: REQ-20261018-IG-01.
- 실수: ack reply와 PowerShell을 같은 묶음으로 보내면 무응답 관문이 PowerShell을 먼저 막는다 — ack 먼저 보내고 결과 받은 뒤 다음 도구.
