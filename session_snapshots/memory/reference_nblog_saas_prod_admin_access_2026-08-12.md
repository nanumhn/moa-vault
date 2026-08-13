---
name: nblog-saas-prod-admin-access
description: nblog-saas 운영서버 SSH 접근법 + 초대코드 발급 명령어
metadata: 
  node_type: memory
  type: reference
  originSessionId: 8686b494-9004-44ad-b2e6-026b21be287b
  modified: 2026-08-12T23:16:02.237Z
---

nblog.nanumn.com 운영서버(AWS Lightsail bitnami)는 로컬에 이미 SSH 키가 있다.

- 키: `~/.ssh/lightsail/toastdm.pem` (chmod 600 필요)
- 접속: `ssh -i ~/.ssh/lightsail/toastdm.pem bitnami@toastdm.com` (또는 `nblog.nanumn.com`, IP `3.37.24.58` — known_hosts에 이미 등록됨)
- 앱 경로: `/home/bitnami/apps/nblog-saas` (`current`/`releases`/`shared`)
- **서버에 bun 없음** (node v24.11.1만 `~/.nvm`에 있음). `admin:invite` 등 bun 스크립트는 서버에서 못 돌린다.
- DB는 Neon(관리형 Postgres, `ap-southeast-1`) — 로컬에서 `DATABASE_URL`만 운영값으로 바꿔치면 로컬 bun으로 운영 DB에 직접 작업 가능. 운영 DATABASE_URL은 서버의 `shared/.env.production`에서 매번 SSH로 꺼내 쓰고, 절대 로컬 파일이나 transcript에 평문으로 남기지 않는다(그 자리에서 변수로만 써서 바로 unset).

**초대코드 발급** (레포 `D:\Develop\nblog-saas`, 스크립트 `scripts/invite-code.ts`):
```
bun run admin:invite -- --issue 1m --note "메모"
```
`--issue` 값: `3d`(3일체험) / `1m`(1개월) / `1y`(1년) / `free`(무기한). `--count N`으로 여러 장, `--revoke <코드>`로 폐기, 인자 없이 실행하면 전체 목록. 가입 경로는 `/login?join=1`, 코드 1장당 1명.

이 절차로 2026-08-12에 형 요청으로 1개월 코드 `MOA-0TS3-77G6` 발급함 (참고: [[project_nblog_saas_signup_policy_2026-08-10]]).

같은 날 21시대 형 요청으로 1년권 10장 추가 발급함(노트 "형 요청 1년권 10장 2026-08-12"): MOA-WQRJ-J5TE·MOA-1W4J-SP21·MOA-QM33-J3D0·MOA-H26A-MBXX·MOA-A31A-007B·MOA-9NG0-CWYJ·MOA-HQZ4-GDA6·MOA-RHYK-RP0G·MOA-ZCXH-GFCV·MOA-7TVW-MSQA.
