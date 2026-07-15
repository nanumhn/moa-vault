---
name: reference_n8n_ig_meta_block
description: "n8n 실행에러 sqlite 진단법 + Meta 개발자계정이 봇 자동포스팅을 \"비정상 활동\"으로 막는 패턴"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 3f32b718-db1f-4b50-bedb-291e648f024c
---

n8n 인스타 자동포스팅(워크플로우 `tarotDaily00002` "Daily Saju Tarot Card v4 IG Auto-Post")이 2026-06-22 실패. 원인 진단 + 재발방지 레퍼런스.

## 실행 에러 진단법 (n8n Docker, sqlite)
n8n 컨테이너엔 `sqlite3` CLI 없음. 번들된 sqlite3 드라이버로 node 직접 쿼리:
- 드라이버 경로: `/usr/local/lib/node_modules/n8n/node_modules/.pnpm/sqlite3@5.1.7/node_modules/sqlite3`
- DB: `/home/node/.n8n/database.sqlite` (OPEN_READONLY로 열기)
- 최근 실행: `execution_entity` (id, workflowId, status, startedAt) ⋈ `workflow_entity`(name)
- 에러 본문: `execution_data.data` — **flatted 포맷**(인덱스 참조). `.pnpm/flatted@*/node_modules/flatted`의 `parse()`로 풀어야 message/error 보임. raw substring 검색도 가능(OAuthException/fbtrace 등).
- 컨테이너 시간 UTC. KST = UTC+9.

## 근본 원인 (2026-06-22)
API 응답: `HTTP 400 OAuthException code 200 "API access blocked"` (endpoint `graph.instagram.com/v21.0/{ig_id}/media`, 노드 "IG Create Media Container"). Meta 개발자 대시보드: **"계정 확인이 필요합니다 — 개발자 계정에서 비정상적인 활동 감지, 액세스 권한 다시 얻으려면 확인 완료"**.
- 인스타 **계정**은 멀쩡(action block 아님). 막힌 건 Meta **개발자/앱 계정**.
- 트리거: 매일 정확히 같은 시각(08:00) 봇 포스팅 패턴 → Meta가 비정상 활동으로 자동 탐지.
- code 200 = 권한/접근 차단(190=토큰만료와 구분). 토큰은 살아있고 계정 확인(전화/신분)으로 복구.

## 복구 프로토콜 (계정확인→"기술적 문제" 무한루프일 때)
Meta 검증 루프는 악명 높은 버그. 정석은 **재시도 멈추고 안정화 후 대기**:
- ❌ [계정 확인] 연타 금지, 한 시간 내 기기/네트워크 바꾸기 금지 → 사기탐지가 더 조여 악화.
- ✅ 시크릿창+확장끔+집와이파이(VPN끔)에서 1회만 시도 → 또 실패하면 **약 48시간 대기**(자동 탐지 윈도우 리셋) → 재시도하면 사람 심사로 넘어가 풀림.
- cooldown 중엔 막힌 API를 더 두드리지 않게 워크플로우 **비활성화**: `docker exec n8n n8n unpublish:workflow --id=<id>` 후 **`docker restart n8n` 해야 실행중 프로세스에 적용**(DB만 바뀌고 메모리 스케줄은 재시작 전까지 살아있음). 복구되면 다시 publish.

## 재발 방지
자동포스팅 워크플로우는 **시각을 매일 ±랜덤 분으로 흔들고 간격을 사람처럼** 둘 것. 매일 동일 초/분 발화는 Meta·인스타 봇탐지에 걸림. [[project_n8n_viral_marketing]]

## ✅ 차단 해소 (2026-06-27)
형이 Meta 개발자 대시보드에서 **인증 몇 번 거쳐 차단 통과·접속 성공**(48시간 대기 없이 뚫림). [필수 조치] 탭 비어있음 = 완전 해소. 앱 `k-saju-auto`(앱 ID 1742447613421132, Daily Card) 토큰·설정 그대로 살아있음. 새 계정 만들 필요 없었음(기존 계정 그대로).
- **재활성 절차(진행 중)**: 워크플로우 `tarotDaily00002`는 여전히 OFF 유지. growth(나래)가 시각 랜덤화 준비 중(2026-06-27, 백그라운드). 켜기 전 ①시각 ±랜덤분 ②수동 테스트 1회 성공 확인 후에만 활성화(형 입회). 안 그러면 또 동일 차단.
- Meta 우회 빌드(데일리카드→디스코드 수동게시)는 차단 풀려서 일단 불필요(자동포스팅 복귀 우선). 재차단 시 우회로.

## 🚨 매분 cron 함정 (2026-06-27 나래 발견, 켜기 전 필수 교정)
`tarotDaily00002` 트리거 노드 이름은 "Every Day 08:00"인데 **실제 cronExpression = `* * * * *`(매분!)** 으로 저장돼 있음(과거 테스트 잔재). 이대로 켜면 1분마다 무한 포스팅 → 즉시 Meta 재차단. **처음 차단 원인이 이것일 가능성 큼.** 켜기 전 반드시 교정.
- 재활성 변경계획(OFF 유지한 채 n8n UI에서 적용, 형 입회 수동테스트 세션):
  - A) cron `* * * * *` → `0 8 * * *` (08:00 KST 하루 1회; 타임존 Asia/Seoul 이미 설정, blogAutoPost `10 8 * * *`로 cron=KST 해석 교차검증됨)
  - B) Wait 노드 "Random Delay" 추가: Minutes, `={{ Math.floor(Math.random()*91) }}`=0~90분 랜덤 → 매일 08:00~09:30 다른 분 발화
  - C) 스케줄 경로 [Every Day 08:00]→[Random Delay]→[Get Today's Saju]에만 지연 삽입. Manual Test는 직결 유지(테스트 즉시 실행)
- 수동 테스트: n8n UI(localhost:5678)에서 OFF 토글 유지한 채 "Manual Test" 노드 Test workflow → Send to Discord 초록불(카드 미리보기) → IG Publish Post 초록불(실게시 1장) 확인. 에러 시 code 190=토큰만료(갱신), code 200=앱/권한.
- ⚠️ n8n 라이브 DB 직접쓰기 금지(WAL 동시성 손상·메모리캐시 미반영·같은 DB의 활성 blogAutoPost 사고위험). UI 수정이 정석. sqlite 읽기는 WAL+SHM까지 복사해야 커밋 반영본 보임(첫 복사는 stale).
