---
name: project_open_threads_2026-08-11_dawn_snapshot
description: "2026-08-11 04시 새벽저장 스냅샷 — nblog-saas PC에이전트 설치파일 공개위치 결정 대기(최우선), 그 외 낮은 우선순위 3건"
metadata: 
  node_type: memory
  type: project
  originSessionId: c23b79cb-17fc-4fd7-8157-44d3094571d0
  modified: 2026-08-10T19:25:34.721Z
---

**세션리셋 시각**: 2026-08-11 04:00 KST 직전 저장.

## 열린 작업 (우선순위순)

**1. PC 에이전트 설치파일 공개 위치 — 형 결정 대기 (최우선 블로커)**
- 설치파일 완성·검증 끝남: `nblog-agent-setup-0.1.0.exe`(NSIS, 101MB, 관리자권한 불필요). 버전 0.1.0, SHA256 `f087cd04f327a91db61bb26b2d390995d04d61e046080dec5a560f2f1452bc33`. 현재 `nanumhn/nblog-saas`(비공개 레포) 릴리스 `agent-v0.1.0`에 있으나 익명 다운로드 404(비공개라서) — 이대로는 고객이 못 받음.
- 옵션: ①(클로 추천) `https://nblog.nanumn.com/downloads/`에서 직접 제공 — 새로 공개되는 것 없음, RAM 부담 없음(정적파일) ②설치파일 전용 공개 GitHub 레포 신설(예: `nanumhn/nblog-agent-releases`) — 형 계정에 새 공개 레포 생기는 일이라 클로가 임의로 못 만듦, 승인 필요
- **다음 세션이 할 일**: 형에게 A/B 재확인 → 결정되면 덱스(A) 또는 클로가 직접(B, gh CLI로 레포 생성) 마무리 → `AGENT_RELEASE_VERSION`/`AGENT_RELEASE_URL`/`AGENT_RELEASE_SHA256` 프로덕션 env 반영(덱스) → 형이 실제 설치→페어링→발행 왕복 테스트

**2. 3일 체험 티어가 너무 짧은지 — 형 재확인 중, 결론 안 남**
- 초대코드 4등급(3일/1개월/1년/프리패스) 중 최하위 티어. 형이 "3일은 너무 짧아?"라고 재고 중이었으나 최종 답 없이 다른 화제로 넘어감. 다음 세션이 형에게 다시 물어볼 것.

**3. 랜딩페이지 "14일 무료로 시작하기" 문구 — 낮은 우선순위, 미착수**
- 옛 오픈가입 시절 문구, 초대코드제(3일/1개월/1년/프리패스) 미반영. `src/app/page.tsx:15`. 급하지 않다고 보류 확정.

**4. 시트 아카이브 크론이 프로덕션에 실제 등록됐는지 최종 확인 — 미확인**
- `/api/internal/cron/sheet-archive`(매일 KST 03:40). 덱스한테 재배포 지시에 포함시켰으나 최종 확인 안 함.

## 오늘(2026-08-10) 완료된 것 (재작업 불필요)

- **nblog-saas 프로덕션 완전 라이브**: https://nblog.nanumn.com (Lightsail, Let's Encrypt SSL, neon DB, 구글OAuth, 초대코드 가입제 — 형이 실제 가입 왕복 성공)
- 구글시트 서비스계정 아투용과 분리 확정(`nblog-saas-sheets` GCP 프로젝트, nanumn.com@gmail.com 계정)
- 관제센터 대개편: 글감 CRUD, 시트연결 등록화면, 수집후 잠금규칙(Protected Range), 상태색상 6종, 사용법페이지(`/dashboard/help`), 시트 월별 자동보관, 발행정책 관리자설정(횟수·간격·지터±20분, 12시간 안전기준 명목프레임 재설계, 실행지연 40분 확정)
- 관제센터 관리자 회원관리(`/dashboard/admin/users`) 신설 — 형 계정 이미 ADMIN
- 오늘 push된 커밋 총 18개, 통합검증 5회(테스트 396~422개+빌드) 전부 통과
- 옵시디언 업무일지 `70 Record/2026/08/2026-08-10.md`에 오전+오후·야간 세션 전부 기록, 자산목록 갱신, git push 완료

## 오늘 배운 것 (재발방지, 다음 세션 참고)

- **같은 레포에 cto 에이전트 여러 개 병렬 위임 시 git 커밋이 섞일 수 있음**(실측 1건, 유실없이 즉시 재정리함) → [[feedback_parallel_agents_same_repo_git_conflict]]
- **테스트DB 공유 경합**은 에이전트별 `TEST_DATABASE_URL`(DB명에 `nblog_test` 포함) 분리로 해결됨 → [[reference_nblog_saas_shared_test_db_contention]]

관련: [[project_nblog_saas_account_domain_decision_2026-08-10]] [[feedback_status_visibility_accuracy_first]]
