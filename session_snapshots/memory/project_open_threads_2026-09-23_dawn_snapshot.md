---
name: project_open_threads_2026-09-23_dawn_snapshot
description: 09-23 04:37~ 세션 스냅샷 — 재부팅복구 정상·03:55 저장 신호 누락으로 35분 TIMEOUT 뒤 재부팅·⑧ 여전히 꺼둠·덱스 업데이트창 04:29/04:38 재발
metadata:
  node_type: memory
  type: project
  originSessionId: e06986da-ab2b-495d-9822-445f9a275156
  modified: 2026-09-22T19:39:43.231Z
---

## 요약 (09-23 04:4x 작성)

- 04:36 재부팅 뒤 부트스트랩. 형 방 미응답 형 메시지 0건(fetch 15건). boot.flag 삭제함.
- cron 8개 재등록: 저장 2fbc0b0c·fa1dffff / 일지 2be00731·526b224c / 주간전략 729b07e2 / 수익리뷰 898d0b12 / 보류큐 c925705f / 인스타 e3438056. 보류큐 신선도·랩실 push 긴 형태·인스타 원문출력 금지 모두 프롬프트에 박음.
- ⚠️ 09-22 오후 세션은 일지(랩실 cbc5d60·e2dd052, 04:19~04:20)는 썼지만 **스냅샷 메모리·session_saved.flag를 안 남겼다** → 리셋 스크립트 04:35:04 TIMEOUT 후 저장 확인 없이 재부팅(session_reset.log). 09-22 오후 내용은 그 일지 `70 Record/2026/09/2026-09-22.md` 102행~에 있다.
- 09-22 핵심(일지 기준): 아투 4슬롯 발행·pm 경고카드 19:48 알림을 ⑧ 꺼져서 8시간 25분 늦게 봄·형방 송신차단 03:4x 재발(이번 세션 04:37엔 reply 정상 sent).
- **⑧ 배경감시는 계속 꺼둠** — 형 '다시 켜' 전엔 켜지 말 것.
- 덱스 결재카드 09-23 04:29·04:38 (1552039190995144717·1552041421815545910) = 재부팅마다 뜨는 업데이트창, REQ-20260921-DEX-01 동일건.

## 형 결재 대기 (10건, 변동 없음)
REQ-20260923-ATZ-01(신규) · REQ-20260921-DEX-01 · REQ-20260920-BOOT-01 · REQ-20260916-ATZ-01 · REQ-20260914-STRW38-01 · W39③ 덱스 카드 클릭 · 수익리뷰 방향 · 쇼츠 단가·문의처 · github-blog-pat 재발급 · ⑧ 재가동 여부 · 인스타 토큰 재발급 여부

관련: [[project_open_threads_2026-09-22_dawn_snapshot]]

## 07:45 보류큐 cron
- 09-23 am 글 06:08 보류(인용대조 1건: 소제목·alt “미국산 경유 국내에 우선 공급” — 원문 10행 축약에 따옴표). am 쇼츠 06:42 skipped(ledger 154행). 하루 am 슬롯 0건.
- 권한 축소로 수정·발행 안 하고 결재 **REQ-20260923-ATZ-01** 상정(형방 msg 1552088618980343920): 따옴표 제거 → --dry → 공개 → 쇼츠 am → done 이동. 승인 오면 그대로 실행. heldAt 기준 09-24 06:08 KST 넘으면 묵은 기사.

## 08:50 인스타 확인
- 09-23 카드 정상 https://www.instagram.com/p/Ddm3dERgWD7/ (08:01:13 KST, Graph 재조회). 방법: node 스크립트를 docker cp로 넣고 export:credentials --output 임시파일 → data.value로 fetch → 링크만 출력. 컨테이너 /tmp는 node 유저가 cp된 파일 못 지움 → `docker exec -u root n8n rm -f` 필요.

## 13:36 형 지시 — 아투 am 쇼츠 중단
- MoaAtzShorts 06:30 트리거 disabled, 보류큐 cron 재등록 521d17aa(am 쇼츠 제외), bootstrap ⑤-B 주석. → [[project_atz_am_shorts_stopped_by_hyung_2026-09-23]]

## 14:25 오전 일지·저장
- 일지 70 Record/2026/09/2026-09-23.md 신규(🌅 오전), MOC 3개 갱신, 랩실 ae9d3bd push(origin 일치, MOC exit=0). 낡음검사 BEHIND는 MOC 커밋 시각 기준이라 커밋해야 풀린다.
- 다음 세션: REQ-20260923-ATZ-01 형 답 확인(09-24 06:08 KST 넘으면 묵은 기사) · am 쇼츠 금지 유지 · ⑧ 꺼둔 채.

## 14:26 세션 리셋 뒤 부트스트랩 (오후 세션 시작)
- boot.flag 없음(일반 리셋) → 형 인사 생략. 형 방 fetch 10건: 미응답 형 메시지 0건(마지막 형 글 13:36 am 쇼츠 중단 = 처리 완료).
- cron 8개 재등록: 저장 8564ef74·a56b8e62 / 일지 0b26da97·a5d4e6e9 / 주간전략 c27bbd43 / 수익리뷰 93d23254 / 보류큐 4aa616c3(신선도·am 쇼츠 금지·권한축소 결재) / 인스타 fe559c4c.
- ⑧ 계속 꺼둠. 외부 감시 로그 둘 다 14:2x에 늘어남(살아있음). 최근 ALERT 3건은 덱스 업데이트창(REQ-20260921-DEX-01) 기지건.
- REQ-20260923-ATZ-01 형 답 아직 없음 — 09-24 06:08 KST 넘으면 묵은 기사.

## 21:45 보류큐 cron (4aa616c3)
- held 3건: 09-13 am 231.6h·09-17 pm 146.1h(묵음, 폐기 결재 대기) / 09-23 am 15.6h(REQ-20260923-ATZ-01 미승인 — 형 마지막 메시지 13:36, discord_watchdog_external.log 21:44). 실행 없음.
- ★형 방 송신차단 재발: 21:4x fetch·reply 둘 다 'not allowlisted'. access.json 손대지 않음. 웹훅(moa_webhook_send.ps1 -Path) 으로 보고 sent. [[reference_hyung_dm_send_blocked_needs_inbound_dm_2026-09-08]]
