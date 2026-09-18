---
name: project_session_cron_did_not_fire_2026-09-19
description: "2026-09-19 03:43·03:55 세션 cron이 CronList에 살아 있는데도 발화하지 않았다 — 원인 미확정, 일지·저장이 통째로 빠질 뻔함"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6af42f20-8fee-44fd-a58a-859d520490da
  modified: 2026-09-18T19:13:12.027Z
---

**2026-09-19 04:11 발견.** 세션 cron **2개가 예정시각에 발화하지 않았다.**

| cron id | 예정 | 내용 | 결과 |
|---|---|---|---|
| `2a22364a` | 03:43 | 세션마감 일지(오후·야간분) | **안 뜸** |
| `73f6b982` | 03:55 | 라이브 사전저장 + flag | **안 뜸** |

[확인: `CronList` 04:11 조회 — **8개 전부 목록에 살아 있음**, 위 둘 포함]
[확인: 나는 03:41 보고 뒤 04:11 Monitor 만료통지까지 **30분 유휴**였다]

## 왜 안 떴는지 모른다
후보(**전부 미검증**):
- ⓐ `Monitor`가 background task로 도는 동안 하네스가 REPL을 idle로 판정하지 않았다
- ⓑ 발화는 했으나 세션으로 전달되지 않았다
- ⓒ 30분마다 오는 Monitor 만료 턴이 cron이 끼어들 창을 계속 막았다

**반증 조건**: Monitor를 걸지 않은 세션에서 같은 cron이 정상 발화하면 ⓐ·ⓒ가 유력해진다. 걸지 않아도 안 뜨면 셋 다 틀렸다.

## 왜 위험한가
[[project_journal_gap_2026-08-05]] 는 "cron이 예약보다 30분 늦게 뜨는데 리셋이 정각에 죽여서" 나흘 연속 미실행된 사고였다. 그 수리(=리셋 스크립트가 flag를 35분 기다림)는 **cron이 늦게라도 뜬다는 전제** 위에 있다. **이번엔 아예 안 떴으므로 그 수리가 작동하지 않는다.**
[[reference_presave_cron_flag_missed_2026-09-05]] 보다 나쁜 판본이다 — 그때는 flag만 빠졌고 이번엔 cron 자체가 안 떴다.

## 그때 상황과 대응
[확인: `session_reset.log`] `04:00:02 SESSION RESET start` → `save-wait: STALE flag (2026-09-18 14:01:22) - deleting so it cannot be mistaken for today` → `still waiting (10min elapsed of 35min)`. **04:35 타임아웃이면 저장 없이 재부팅.**
손으로 대행: ①어제 오후·야간 일지를 haru에게 위임(`🚀 서브에이전트:[JOURNAL-20260918-PM] - 20260919041400`) ②스냅샷 갱신 ③`session_saved.flag` 직접 생성.

## ★다음 세션이 반드시 할 것
**cron을 걸었다고 끝이 아니다.** 예정시각(03:43·03:55 / 13:47·13:55)이 지나면 **실제로 떴는지 확인**한다. 안 떴으면 손으로 대행하고 **flag를 반드시 찍는다** — 안 찍으면 리셋 스크립트가 35분 헛기다린 뒤 저장 없이 재부팅한다.

관련: [[project_journal_gap_2026-08-05]] · [[reference_presave_cron_flag_missed_2026-09-05]] · [[project_open_threads_2026-09-19_dawn_snapshot]]
