---
name: nblog-agent-0.1.12-promotion
description: "nblog-agent 공식 버전 포인터를 0.1.9 → 0.1.12로 승격, 운영서버 실반영 확인 완료"
metadata:
  node_type: decision
  type: decision
  date: 2026-08-13
  project: nblog-saas
  owner: cto-seojin
---

# nblog-agent 0.1.12 공식 승격 (2026-08-13)

## 결정
형 승인으로 PC 에이전트 공식 버전 포인터를 **0.1.9 → 0.1.12**로 올렸다.
(형 지시 시점 기준 날짜는 08-12로 언급됐지만, 실제 반영 시각은 KST 2026-08-13 08:38 —
서버 UTC 로그로는 2026-08-12T23:38이라 두 날짜가 같은 순간을 가리킨다.)

## 왜 다시 했나
08-12 낮 세션에서 형 검증(아이콘·박스UI·연한칩색·업데이트표시)을 통과해 "0.1.12 승격 완료"로
기록해뒀는데, 08-13 SMTP 배포 작업 중 운영서버를 열어보니 `AGENT_RELEASE_VERSION`이 여전히
`0.1.9`였다. 그때의 승격이 **셸 export로만 살아 있다 사라졌고 파일에도 pm2 dump에도 안 남았다.**
→ 기록을 믿지 말고 서버 실물을 봐야 한다는 사례가 하나 더 쌓였다.

## 바꾼 것
`/home/bitnami/apps/nblog-saas/shared/.env.production` (백업 `.bak-20260813-*` 남김)

| 변수 | 전 | 후 |
|---|---|---|
| `AGENT_RELEASE_VERSION` | 0.1.9 | **0.1.12** |
| `AGENT_RELEASE_URL` | …setup-0.1.9.exe | **…setup-0.1.12.exe** |
| `AGENT_RELEASE_SHA256` | d6b66b3e… | **8ca86d92…8388a** |
| `AGENT_RELEASE_SIGNED` | false | false (그대로) |

절차는 deploy/README.md의 3단계 그대로: 파일 수정 → `set -a; . shared/.env.production; set +a`
→ `pm2 restart nblog-saas --update-env` → **`pm2 save`** + dump 600.

0.1.12 exe는 이미 서버에 있었다(08-13 03:12 업로드). 로컬 빌드 산출물
`agent/release/nblog-agent-setup-0.1.12.exe`와 서버 실물의 sha256이 같음을 대조해
**같은 빌드**임을 확인하고 그 값을 환경변수에 박았다 — 별도 재빌드·재업로드는 안 했다.

## 확인한 것 (전부 실측)
- 세 군데 모두 0.1.12: `.env.production` · `pm2 env` · `~/.pm2/dump.pm2`
  (마지막 것이 재부팅 내성. 이번에 새로 발견된 함정이라 체크리스트에 넣었다.)
- `GET /api/agent/v1/release/latest` → `version: 0.1.12` + 서버 실물과 같은 sha256
- `GET /api/agent/v1/release/download` → 302 → 0.1.12 exe (공식 다운로드 버튼 경로)
- 직접 URL 익명 접근 200, 크기 102,813,271 B 일치 (Apache가 직접 서빙, Node 안 거침)
- **클라이언트 판정을 라이브 서버로 실행**: `0.1.9` → `update` / `0.1.11` → `update` /
  `0.1.12` → `latest`. 즉 구버전 사용자에겐 업데이트 알림이 뜨고 0.1.12는 최신으로 뜬다.

판정 주체는 서버가 아니라 **에이전트**다. `agent/src/main/release.ts`가 `/release/latest`를
긁어 `compareVersions(자기버전, 서버버전) < 0`일 때만 알림을 띄운다. 마디별 정수 비교라
`0.1.9 < 0.1.12`가 성립한다(문자열 비교였으면 "0.1.9가 더 최신"으로 뒤집혔을 자리).
heartbeat가 `UPDATE_AVAILABLE`을 밀어주는 건 아니다.

## 남는 것
- 0.1.10 · 0.1.11은 파일만 남기고 포인터는 안 걸린 테스트 버전. **옛 exe는 지우지 말 것**
  (아직 업데이트 안 한 에이전트가 그 주소를 물고 있다).
- 현장 에이전트가 실제로 0.1.12로 갈아타는지는 각 PC에서 알림을 눌러야 확인된다 — 다음 점검 항목.
