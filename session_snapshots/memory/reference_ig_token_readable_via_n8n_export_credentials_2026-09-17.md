---
name: reference_ig_token_readable_via_n8n_export_credentials_2026-09-17
description: 인스타 Graph API 재조회에 필요한 토큰은 n8n CLI의 export:credentials --decrypted 로 컨테이너 안에서 꺼낸다 — 호스트엔 평문 사본이 없다
metadata: 
  node_type: memory
  type: reference
  originSessionId: d8ca3303-d389-4de8-95d9-62591d76ae69
  modified: 2026-09-16T23:51:26.693Z
---

매일 08:20 인스타 확인 예약은 *"캐시·성공로그 안 믿고 Graph API 재조회 값으로만 판정"* 을 요구하는데, 토큰을 어디서 읽는지가 적혀 있지 않아 **한 번 "못 한다"로 넘어갈 뻔했다**(2026-09-17). 방법은 있다.

**막다른 길 (다시 시도하지 말 것)**
- 호스트 `.env` 후보 4곳(`saju-studio/.env(.local)`, `moa-studio/.env`, `.moa/.env`)에 IG 토큰 **없음**.
- n8n 컨테이너에 `sqlite3` 명령 **없음**. DB는 `/home/node/.n8n/database.sqlite`(SQLite)다.
- 컨테이너 안 `require("better-sqlite3")` 실패. `require("sqlite3")` 는 되지만 **콜백 API**다(`new sqlite3.Database(path, sqlite3.OPEN_READONLY, cb)` — `new D(...)` 생성자 형태로 쓰면 `D is not a constructor`).

**되는 방법**

```
docker exec n8n sh -c '
  TMP=/tmp/.c$$.json
  n8n export:credentials --id=VCULFgF3wJiZOpmu --decrypted --output=$TMP >/dev/null 2>&1
  node -e "<여기서 JSON 읽어 토큰 꺼내 fetch, 결과만 출력>" $TMP
  rm -f $TMP
'
```

- 자격증명 `VCULFgF3wJiZOpmu` = `IG Graph Token (ksaju.daily) - new`, type `httpQueryAuth`, 필드는 `["name","value"]` — 토큰은 `data.value`(2026-09-17 기준 길이 208).
- ★**토큰을 stdout 으로 내보내지 말 것.** node 안에서 바로 `fetch` 에 넣고 **응답만 출력**한다. 임시 파일은 반드시 `rm -f`. 채팅·로그·메모리·vault·git 어디에도 값을 남기지 않는다.

**판정 쿼리**: `https://graph.facebook.com/v26.0/17841416122910487/media?fields=id,timestamp,permalink&limit=3&access_token=<토큰>`
- 반환 `timestamp` 는 **UTC**다. `2026-09-16T23:01:12+0000` = KST `2026-09-17 08:01:12` — **하루 차이로 오판하기 쉬우니 +9시간 환산 후 날짜를 볼 것.**
- 2026-09-17 실측: `https://www.instagram.com/p/DdXaroRk_Ct/` (id `18165699475426009`), 09-16·09-15 것도 같이 나와 사흘 연속 정상.

**같이 보는 것**: 하루 성공1+실패2가 정상 패턴 [[reference_ksaju_ig_daily_two_failed_execs_2026-09-10]]. 실패 2건은 카드가 나간 뒤의 중복 갈래이므로 **재발행하지 않는다.** 토큰 만료 관리는 [[feedback_check_token_lifetime_before_declaring_fixed_2026-09-02]].

**★2026-09-22 함정 — 응답 원문을 그대로 찍으면 토큰이 샌다.** Graph 응답의 `paging.next` URL 안에 `access_token=` 이 통째로 들어 있다. 09-22 08:50 `console.log(x)` 로 원문을 찍었다가 토큰이 세션 출력(도구 결과)에 노출됐다(디스코드·로그·파일엔 안 나감). 
→ 반드시 `JSON.parse(x).data.map(m=>[m.id,m.timestamp,m.permalink])` 처럼 **data 만** 골라 출력할 것. 에러면 `error.message` 만.
또 컨테이너 node 에서 `require("sqlite3")` 가 09-22엔 `Cannot find module` — 09-17 "sqlite3 는 된다" 기록은 지금은 틀림.
