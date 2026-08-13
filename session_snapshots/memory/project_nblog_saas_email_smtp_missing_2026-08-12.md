---
name: project_nblog_saas_email_smtp_missing_2026-08-12
description: "nblog-saas 회원가입완료/로그인(매직링크) 안내 메일 — 구현·배포·실메일검증까지 완료(2026-08-12)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 6b5d0519-e7c2-44ce-9c08-1b9652612efa
  modified: 2026-08-12T23:34:23.402Z
---

2026-08-12 형 지시("클로야, 회원가입 완료 메일하고 로그인 안내 메일 발송하는 것도 계획해서 진행해보자" — 음성입력이라 "콜레아"로 오타 전사됨, nblog-saas 얘기로 확인됨)로 cto-seojin이 구현.

**만든 것**: `D:\Develop\nblog-saas` main 브랜치 커밋 `5b56614`(push 완료).
- 로그인 방식은 구글 OAuth + 매직링크(비밀번호 없음), 메일 인프라는 nodemailer + NextAuth Nodemailer provider(Resend 아님).
- 회원가입 완료(웰컴) 메일: `createUser` 이벤트에서 초대장 소진+이용기간 부여 뒤 발송, 실패 시 삼키고 로그만(계정 생성 자체를 막지 않기 위해).
- 로그인 매직링크 메일: `sendVerificationRequest`에서 발송, 실패 시 예외를 던짐(로그인 수단 자체라 조용히 실패하면 안 됨). 기존 next-auth 기본 영문 템플릿을 한국어로 교체.
- 관련 파일: `src/server/mail/mailer.ts`(SMTP+재시도3회+드라이런), `templates.ts`, `notify.ts`, `src/app/_lib/auth.ts` 배선, `tests/signup-emails.test.ts`.
- 곁다리로 테스트 격리 버그 발견·수정: `truncateAll`이 `VerificationToken`을 안 지워서(User FK 없어 CASCADE 안 됨) 인증 왕복 테스트 여러 개 돌리면 앞 파일 토큰이 뒤 파일 count 검사를 깨뜨림.

**★배포 안 함 — 이유**: 운영서버(`shared/.env.production` + pm2 env) 확인 결과 `EMAIL_*` 변수가 0개. 즉 지금 운영에서 "이메일로 로그인"을 눌러도 링크가 pm2 로그에만 찍히고 실제 메일은 안 나가고 있었다(구글 로그인만 써서 아무도 몰랐던 잠재 결함). 코드만 배포해도 메일은 여전히 안 나감.

**Why**: 형이 SMTP 발신 계정(Gmail 앱 비밀번호나 SES 등)을 준 적이 없어서 처음부터 매직링크 로그인 경로가 운영에서 죽어있던 상태. [[reference_nblog_saas_pm2_env_caching_2026-08-12]] 함정도 같이 적용됨(export 후 재시작 필요).

**How to apply**: 형이 SMTP 자격증명을 주면 → `D:\Develop\nblog-saas\deploy\README.md` 절차대로 서버에 넣고 pm2 재시작 → 버리는 주소로 가입/로그인 왕복 돌려 실메일 2통(가입완료+로그인) 수신 확인까지 마무리. 그 전까진 이 작업은 "코드는 완료, 배포는 형 결재 대기"로 취급할 것.

**2026-08-12 22:00 업데이트**: 발신 계정 확정 = `nanumn.com@gmail.com`(형 승인). 앱 비밀번호는 계정 소유자만 발급 가능(2단계인증→앱 비밀번호 메뉴)해서 클로가 대신 못 만듦 — 형한테 16자리 비밀번호 발급·전달 요청해놓고 대기 중. 받으면 서버 `EMAIL_SERVER_*` 변수 채우고 pm2 재시작(export 필수) → 실메일 확인 → 배포 완료로 마무리.

**2026-08-12 23:30 최종 완료**: 형이 앱 비밀번호 전달 → 서버 적용 → 가입완료 메일·로그인 매직링크 메일 **둘 다 실제 수신 확인**(스팸함 아닌 받은편지함, 한글 본문 정상). `EMAIL_FROM`은 인증 계정 주소 그대로 써야 함(다른 도메인 쓰면 Gmail이 거절하거나 스팸행 — SPF/DKIM 없어서). 배포 과정에서 curl 검증 중 `+`가 공백으로 치환돼 존재하지 않는 주소로 메일 1통이 잘못 나갔다가 550 반송된 해프닝 있었음(실제 수신자 없음, 토큰 즉시 삭제, README에 함정 기록). 이 작업은 완료 상태 — 후속 조치 불필요. 이 과정에서 발견된 별도 잠복장애는 [[reference_nblog_saas_pm2_dump_missing_secrets_2026-08-12]] 참고, 에이전트 버전 0.1.9 vs 0.1.12 불일치는 형 확인 대기 중(별도 이슈, 이 메일 작업과 무관).
