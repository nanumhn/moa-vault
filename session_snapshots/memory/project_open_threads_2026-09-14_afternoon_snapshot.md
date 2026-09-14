---
name: project_open_threads_2026-09-14_afternoon_snapshot
description: "09-14 14:2x 스냅샷 — 형 결재 4건 무응답(STRW38-01 핵심, 기한 09-16)·W38 산출물 임시폴더에만·아투 am 보류·인스타 09-14 정상"
metadata: 
  node_type: memory
  type: project
  originSessionId: 37a8aeb1-f9b4-4175-a543-f58669819be4
  modified: 2026-09-14T05:25:39.478Z
---

09-14 오전 세션(04:27 재부팅 복구~14:2x) 끝 기준. 상세: 랩실 `70 Record/2026/09/2026-09-14.md` 🌅 섹션(커밋 65e8e49, 원격 일치).

**형 결재 대기 (클로 상태변경 0건)**
- **REQ-20260914-STRW38-01** — (a) 제나 PR #22(nanumhn/k-saju 게스트 체크아웃) rebase·병합·배포 (b) 제나 `C:\Users\user\.moa\gsc_query_report.mjs` 아투 속성+시작/종료일 인자 (c) 클로 하네스 원장 정리 (d) PR #22 결재권 형 vs 덱스. 수익리뷰 W38 액션도 여기 연결. **형 답 기한 09-16 23:59, 09-17 오전 클로가 형 대화방 조회**(링크 재안내 1회만, 새 카드 금지). 승인 시 전용 이슈 스레드 열고 "지시 출처: 형 승인 REQ…" + 제나·덱스 @멘션
- REQ-20260914-ATZ002-01 — 아투 09-14 am 글 소제목·alt 2곳 “연준 결정 100% 존중”→“독립성을 100% 존중한다” → `run.mjs --from=out/2026-09-13T21-00-11_am_payload.json --dry` → 공개 → `start_shorts_task.ps1 -Slot am` → held/done 이동
- REQ-20260913-IG001-01 — 급하지 않아짐(09-14 08:01 게시 정상 `DdPsS0LEmg5`). 09-15 08:20 확인에서 또 "4장" 실패면 재부상
- REQ-20260913-ATZ001-02 — 09-13 am, 의미 약함

**W38 산출물 위치 (★폴더에 없음 — 위임 관문이 moa-studio/moa-vault 쓰기 거부, 우회 안 함)**
`C:\Users\user\AppData\Local\Temp\claude\D--Develop-Claude-Channels\37a8aeb1-f9b4-4175-a543-f58669819be4\scratchpad\` — report_2026-W38.md(검수 v3 PASS, 08:36 웹훅 발송) · research_2026-W38.md · 2026-W38_metrics.md(부록 A 순위대별 GSC) · 2026-W38_revenue-review.md. facts_2026-W38.md 와 report_2026-W37.md 는 weekly-strategy 폴더에 있음. **W39(09-21) 사실표 첫 줄에 이 경로부터 확인할 것.**

**다음 주 판정 약속 (리셋 넘어 살아남게)**
- ① PR #22 판정: 승인 후 매일 비로그인 `POST https://k-saju.me/api/gumroad/checkout {"kind":"onetime"}` — 완료=200+`url`, 배포증거=`gh api repos/nanumhn/k-saju/deployments` Production sha=병합 sha. 판정 줄은 **스레드 메시지**로
- ③ 09-28 W40 수익리뷰 입력: 09-13~09-26 GSC 검색 발견 재판정(이름 검색 제외 목록·비이름 노출<30 보류·10위 안 비중 10%/CTR 1% 선) — 2026-W38_revenue-review.md §4-3
- 세션 cron에 판정 과제를 붙이려면 부트스트랩 수정 필요 = 형 승인 사항

**기타 사실**
- 형 DM 송신 04:27부터 정상. 관리자 3888 04:28 HTTP 200
- W37 액션 0/2(전략)·0/3(수익). 무매출 73일, 진성 외부매출 생애 ₩0 (지원 /v2/sales 10:32)
- k-saju 블로그 09-07·09-09 결번 원인 미확인
- 인스타 export는 Git Bash에서 `MSYS_NO_PATHCONV=1` 필수 ([[reference_ksaju_ig_daily_two_failed_execs_2026-09-10]])
- 주간 전략 프롬프트 원본 분열: PROMPT.md(⑥ 없음) ↔ session_bootstrap.md L62~67
- 모아 스튜디오·네이버 블로그 MOC 4일 방치(오늘 일 없어 날짜 안 올림)
