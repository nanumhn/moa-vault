---
name: project_open_threads_2026-09-21_afternoon_snapshot
description: "09-21 14:08~09-22 04:2x 세션 스냅샷 — 형 메시지 0건·쇼츠 2/2·배경감시 ⑧ 메모리부족 강제종료 후 꺼둠(형 지시 대기)·tail 찌꺼기 45개 정리·결재 8건 그대로"
metadata:
  type: project
---

## 요약 (09-22 04:2x 저장)

- 형 메시지 **0건** (형 방 fetch 15건, 09-22 03:5x). 형 방 reply 송신은 이 세션 내내 정상.
- 부트스트랩 14:09~14:11 — cron 8개 재등록 + 보류큐 신선도 검사 수작업 삽입 + ⑧ 양방향 시험 통과.
- **⑧ 배경 감시: 지금 꺼져 있다.** 15:41 백그라운드 '첫 경보 종료' 방식으로 교체했으나 19:3x 전에 **Claude Code가 메모리 부족으로 강제종료**. 19:34 여유 4,191MB/32,472MB. 형께 "지시 있을 때까지 꺼둔다"고 보고함 → **다음 세션: 부트스트랩대로 다시 걸되, 메모리 먼저 확인**. → [[reference_monitor_expiry_leaks_tail_use_background_exit_on_alert_2026-09-21]]
- Monitor 만료가 `tail -f` 를 안 치워 **45개 누적**(이전 세션분 포함) → 정리.
- 아투 쇼츠 09-21 **2/2** (pm `N2Fk2oHsj8I` 원장 20:08:05·HTTP 200). 블로그 pm `publishedAt 19:39 KST`(state.json) — 공개 URL 재조회 안 함.
- 보류큐 21:45 — 09-13 am·09-17 pm 둘 다 24h 초과, 공개 금지 유지. 새 건 없음.
- 일지 09-21 오후·야간 + 쇼츠 MOC 갱신, 랩실 커밋 `753f6f2` push 완료.

## 다음 세션이 알아야 할 것

1. **랩실 push 는 `git -c credential.helper= -c "credential.helper=!gh auth git-credential" push`** — 일지 cron 프롬프트의 짧은 형태는 09-22 03:5x에 실패했다. cron 재등록 시 긴 형태로 적을 것.
2. 보류큐 신선도 검사 — REQ-20260920-BOOT-01 승인 전까지 ⑤-B 재등록 때 계속 수작업.
3. 보류큐 나이 계산: `heldAt` 이 `2026-09-13T21-11-33-485Z` 형식이라 fromisoformat 실패. 시각 구분자 `-`→`:` 치환 후 파싱.
4. 30분 Monitor 로 ⑧을 걸면 재무장마다 형 방 알림이 나간다(09-15·09-21 두 번 겪음). 백그라운드 방식으로 걸 것.

## 형 결재 대기 (변동 없음)

REQ-20260921-DEX-01 · REQ-20260920-BOOT-01 · REQ-20260916-ATZ-01 · REQ-20260914-STRW38-01 · W39③ 덱스 카드 클릭 · 수익리뷰(검색 계속 vs 채널 전환) · 쇼츠 단가·문의처 · github-blog-pat 재발급
