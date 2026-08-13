---
name: reference_nblog_saas_pm2_dump_missing_secrets_2026-08-12
description: nblog-saas 재부팅 시 DB접속정보 없이 뜨는 잠복장애 발견·수리 — pm2 dump.pm2에 DATABASE_URL·AUTH_SECRET이 저장 안 돼있었음
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6b5d0519-e7c2-44ce-9c08-1b9652612efa
  modified: 2026-08-12T23:34:37.516Z
---

2026-08-12 SMTP 배포 작업 중 cto-seojin이 발견. nblog-saas는 런타임에 `.env` 파일을 안 읽는다(Next.js standalone 번들이라 dotenv/load-env-config 없음) — 환경변수는 오직 pm2 프로세스 메모리에 올라간 값이 전부다.

그런데 `~/.pm2/dump.pm2`(pm2가 재부팅 시 프로세스를 되살릴 때 쓰는 스냅샷)에 `DATABASE_URL`·`AUTH_SECRET`이 **저장돼 있지 않았다**. 부팅 시 `pm2-bitnami.service`가 이 dump로 프로세스를 복원하므로, 서버가 재부팅됐다면 nblog-saas가 DB·인증 비밀값 없이 뜬 상태(사실상 전면 장애)였을 것이다. 서버가 넉 달째 재부팅 없이 떠 있어서 지금까지 안 드러났을 뿐이다.

**수리**: `pm2 save`로 현재 살아있는 프로세스의 실제 env를 dump에 반영. 겸사겸사 dump 파일 권한이 기본 644(월드리더블)라 비밀값이 그대로 노출되는 문제도 있어서 600으로 조임.

**Why**: pm2 env 캐싱 함정([[reference_nblog_saas_pm2_env_caching_2026-08-12]])과 뿌리가 같다 — `.env.production`을 고쳐도 살아있는 pm2 프로세스에 자동 반영 안 되는 것처럼, `pm2 save`를 안 하면 재시작으로 넣은 값이 재부팅 시엔 통째로 증발한다.

**How to apply**: nblog-saas 서버에서 env 변수를 바꾸거나 pm2 재시작할 일이 있으면, export로 새 값 실어서 재시작한 뒤 **반드시 `pm2 save`까지** 실행할 것. 다른 pm2 관리 서비스(k-saju 등)도 같은 함정이 있을 수 있으니 재부팅 복원 여부를 점검할 가치 있음(아직 미확인).
