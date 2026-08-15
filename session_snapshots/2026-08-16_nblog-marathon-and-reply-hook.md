# 2026-08-15 밤 ~ 2026-08-16 새벽 세션 스냅샷

## 완료된 작업
- **nblog-saas 재발행 버튼** (`e09d7ba`) — 대시보드에서 사용자 자기소유 블로그의 NAVER_LOGGED_OUT류 실패를 직접 재시도. 다음 정규 슬롯 임박 시 자동 재예약(`Blog.minIntervalMin` 기반 동적 계산). 급하게 만든 CLI(`scripts/manual-retry.ts`)를 `src/server/rules/manual-retry.ts`로 승격해 CLI·API가 같은 판정 함수 공유.
- **K열 이미지 첨부** (`ffabd39`) — AI 본문자동화 서비스에 사용자 실사진(구글드라이브 공유링크→서버 재호스팅) 첨부 기능. 함정 2개(확장자없는URL, 비공개링크 200+HTML) 실제 로컬 HTTP 서버로 재현해 수정 검증. retention 크론(30일 미검토 만료+블로그당 용량상한) 신설. 전체 테스트 935/935 통과.
- **nblog-agent 탭 누적 회귀 오진 정정** (`b3a95ff`) — `tests/agent-keepalive-probe.test.ts` 2건 실패가 실사용 버그가 아니라 테스트 더블이 `page.waitForTimeout`을 못 흉내내서 생긴 오탐임을 git bisect로 확정. 테스트 더블만 보강.
- **nblog-agent naver.ts keepalive UNKNOWN 판정 개선** (`9442dbb`) — 화면 판정이 애매하면 착지주소 재확인으로 승격, 확인시각 방치 방지. **소스만 커밋, 앱 재빌드·배포 안 됨.**
- **dex-jena-bridge 호출 별칭** — STT 오인식(덱스→텍스 등) 대응, `TRIGGER_ALIASES` 환경변수 신설, 데몬 재시작 완료.
- **★디스코드 회신 Stop 훅** — `.claude/hooks/check-discord-reply.mjs` + `settings.json` 등록. 형에게 텍스트만 쓰고 실제 reply 도구를 안 부르는 사고가 이 세션에서만 19회+ 반복돼서(누적으로는 25회 이상, 6개월 전부터 있던 고질 문제) 하네스 레벨로 강제. v1의 "ack만 보내고 진짜 답 드롭" 구멍을 v2로 즉시 수정, 리로드 없이 실전 작동 확인.

## 사고
- **운영 Neon DB 비밀번호가 디스코드 채팅에 2회 노출**(스크린샷 1회+평문 텍스트 1회). 클로가 값을 다시 옮기지 않고 즉시 삭제 요청+로테이션 권고. 형이 콘솔에서 재설정 완료.
- **재설정한 비밀번호가 pm2 env 캐싱 때문에 서버에 반영 안 됨** — `.env.production` 수정+`pm2 restart`만으론 안 되고 `export`+`--update-env` 필요(기존에 알려진 함정 재발). 형이 이 최종 조치를 완료했는지 확인 응답 없이 세션 종료 — **다음 세션 최우선 확인사항**.
- **디스코드 회신 미호출 사고 19회+** — 형이 "실수가 너무 심하네", "계속 한번에 성공을 못하네"로 직접 지적. 클로가 초반엔 "타이밍 겹침"으로 오진했다가 형이 스크린샷(실제 디스코드 앱 vs 세션 터미널창 비교)으로 반박, 정정. 위 Stop 훅으로 근본 해결.
- **오전(8/15) 세션마감 cron 미실행** — archive-head-haru가 야간 보고서 작성 중 발견, `70 Record/2026-08-15.md` 파일 자체가 없었음. 원인 미확정.

## 다음 세션 최우선
1. nblog-saas 운영 앱 DB 인증 상태 확인(`pm2 logs nblog-saas`) — 죽어있으면 export+--update-env 재시도.
2. K열+재발행버튼 기능을 실제 운영서버에 배포(마지막 배포는 8/14 밤, 아직 안 올라감).
3. Stop 훅(`.claude/hooks/check-discord-reply.mjs`)이 여전히 살아있는지 확인.
4. 오전 세션마감 cron 미실행 원인 조사.
