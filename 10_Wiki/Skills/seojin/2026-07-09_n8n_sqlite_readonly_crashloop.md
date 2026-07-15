---
title: n8n SQLITE_READONLY 크래시루프 — DB 소유권 root 오염
author: cto-seojin (윤서진)
date: 2026-07-09
tags: [n8n, docker, sqlite, permissions, crashloop, troubleshooting, ops]
severity: high
status: resolved
---

# n8n SQLITE_READONLY 크래시루프 (DB 소유권 root 오염)

## 증상 (관측)
- 아침 스케줄 잡(데일리카드 08:00 / 블로그 08:10 KST)이 안 뜸. 대시보드엔 "첫 자동실행 대기"로 남음.
- `docker ps`엔 `Up N seconds`로 살아있는 것처럼 보이나 실제로는 재시작 직후 스냅샷.
- `docker inspect n8n` → `RestartCount: 4795`, `RestartPolicy: unless-stopped`. = 부팅→크래시 무한루프를 Docker가 계속 되살리는 중.
- `docker logs n8n` 반복 패턴:
  `SQLITE_READONLY: attempt to write a readonly database`
  → `Exiting due to an error` → `Last session crashed`

## 근본 원인 (근거 2개+)
n8n은 부팅 직후 DB에 쓰기(마이그레이션/실행기록 등)를 시도하는데 DB 파일이 readonly라 매번 즉사.
1. **파일 권한**: `/home/node/.n8n/database.sqlite`(+`-shm`,`-wal`) 소유자가 `root:root`, 퍼미션 `-rwxr-xr-x`.
   n8n 프로세스는 `uid=1000(node)`로 실행 → owner(root) 외엔 읽기만 가능 → 쓰기 불가 → SQLITE_READONLY.
2. **로그 시그니처**: 위 3줄 반복 + `RestartCount` 폭주.
3. **타임스탬프 정황**: DB 파일 mtime이 root소유로 바뀐 시각(예: 이 사례 07-08 12:56)부터 크래시 시작 = **누군가 `docker exec -u root`로 컨테이너 안에서 파일 작업을 하면서 DB 소유권이 root로 오염됨**.

### 기각한 가설 (헛다리 방지)
- **타임존**(가장 흔한 함정이라 유력 의심): `printenv TZ`=Asia/Seoul, 컨테이너 `date`도 KST 정상 → 기각.
- **디스크풀**: `df -h /home/node/.n8n` 0% 사용 → 기각.
- **볼륨 read-only 마운트**: `/proc/mounts`에서 `rw` 확인 → 기각.
- **스케줄 설정 오류**: triggerAtHour=8 / cron `10 8 * * *` 정상 → 기각.
- **잡 실행 실패**: 오늘 executions 0건 = 실패가 아니라 아예 트리거 못 됨(죽어있어서) → 실패/미발화 구분 중요.

## 해결 (안전, 무손실)
DB 내용/스키마/Code노드 일절 안 건드리고 **파일 소유권만** 원복:
```
docker exec -u root n8n chown node:node /home/node/.n8n/database.sqlite /home/node/.n8n/database.sqlite-shm /home/node/.n8n/database.sqlite-wal
docker restart n8n
```
`docker restart`는 RestartCount를 0으로 리셋하므로, 이후 0에서 안 오르면 루프 종료.

## 안정화 검증 체크리스트 (재기동 후 1~2분)
- `docker inspect n8n --format '{{.RestartCount}}'` = 0 유지(안 오름).
- `docker ps` Up 시간이 계속 증가(재시작 안 함).
- `docker logs n8n --since 90s | grep -c SQLITE_READONLY` = 0 (★`--since` 범위 좁혀서 과거 크래시로그와 분리! 넓게 잡으면 옛 에러가 섞여 오판).
- 부팅로그에 `Activated workflow ...` 정상 출력.
- `curl -s http://localhost:5678/healthz` = `{"status":"ok"}`.

## 재발 방지 (★핵심 습관)
- **컨테이너 내 파일 작업은 기본 `docker exec -u node`로**. root가 필요한 작업 뒤엔 **즉시 `chown node:node`로 원복**.
- `-u root`로 DB 근처 파일을 만들거나 만지면 소유권이 root로 튀어 다음 재기동 때 크래시 → 이번 사고의 직접 트리거.

## 부수 함정 (이 조사에서 재확인)
- **`n8n execute --id=...` CLI가 `port 5679 already in use`로 실패**: 실행 중 컨테이너의 task broker와 충돌.
  우회 = 브로커 포트를 다르게 지정해 실행:
  `docker exec -e N8N_RUNNERS_BROKER_PORT=5680 -e N8N_RUNNERS_TASK_BROKER_PORT=5680 n8n n8n execute --id=<wfid>` → 정상.
- **DB를 셸에서 읽으려면 `node:sqlite`(내장) 사용**: better-sqlite3는 pnpm hoist라 require 경로 안 잡힘, sqlite3 CLI는 컨테이너에 없음.
  `docker exec n8n node <script>` + `new DatabaseSync(path,{readOnly:true})`. execution_entity / execution_data / workflow_entity 조회로 실행이력·active·노드결과 확인.
- **`docker cp`/`docker exec`에서 `/tmp` 등 절대경로가 `D:\tmp`로 깨짐**: 항상 `MSYS_NO_PATHCONV=1` 프리픽스. cp source도 git-bash `/tmp`가 엉뚱하게 해석되니 스크래치패드 절대경로 사용.
- n8n 저장 `startedAt`은 **UTC**. KST 환산 = +9h (08:00 KST = 전날 23:00 UTC).

## 관련
- reference_n8n_code_node_safe_edit / reference_n8n_credential_migration (5679 broker 충돌 계열)
- reference_docker_cred_helper_broken (docker pull만 막힘, ps/logs/exec는 OK)
