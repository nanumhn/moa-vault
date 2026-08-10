---
name: project_nblog_saas_account_domain_decision_2026-08-10
description: nblog-saas 도메인·구글시트 서비스계정 확정(2026-08-10) — nblog.nanumn.com + nanumn.com@gmail.com 전용 신규 GCP 프로젝트
metadata: 
  node_type: memory
  type: project
  originSessionId: c23b79cb-17fc-4fd7-8157-44d3094571d0
  modified: 2026-08-10T07:06:57.792Z
---

형이 2026-08-10 확정:
- **도메인**: `nblog.nanumn.com` (이전 계획이던 `nblog.toastdm.com`에서 변경 — [[project_open_threads_2026-08-10_afternoon_snapshot]]의 DNS 안내는 stale, 이 메모리로 정정)
- **구글시트 서비스계정용 GCP 프로젝트**: `nanumn.com@gmail.com` 계정(크롬 프로필 "Profile" — [[reference_google_accounts_by_purpose]])으로 nblog-saas 전용 신규 생성. 아투(뉴스자동화) 프로젝트 `advance-sonar-503415-u0`(계정 `info.nanumn@gmail.com`)는 건드리지 않고 완전 분리.

**Why:** 클로가 "서비스계정 1개가 전체 사용자를 담당" 구조를 설명하자, 형이 다른 사용자 시트 유출을 우려. 실제로는 사용자별 스프레드시트는 DB에 개별 저장돼(`SheetSource.spreadsheetId`, blog당 1개) 서로 격리되어 있어 사용자간 유출은 없음 — 다만 "플랫폼(서비스계정 키를 쥔 쪽)은 공유받은 모든 사용자 시트에 접근 가능"이라는 진짜 트레이드오프는 있음. 이를 줄이기 위해 nblog-saas 전용 서비스계정을 아투용과 분리하기로 함(SaaS 고객 데이터 접근권한과 내부 자동화 접근권한을 분리 — blast radius 축소).

**How to apply:** 앞으로 nblog-saas 관련 DNS·env·nginx·NEXTAUTH_URL 등 도메인 참조는 전부 `nblog.nanumn.com` 기준. 구글 API 관련(Sheets 등) 신규 서비스계정 발급은 `nanumn.com@gmail.com` 프로젝트 밑에서. 덱스에게 도메인 변경을 "그들만의업무" 채널(1534714627383099493)로 통지 완료(2026-08-10).

관련: [[project_open_threads_2026-08-10_afternoon_snapshot]] [[reference_google_accounts_by_purpose]] [[project_naver_blog_saas_2026-08-09_publish_logic_done]]
