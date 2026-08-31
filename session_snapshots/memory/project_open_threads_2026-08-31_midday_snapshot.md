---
name: project_open_threads_2026-08-31_midday_snapshot
description: 2026-08-31 14:00 세션 리셋 직전 스냅샷 — IG 캐러셀 해결·MOC 3개 갱신·nblog-saas 미병합 발견
metadata:
  type: project
  originSessionId: 1c673286-4329-4b1e-bbb7-136408636181
  modified: 2026-08-31T05:28:30.858Z
---

**세션 종료 시점(2026-08-31 14:0x KST) 상태**

## 이번 세션에 해결된 것
- **[실전 이슈 001] IG 캐러셀 5장 발행 — 완전 해결.** 실제 게시 성공(media id `18125645755814499`, https://www.instagram.com/p/DcsB6JFmzh8/). 원인=`graph.instagram.com`+구토큰 → `graph.facebook.com`+새 credential로 해결. 상세는 [[project_ig_carousel_observe_next_run_2026-08-31]]. 제나의 "동적 URL 거부 100% 확정" 결론을 클로가 실측으로 반증, 제나 즉시 수용·정정. 운영 `ksajuCarouselV5` 반영은 아직 미실행(형 승인 필요).
- 형 지시: 이슈 종료 표시 `🟩🟧🟥 이슈 종료 🟥🟧🟩` — [[feedback_issue_closure_marker_format]] 저장 완료.

## 방금 발견해 랩실 MOC 3개에 반영한 것
- `모아 스튜디오 MOC` — moa-studio(app/lib) 커밋 여전히 0건(마지막 08-23).
- `네이버 블로그 SaaS MOC` — **중요 발견**: 이용약관·개인정보처리방침 등 커밋 3건(`dd42147`·`44a95b3`·`e9270b5`, 08-28~08-30)이 `lint-fix-dex` 브랜치에만 있고 `main`/`origin/main`은 여전히 08-20(`7e3e149`)에 멈춰 있음. 실배포 확인 결과 `nblog.nanumn.com/terms`·`/privacy` 둘 다 404. 병합·배포가 다음 세션 우선 과제.
- `덱스·제나 워커 MOC` — 오늘 덱스 CLI 재기동(pid 28656, 10:59:44) + IG 캐러셀 협업 타임라인 추가.

## 세션 종료 시점 진행 중 (다음 세션이 이어받을 것)
- archive-head-haru 에이전트에게 오전 업무일지(`70 Record\2026-08-31.md` `## 🌅 오전 세션`) 작성 위임 — **세션 종료 시점 완료 확인 못 함(백그라운드 실행 중이었음).** 다음 세션에서 파일 존재 여부부터 확인할 것.
- 랩실(owenlab) git commit+push — MOC 3개 수정사항 아직 커밋 안 됨(`git status`로 확인 가능, working tree에 modified 3개). 다음 세션에서 haru 결과와 함께 커밋할 것.

## 여전히 열려 있는 결재/승인 대기
- `REQ-20260831-PAY-01` — k-saju 게스트체크아웃 PR #22 병합 승인 (66일 무매출 원인, W36 리뷰)
- `REQ-20260831-BLOG-01` — k-saju-blog frontmatter 이중 `---` 버그 패치 승인
- `REQ-20260831-FIN-01` — jiwon 펀널 스냅샷용 프로덕션 DB 1회성 조회 승인
- `ksajuCarouselV5` 운영 반영 승인 — 도메인+credential 교체(오늘 실측 완료, 미반영)
- nblog-saas `lint-fix-dex` → `main` 병합·배포 승인
- 수익모델 3안 승인(08-12부터, 장기 이월)

## ⚠️ 시급 — 내일 08:00 정기발행 재실패 위험
- haru가 일지 작성 중 지적: `ksajuCarouselV5`가 옛 설정(도메인+구토큰) 그대로라 **내일 08:00 KST 정기 캐러셀 발행이 같은 원인으로 또 실패할 수 있음.** 형 결재 한 번(도메인+credential 교체)이면 풀림 — 다음 세션 최우선 확인 항목.

## 참고
- 워치독 Monitor(`br9ewc27w`, 덱스·제나·아투 로그 ALERT/ERROR 감시)는 이 세션 한정이라 리셋되면 사라짐 — 다음 세션에서 재등록 필요(세션 시작 체크리스트 항목).
