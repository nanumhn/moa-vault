---
name: project_open_threads_2026-08-10_afternoon_snapshot
description: "2026-08-10 14시 오후 세션리셋 직전 스냅샷 — nblog-saas Lightsail배포 형액션2개 대기, 아투쇼츠 20:00 첫실전(크론 유실주의), 구글시트 서비스계정 형액션 대기"
metadata: 
  node_type: memory
  type: project
  originSessionId: 47d49f4c-df05-48bf-bae0-08d1f5c6625f
  modified: 2026-08-10T05:26:12.173Z
---

**세션리셋 시각**: 2026-08-10 14:25 KST 직전 저장(예약 13:55, 실측 지연).

## 열린 작업 (우선순위순)

**1. 아투 쇼츠 20:00 첫 실전 — 오늘 세션리셋 전이라 확인 크론 유실됨, 다음 세션이 직접 체크할 것**
- cto가 오늘 아투 쇼츠 오후슬롯(20:00, 06:30과 짝짓기) 구현 완료·push(moa-studio `feat/youtube-publish-wiring` 커밋 `eedb84e`). 오늘 20:00이 첫 실전.
- ★이전 세션에서 20:20 KST 확인용 1회성 CronCreate를 걸어뒀는데, **세션cron은 세션리셋에 안 살아남는다** — 이 리셋(14:00)으로 그 확인크론은 사라졌다. **다음 세션(14시 이후 뜨는 세션)이 20:20 이후 첫 상호작용 시 직접 `bun C:\Users\user\.moa\publish_ledger.mjs`로 "20:00 쇼츠 저녁" 칸 확인해서 형에게 보고할 것.** 스킵은 exit 0이라 웹훅 알림 안 감 — 반드시 수동 확인.

**2. nblog-saas Lightsail 배포 — 형 액션 2개 대기 중, 덱스는 준비 완료 상태로 대기**
- 덱스: SSH접속 성공, standalone빌드(64.9MB)+Prisma Linux엔진 커밋(`3a69b40`) 완료, 기존 pm2 3개(homepage-nanumn/suno-helper/toastdm-backend)+LAMP 안 건드림 확인.
- 형이 할 일: ①neon.tech에서 무료 프로젝트 직접 생성(가입인증이라 AI가 대신 못함) → DATABASE_URL 2개를 `D:\Develop\nblog-saas\.scratch\keys\neon-production.env`에 저장(채팅 금지) ②DNS `nblog.toastdm.com A 3.37.24.58` 추가.
- 이 2개 되면 덱스가 마이그레이션→업로드→PM2→시스템cron→헬스체크 순서로 바로 이어감.

**3. 구글시트(글감) 연동 — 형 액션 대기**
- nblog-saas 글감연결이 구글 서비스계정 키 미설정으로 503. 기존 GCP 프로젝트(`advance-sonar-503415-u0`, 아투 Blogger API와 동일, 계정 info.nanumn@gmail.com) 재사용 절차 안내함: Sheets API 활성화→서비스계정 생성→JSON키 발급→클로에게 전달→시트를 서비스계정 이메일에 공유.
- ★형이 명시적으로 "얼렁뚱땅 우회 말고 실제처럼 제대로 테스트하라"고 지시함 — DB에 테스트 글감 직접 넣는 임시방편 반려당함. 이 서비스계정 세팅이 끝나야 진짜 예약발행 테스트 가능.

**4. Google OAuth 클라이언트ID — 형 발급 대기**
- 프로덕션 로그인 방식은 Google OAuth로 확정(SMTP 대신). 형이 구글 콘솔에서 클라이언트ID/시크릿 발급해야 함. 아직 안내 전.

**5. nblog-saas 다중계정 운영 검증 — 성공, 상시운영 여부 형 판단 대기**
- aiislife+sky0bada("Ella Fam Blog") 동시 페어링 검증 성공(agentId `cmsmpj0es0032u7b0xmjxltmr`). 단 검증용 5분폴링만 하고 지금은 정지 상태 — 계속 운영하려면 상시구동 모드(`NBLOG_AGENT_INSTANCE=test` + `electron .`)로 재기동 필요, 형이 원하면 진행.

## 오늘 완료된 것 (재작업 불필요)

- nblog-saas 로컬 postgres+devserver 재부팅 자동복구(cto, `MoaNblogStackUp`+`MoaNblogCronTick` 작업스케줄러).
- ★로컬 cron 라우트가 애초에 아무도 안 호출하고 있었던 구조적 결함 발견+수리(vercel.json 크론은 배포시에만 동작 — 로컬은 지금까지 사람이 직접 눌러야만 자동발행 됐던 것).
- 오늘 06:00 aiislife 스킵 원인 2개 확정: ①위 인프라문제 ②어제 E2E테스트가 운영DB(nblog_dev)를 오염시켜 오늘 슬롯을 미리 소비됨으로 만듦(테스트DB 분리는 미수리, 별도 과제로 남음).
- Lightsail 배포방향 확정(Vercel Pro $20/월 대신 형 기존 서버 toastdm.com).
- 가입정책 확정(기록만): 초대장발급→이메일인증→체험판, 등급 4종(3일/1개월/1년/프리패스), 체험판 14일→3일. 미구현.
- 대시보드 로컬 로그인 개발용 우회(이메일 매직링크→서버로그 출력, `src/app/_lib/auth.ts`) — **운영배포 전 반드시 실SMTP로 교체해야 함, 안 바꾸면 아무나 남의 이메일로 가짜가입 가능한 구멍**.
- 오전 업무일지 archive-head-haru에게 위임(작성 여부/완료 미확인 상태로 리셋 — 다음 세션이 완료됐는지 확인).

## 형이 지적/정정한 것
- 클로가 "쇼츠도 06:00/19:30 2회"로 잘못 안내 → 형이 "쇼츠는 오전 1회잖아" 정정 (실제: 쇼츠 06:30 1회, 블로그만 2회였음).
- 클로가 예약발행 테스트에 DB직접삽입 임시방편 제안 → 형이 "얼렁뚱땅 하지 말고 실제처럼 하라"고 반려, 진짜 구글시트 연동으로 진행 지시.

관련: [[project_naver_blog_saas_2026-08-09_publish_logic_done]] [[project_nblog_saas_signup_policy_2026-08-10]]
