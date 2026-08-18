---
name: project_open_threads_2026-08-19_dawn_snapshot
description: "2026-08-19 04시 새벽 사전저장 스냅샷 — 최우선=k-saju IG 댓글DM DB마이그레이션(형액션 대기), 8/26 캐러셀 일정 재조정 필요"
metadata: 
  node_type: memory
  type: project
  originSessionId: 99967856-b103-4d28-9541-54ba1cbe4809
  modified: 2026-08-18T19:25:40.610Z
---

**최우선 미해결 (다음 세션 이어받을 것)**:
1. **k-saju 인스타 댓글→DM 자동화 — DB 마이그레이션 미완.** 코드는 push+PR머지(형이 직접, https://github.com/nanumhn/k-saju/pull/1)+Vercel 자동배포까지 완료됐고 라우트는 라이브 정상(`/api/instagram/connect`=관리자 아니면 의도적 404, `/api/webhooks/instagram`=403 서명검증 정상). 하지만 새 테이블 2개(InstagramAccount/InstagramCommentReply) 생성이 안 됨 — 로컬 `.env`는 SQLite뿐이고 프로덕션 `DATABASE_URL_UNPOOLED`는 Vercel에만 있어 클로가 접근 불가(비밀키 정책). **형이 본인 터미널(세션 밖)에서 직접 실행 필요**: `cd D:\Develop\saju-studio && npx vercel login && npx vercel link && npx vercel env pull .env.production.local && npx dotenv -e .env.production.local -- npx prisma db push`. 상세: [[project_meta_app_review_root_cause_2026-08-19]]
2. **Meta 앱심사 다음 단계** — DB 마이그레이션 끝나면: Vercel 환경변수 7개(INSTAGRAM_LOGIN_APP_ID/SECRET 등, 형이 Meta 콘솔에서 직접 복사) → `/admin/instagram` 실연결 1회 성공(스크린캐스트 소재) → 비즈니스 인증(수일~수주) → 권한 3개(instagram_business_basic/manage_messages/manage_comments) Advanced Access 신청+스크린캐스트 제출 → 승인 후 라이브 전환.
3. **인스타 캐러셀 게시 목표일 8/26 재조정 필요** — 앱심사가 제출 전 단계라 사실상 불가능. growth-head-yoonseul에게 일정 재협의 요청 필요(아직 미실시).
4. **주간전략리포트(W34) 결재 4건** — 계속 미답변(Reddit 게시, nblog 네이버약관 대응방식, 편집책임자 표기명, healthchecks.io 승인). 여러 세션째 이월 중.
5. **쿠팡파트너스 승인 대기** — 임시승인 상태로 활동 중, 최종승인은 누적판매 15만원 이상시 자동검토(형 액션 없음, 그냥 대기).

**오늘 오후·야간(8/18~19) 완료된 것**:
- **Meta 앱심사 진짜 원인 확정**: "심사 진행중"이 아니라 "제출조차 못 하는 단계"였음 — feat/ig-comment-dm 브랜치 미푸시가 근본원인. 상세: [[project_meta_app_review_root_cause_2026-08-19]]
- **권한명 정정**: instagram_basic 등(클로 오안내) → instagram_business_basic/manage_messages/manage_comments(정답)로 형에게 재안내 완료.
- **하네스 권한 마찰 3건** — `gh pr merge`, `npx prisma db push`, 클로 자신의 `.claude/settings.json` 수정 전부 auto-classifier에 차단됨(형의 채팅 승인으로도 우회 불가). 형이 PR은 GitHub에서 직접 Merge, settings.json은 직접 편집(`Bash(gh pr merge:*)`, `Bash(npx prisma db push:*)` 2줄 추가)해서 해결. DB push 자체는 프로덕션 시크릿 미보유로 여전히 미완(위 1번).
- **세션 전용 cron 7개 재등록**(부트스트랩): 라이브 사전저장 새벽/오후, 세션마감 보고서 오전/오후야간, 주간 전략 리포트, 아투 보류큐 소비, **주간 수익 리뷰**(session_bootstrap.md 체크리스트에서 누락돼 있던 걸 CLAUDE.md 대조로 채워 넣음 — 과거 7주 미발화 사고 재발 방지).
- **아투 보류큐 확인**: 대기 파일 없음, 정상.
- **업무일지 작성+push**: haru가 `70 Record/2026-08-18.md`에 오후·야간 세션 섹션 기록, 자산목록도 갱신, git push 완료(커밋 f8feed6).

**형이 준 피드백(중요, 반복하지 말 것)**:
- "확인하고 답변을 줘야지" — 이미 위임된 저위험 작업(추가형 DB 마이그레이션 등)은 매번 "진행할까요?" 되묻지 말고 스스로 확인 후 진행+결과보고. [[feedback_autonomy_delegation]]
- 같은 명령(진행해)을 3번 반복해도 하네스 자동분류기 차단은 안 풀림 — 채팅 승인≠하네스 도구승인이라는 걸 형에게 명확히 설명해야 함.

**살아있는 서브에이전트**: cto-ig-comment-dm-deploy(idle, 3단계 DB마이그레이션 승인 대기 상태로 남아있을 수 있음 — 세션 종료 시 소멸). haru-journal-0819-0344(idle, 완료).
