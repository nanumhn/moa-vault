---
name: nblog-saas-pm2-env-caching
description: "nblog-saas AGENT_RELEASE_* 등 pm2 env는 .env.production 수정만으로 안 바뀜, pm2 자체 저장값 갱신 필요"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 8686b494-9004-44ad-b2e6-026b21be287b
  modified: 2026-08-12T16:37:57.327Z
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

## ★ 함정이 하나 더 있다 — `pm2 save` (2026-08-13 추가)

export+restart로 **런타임**은 바뀌지만, 거기서 멈추면 **재부팅 때 옛 값으로 되돌아간다.**
`pm2-bitnami.service`(systemd, enabled)가 부팅 시 `~/.pm2/dump.pm2`로 resurrect 하는데
dump는 `pm2 save`를 해야 갱신되기 때문이다. 그래서 확인할 곳이 **세 군데**다:

| 봐야 할 곳 | 확인 명령 | 빠뜨리면 |
|---|---|---|
| `shared/.env.production` | `grep '^AGENT_RELEASE'` | 처음부터 기동 시 옛 값 |
| pm2 런타임 | `pm2 env <id> \| grep AGENT_RELEASE` | 지금 당장 반영 안 됨 |
| `~/.pm2/dump.pm2` | `grep AGENT_RELEASE_VERSION` | **재부팅 시 롤백** |

정석 3단계(파일 → 런타임 → 영속). 일부만 export 하면 나머지 env가 날아가니 파일을 통째로 싣는다:
```
cd /home/bitnami/apps/nblog-saas
set -a; . shared/.env.production; set +a
pm2 restart nblog-saas --update-env
pm2 save && chmod 600 ~/.pm2/dump.pm2 ~/.pm2/dump.pm2.bak   # dump 기본 644라 비밀값 노출
```
pm2는 PATH에 없다 — `~/.nvm/versions/node/v24.11.1/bin/pm2`.

이 함정이 실제로 터진 사례: 2026-08-12 낮 "0.1.12 승격 완료"라고 기록해뒀는데, 다음날 확인하니
서버는 여전히 0.1.9였다. 승격이 **파일에도 dump에도 안 남고** 셸 export로만 떴다 사라진 것.
2026-08-13 형 승인 후 위 3단계로 재작업해서 실제 반영 완료.
