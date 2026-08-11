---
name: reference_nblog_saas_dev_gcp_key_rotation_2026-08-11
description: "nblog-saas 개발용 구글 서비스계정 키 재발급 절차 — 2026-08-11 cto 트랜스크립트 유출로 형이 재발급 결정"
metadata:
  type: reference
  originSessionId: c0f3a57d-6538-458f-bc40-b38df00c06c5
  modified: 2026-08-11T08:01:43.630Z
---

**계기**: 2026-08-11 오후, cto-seojin이 nblog-saas 발행테스트 작업 중 `D:\Develop\nblog-saas\.env.local` 파일을 실수로 통째로 출력해서 개발용 구글 서비스계정 개인키가 에이전트 작업기록(트랜스크립트)에 남음. 운영 계정(`nblog-saas-sheets-sync`)과는 분리된 개발 전용 키라 운영 권한 유출은 아니지만, 형이 찜찜해서 재발급하기로 결정(2026-08-11 17:01).

**대상 계정**: `nblog-saas-sheets-dev@nblog-saas-sheets.iam.gserviceaccount.com` (GCP 프로젝트 `nblog-saas-sheets`, 계정 `nanumn.com@gmail.com` 소유 — [[project_nblog_saas_account_domain_decision_2026-08-10]] 참고). 운영 계정과 물리적으로 분리돼 있어 이 재발급은 프로덕션에 영향 없음.

**절차**:
1. GCP 콘솔 → IAM 및 관리자 → 서비스 계정 → `nblog-saas-sheets-dev@...` 선택
2. "키" 탭 → "키 추가" → "새 키 만들기" → JSON 선택 → 다운로드
3. 다운로드된 JSON에서 `client_email`과 `private_key` 값 추출
4. `D:\Develop\nblog-saas\.env.local`의 두 값 교체:
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` = JSON의 `client_email` (보통 안 바뀜, 이메일은 계정 고유값)
   - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` = JSON의 `private_key` (개행 `\n`이 실제 개행이 아니라 문자 그대로 두 글자로 들어가야 함 — `src/server/sheets/google-auth.ts` 주석 참고)
5. 로컬 개발서버 재시작해서 sheet-sync 정상 동작 확인(개발용 시트 "글감" 재조회 성공 여부로 검증)
6. 이전 키는 GCP 콘솔에서 "삭제"(폐기) — 재발급 후 구키 방치하면 재발급 의미가 없음

**주의**: 운영 계정(`nblog-saas-sheets-sync@...`)은 이 절차와 무관, 절대 같이 건드리지 말 것 — 라이브 사이트(nblog.nanumn.com) 발행이 이 계정에 의존함.

관련: [[project_nblog_saas_account_domain_decision_2026-08-10]] [[project_open_threads_2026-08-11_dawn_snapshot]]
