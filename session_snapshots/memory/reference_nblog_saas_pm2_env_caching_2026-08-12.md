---
name: nblog-saas-pm2-env-caching
description: "nblog-saas AGENT_RELEASE_* 등 pm2 env는 .env.production 수정만으로 안 바뀜, pm2 자체 저장값 갱신 필요"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 8686b494-9004-44ad-b2e6-026b21be287b
  modified: 2026-08-15T23:38:57.485Z
---

nblog-saas 프로덕션(Lightsail, pm2)에서 `AGENT_RELEASE_VERSION` 등 일부 값은 `shared/.env.production` 파일을 고쳐도 반영 안 됨.

**원인**: pm2가 이 값들을 자기 내부 상태(`pm2 env <id>`로 확인 가능)에 별도로 캐싱하고 있음 — 아마 과거 어느 시점에 쉘에서 `export`한 뒤 `pm2 start`/`restart --update-env`로 기동해서 pm2 dump에 박힌 값. `.env` 심볼릭링크 파일을 고쳐도, Next.js가 dotenv 로딩 시 **이미 process.env에 있는 값은 안 덮어쓰는** 표준 동작 때문에 pm2가 준 값이 우선한다.

**증상**: `.env.production` 수정 → `pm2 restart --update-env` 해도 `/api/agent/v1/release/latest` 등 API 응답이 안 바뀜. `pm2 env <id>`로 확인하면 옛날 값 그대로 보임.

**해결법**: SSH 세션에서 새 값을 직접 `export`한 뒤 그 세션에서 `pm2 restart nblog-saas --update-env` 실행해야 pm2가 새 값을 채간다.
```
export AGENT_RELEASE_VERSION="0.1.9"
export AGENT_RELEASE_URL="https://nblog.nanumn.com/downloads/nblog-agent-setup-0.1.9.exe"
export AGENT_RELEASE_SHA256="<sha256>"
export AGENT_RELEASE_SIGNED="false"
pm2 restart nblog-saas --update-env
```
`.env.production` 파일도 같이 고쳐두는 게 맞다(다음에 진짜 처음부터 기동될 때 기준이 되므로) — 다만 **당장 반영되는 건 export+restart 쪽**이라는 걸 기억할 것.

deploy/README.md에 원래 이 절차(export→restart)로 적혀 있었는데, `.env.production`만 고치면 될 거라고 착각해서 한 번 헤맴(2026-08-12, 0.1.9 승격 작업 중).

**★2026-08-16 추가 — `.env.production`에서 값을 grep+cut으로 뽑아 export할 때 따옴표 함정.** DB 비번 로테이션 후 앱이 "Authentication failed" → export+restart로 1차 시도했는데 이번엔 "the URL must start with the protocol postgresql://" 에러로 바뀜. 원인: 파일에 `DATABASE_URL="postgresql://..."`처럼 따옴표로 감싸져 있어서 `cut -d'=' -f2-`로 뽑으면 따옴표까지 값에 포함됨. `v="${v%\"}"; v="${v#\"}"`로 양끝 따옴표 제거 후 export해야 함. 비번 절대 출력 금지 원칙 지키면서 검증하려면 `${DATABASE_URL:0:11}`처럼 프로토콜 접두사만 부분 출력해서 `postgresql:`로 시작하는지 확인.
