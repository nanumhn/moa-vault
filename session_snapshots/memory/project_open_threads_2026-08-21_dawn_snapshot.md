---
name: project_open_threads_2026-08-21_dawn_snapshot
description: 2026-08-21 오전 세션 스냅샷 — k사주 띠별운세+i18n 배포 대기(형 결재 3건), 타로 22장 완료
metadata:
  type: project
---

**갱신 2026-08-21 10:45 KST** (04시 최초 → 오전 작업분 반영)

## ★형 결재 대기 3건 — 이게 전부다
1. **PR #13 머지 = 프로덕션 배포.** 검수 2단 통과(지안 PASS + 클로 직접 재확인). 이 한마디면 라이브.
2. **가격** — 약관에 `$4.99`(단건)/`$7.99`(월)가 하드코딩돼 라이브 노출 중. 어제 논의된 단건 $29와 불일치. 정하면 약관까지 한 번에 수정.
3. **타로 별(星) 카드 교체 여부** — 22장 중 유일하게 평면 톤(1차 배치 산물). 대안 2장 준비됨(`star-alternate/`). 형이 승인한 그림이라 안 바꿈.

## 이번 배포에 들어간 것 (브랜치 `feat/zodiac`, 커밋 6개, HEAD `17e3511`)
- **띠별 운세 12페이지 + 허브** — 전부 무료, 생일 입력 없이 띠만 선택. 콜드스타트 유입 슬롯 목적
- **입춘 보정**(`lichun.ts`, 황경 315° 직접 계산) — 1~2월생 연주+**월간**이 바뀜. 3~12월 0건(73,414일 전수 대조)
- **i18n 전수 수리** — 하드코딩 영어 279건. `/ko/daily`는 통째로 영어였음. AST 스캐너 + 재발 방지 가드 4종
- **Pretendard 서브셋 217.7K** — 그전까지 한국어가 OS 기본 폰트로 그려지고 있었음(Poppins/Inter에 한글 글리프 없음)
- **`word-break: keep-all`** + 한글 자간 좁힘(라틴의 1/3)
- **webp** — 홈 이미지 15.7MB → **327KB(DPR2 실제 전송량)**. 원인은 `unoptimized` 6곳
- **OG 공유카드 한국어판** — 그전엔 한국어로 공유해도 영어 카드가 나갔음
- **약관·개인정보에 Gumroad 추가**(en/ko 6키) — 실제 결제는 Gumroad인데 문서엔 PayPal만 있던 법적 결함. PayPal은 폴백이라 병기 유지
- **띠 페이지 절기 표기** — "음력 N월" → "입춘~경칩" + 윤달 고지(형 지시)

## 다음 배포 묶음 (준비 완료, 커밋 안 함 — `_workspace/visual-refresh/`)
타로 22장(935KB) · 오행 5색 토큰(기존 emerald/rose/amber/slate/sky 승격, `/zodiac` 격자 포함) · 타로 시각 위계+유료 잠금 · 서체 교체(Song Myung+IBM Plex Sans KR+Cormorant) · 모바일 헤더 2줄(영어 139px 부족, 디자인 결정 필요)

## 형 결정 대기(비긴급)
- **`monthPillar` 절기 보정** — 현재 달력 월 기준이라 **매달 초 출생자 월주가 틀림(6명 중 1명 추정)**. `lichun.ts`를 30° 간격 12번 돌리면 됨. 기존 손님 리포트가 또 바뀌어서 다음으로 미룸
- `_workspace`가 `.gitignore`에 없어 170MB가 커밋 가능 상태 — 배포 후 정리

관련 [[reference_ksaju_lichun_regression_scope_2026-08-21]] [[reference_image_gen_glyph_traps_2026-08-21]] [[feedback_report_only_100_percent_done]] [[project_ksaju_menu_expansion_2026-08-20]]
