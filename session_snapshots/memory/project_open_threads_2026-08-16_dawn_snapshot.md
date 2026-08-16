---
name: project_open_threads_2026-08-16_dawn_snapshot
description: "2026-08-16 04시 새벽저장 스냅샷 — 최우선=nblog-saas 운영 DB비번 로테이션 후 pm2 반영 미확인(앱 다운 가능성), 웹배포 밀림"
metadata:
  type: project
  originSessionId: 99af3b4a-df80-4f19-9653-b29f3bce76ea
  modified: 2026-08-15T23:39:11.913Z
---

**✅ 해결됨 — nblog-saas 운영 DB 비밀번호 로테이션 후 다운, 2026-08-16 08:37 KST 복구 완료**
- 2026-08-16 새벽 세션이 뜨자마자 확인해보니 실제로 앱이 "Authentication failed against database server"로 죽어있었음(pm2 로그 확인). 형이 전날 밤 `.env.production` 수정+`pm2 restart`까지는 했지만 pm2 env 캐싱 함정([[reference_nblog_saas_pm2_env_caching_2026-08-12]])에 걸려 반영 안 됐던 것.
- 형이 서버에 로그인한 상태에서 "빨리 검토해서 재시작해줘" 승인 → 클로가 export+`pm2 restart --update-env`로 직접 처리. 1차 시도는 `.env.production`의 따옴표가 값에 그대로 딸려와서 "URL must start with postgresql://" 에러로 실패 → 따옴표 제거 후 재시도, 08:37:47 정상 기동, 홈페이지 curl 200 확인, 에러 재발 없음. 세부 함정은 [[reference_nblog_saas_pm2_env_caching_2026-08-12]]에 추가 기록.
- 같은 건으로 **운영 DB 비밀번호가 디스코드 채팅에 스크린샷+평문 텍스트로 2회 노출**된 사고가 있었음([[project_nblog_prod_db_secret_leaked_screenshot_2026-08-15]]) — 이건 별개로 로테이션 완료됐으니 종결.

**웹서버 배포 밀림 — K열 이미지첨부 + 재발행 버튼이 origin/main엔 있지만 운영엔 아직 안 올라감**
- 오늘 밤 완료된 기능 2개(재발행 버튼 `e09d7ba`, K열 이미지첨부 `ffabd39`, 935/935 테스트 통과)가 origin/main에 push는 됐지만, **운영서버 마지막 실제 배포는 release `20260814234444`(8/14 밤)로 확인됨** — 그 뒤로 배포 안 됨.
- 다음 세션에서 형 확인 후 배포 진행할 것(마이그레이션 먼저 → prisma generate → 앱배포 → pm2재시작 순서, K열 기능은 신규 마이그레이션 포함돼있음 — `AiMediaAsset` 테이블).

**★★★디스코드 회신 도구 미호출 사고 — Stop 훅으로 근본 해결(19회+ 반복 후)**
- `.claude/hooks/check-discord-reply.mjs` 신설, `D:\Develop\Claude_Channels\.claude\settings.json`에 등록. 디스코드 인바운드 메시지 뒤에 성공한 reply 도구 호출이 없으면 턴 종료를 시스템 레벨에서 차단.
- v1은 "ack만 보내고 진짜 답은 텍스트로" 패턴을 못 잡는 구멍이 있어서 실전에서 바로 드러남 → v2로 즉시 수정 완료. 리로드 없이 실전에서 여러 차례 정상 작동 확인됨.
- **다음 세션이 할 일**: 이 훅이 여전히 걸려있는지 `.claude/settings.json`의 `hooks.Stop` 확인. 사라졌거나 오작동하면 [[feedback_acknowledge_first]] 메모리 참고해서 재구축.

**완료된 것들 (재작업 불필요)**
- nblog-saas 재발행 버튼(`e09d7ba`) — 대시보드에서 사용자 자기소유 블로그만 재발행 가능, 다음 정규슬롯 임박시 자동 재예약.
- K열 이미지 첨부(`ffabd39`) — 드라이브링크→서버재호스팅, retention 크론(30일+용량상한) 포함.
- nblog-agent 탭 누적 회귀테스트(`b3a95ff`) — 실사용 버그 아님으로 확인됨(테스트 더블 문제였음), 오진 정정 완료.
- nblog-agent naver.ts keepalive UNKNOWN 판정 개선(`9442dbb`) — **소스만 커밋됨, 앱 재빌드·재배포 안 됨**(형이 나중에 원하면 진행).
- dex-jena-bridge 호출 별칭(STT오인식 대응: 덱스↔텍스/뎁스/댁스 등, 제나↔지나/제너 등) — 데몬 재시작까지 완료.

**대기 중 (장기 미해결)**
- k-saju Lightsail 이전 — 형 AWS 콘솔 액션 계속 대기.
- "전국 맛있는 빵집 투어" 콘텐츠 시리즈 — 형 승인만 됐고 착수 안 함(K열 기능이 방금 완성됐으니 이제 실사진 첨부하며 시작 가능).
- 오늘(8/15) 오전 세션마감 cron(13:48) 미실행 원인 — [[project_journal_morning_gap_2026-08-15]], 다음 세션에서 원인 조사.

관련: [[feedback_acknowledge_first]] [[project_journal_morning_gap_2026-08-15]] [[reference_nblog_saas_pm2_env_caching_2026-08-12]] [[project_nblog_prod_db_secret_leaked_screenshot_2026-08-15]]
