---
name: reference_n8n_canvas_execution_status_can_be_stale_2026-09-01
description: n8n 워크플로 캔버스의 초록 체크마크는 최신 실행이 아니라 이전 실행 잔상일 수 있다 — 실제 실행결과는 SQLite DB에서 직접 조회
metadata: 
  node_type: memory
  type: reference
  originSessionId: 30c205d3-ae08-4f4d-8d44-4ee2f6209133
  modified: 2026-09-01T04:20:03.316Z
---

**2026-09-01 확인.** `blogAutoPost001`(케이사주 블로그) 수동 재실행 직후 캔버스 스크린샷에서 3개 attempt가 전부 "Alert: Publish Blocked"까지 도달한 것처럼 보였고, 이를 근거로 형께 "실행 완료, 3번 다 품질게이트 걸림"이라고 보고했는데 **오보였다**. 실제로는 "Real 08:10 Run?"이라는 IF 게이트(`$('Pick Today Topic').item.json.notify === true`일 때만 true)가 있어서, 수동/recovery 트리거는 `notify=false`라 Alert 노드도 GitHub Push 노드도 **아예 실행 안 됐다**. 디스코드에 알림이 안 온 것으로 교차검증해서 발견([[feedback_pinocchio_clo_dont_assert_without_checking]] 계열 — 화면에 보이는 체크마크만으로 "실행됐다"고 단정하면 안 됨).

## 원인
n8n 캔버스는 마지막으로 본 실행결과의 시각적 상태(체크마크·아이템 수)를 화면에 계속 띄워두는데, 스크린샷 도구 자체가 이 세션에서 반복적으로 타임아웃·캐시된 이미지를 반환하는 문제까지 겹쳐서([[reference_bridge_reads_screen_only_no_scrollback_2026-08-26]]와 유사한 "화면=사실 아님" 함정), 새로 트리거한 실행이 아직 안 끝났거나 다른 브랜치로 갔는데도 예전 실행의 잔상을 최신 결과로 오독하기 쉽다.

## 안전한 확인 방법 (실측, 브라우저 로그인 불필요)
n8n 컨테이너 안 SQLite DB를 직접 읽으면 브라우저 세션(로그인 만료 반복 문제, [[reference_...]] 없음/신규)과 무관하게 정확한 결과를 얻을 수 있다:

```bash
# 1. 최근 실행 목록 (execution_entity)
MSYS_NO_PATHCONV=1 docker exec n8n sh -c "cd /usr/local/lib/node_modules/n8n && node -e \"
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/home/node/.n8n/database.sqlite', sqlite3.OPEN_READONLY, ()=>{});
db.all('SELECT id, finished, mode, status, startedAt, stoppedAt FROM execution_entity WHERE workflowId = ? ORDER BY startedAt DESC LIMIT 5', ['<workflowId>'], (e,rows)=>console.log(JSON.stringify(rows,null,2)));
\""

# 2. 특정 실행의 전체 노드별 입출력(runData)은 execution_data.data 컬럼에 flatted 포맷으로 저장돼 있음
#    → sqlite3로 blob을 파일로 덤프 후, n8n이 내부적으로 쓰는 'flatted' 패키지로 언플래튼
#    (docker exec n8n node -e "... flatted.parse(raw) ...")
#    resultData.runData['<노드이름>'][마지막인덱스].data.main[브랜치][아이템].json 에 실제 출력 있음
```

핵심: `sqlite3` node 모듈은 `/usr/local/lib/node_modules/n8n/node_modules/sqlite3`에 있음(better-sqlite3 아님 — 처음에 그걸로 시도했다가 모듈 없음 에러 났었다). DB 경로는 `/home/node/.n8n/database.sqlite`.

## 적용
n8n 실행결과를 형께 보고하기 전에는, **화면 체크마크가 아니라** ①디스코드에 실제 알림이 왔는지 ②또는 위 SQLite 직접조회 중 최소 하나로 교차검증할 것. 특히 브라우저 로그인이 또 끊겼을 때 이 방법이 유용하다.
