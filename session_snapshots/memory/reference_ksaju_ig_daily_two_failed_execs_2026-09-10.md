---
name: reference_ksaju_ig_daily_two_failed_execs_2026-09-10
description: "ksajuCarouselV5는 매일 성공1+실패2로 끝난다 — 카드는 정상 게시되지만 \"실패했나\" 감시가 상시 참이라 진짜 고장을 못 가린다"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 37a8aeb1-f9b4-4175-a543-f58669819be4
  modified: 2026-09-13T23:52:25.820Z
---

**ksajuCarouselV5(@ksaju.daily) 하루 실행은 항상 3건이고 그중 2건이 실패한다.**

[확인: 2026-09-10 08:2x, `docker exec n8n` 으로 `n8nEventLog*.log` 의 `n8n.workflow.success|failed` 직접 집계]

```text
09-09   exec 360 success   /  exec 362 FAILED · exec 363 FAILED
09-10   exec 367 success   /  exec 369 FAILED · exec 370 FAILED
```

- 실패 노드는 이틀 다 동일: `Create Carousel Container1` / `Create Carousel Container2`, 오류 `Bad request - please check your parameters`.
- **결과물엔 지장 없다** — 성공 갈래가 매일 08:01 KST 에 캐러셀을 정상 게시한다
  (09-06~09-10 5일 연속 08:01, 예: `https://www.instagram.com/p/DdFZHk-kqGT/`).
- ★**위험은 감시 쪽이다.** "워크플로 실패했나?"로 판정하면 **매일 무조건 참**이라
  진짜 고장(09-04 같은 건)이 나도 구분이 안 된다. 판정은 반드시 **IG Graph API 재조회**로 할 것.
- 09-04 형이 자격증명 통일하라고 하신 그 노드 두 개와 같은 자리다([[project_ksaju_ig_carousel_token_root_cause_2026-09-02]]).
  09-10 현재 미수리, 형 판단 대기.

## 토큰은 어디서 읽나 (중요)

- ❌ `C:\Users\user\.moa\ig_token.txt` — **낡았다. 38자짜리라 `OAuthException 190`(Cannot parse access token)로 죽는다**
  [확인: 09-10 직접 호출]. `ig_token_refresh.*` 도 이 낡은 값을 갱신 대상으로 본다.
- ✅ 살아있는 토큰(208자)은 **n8n 자격증명 `VCULFgF3wJiZOpmu`("IG Graph Token (ksaju.daily) - new", httpQueryAuth)** 에 있다.
  읽는 법: `docker exec -e N8N_RUNNERS_BROKER_PORT=5680 n8n n8n export:credentials --id=VCULFgF3wJiZOpmu --decrypted --output=/tmp/cred.json`
  → 컨테이너 안에서 node 로 읽어 그대로 호출하고, **끝나면 `/tmp/cred.json` 을 반드시 지운다.** 값은 채팅·로그에 절대 안 낸다.
- ★**Git Bash에서 돌리면 `/tmp/cred.json`이 `C:/Users/user/AppData/Local/Temp/cred.json`으로 바뀌어 export가 조용히 실패한다**(명령 exit 0, 파일 없음 — 2026-09-14 실측). 명령 앞에 `export MSYS_NO_PATHCONV=1;` 필수.
- 09-14 08:01 KST 게시 복구 확인(`DdPsS0LEmg5`, exec 397 success). 09-12·09-13 결번은 그대로.
- 컨테이너에 `sqlite3` 가 없으므로 `execution_entity` 직접 조회는 안 된다 — `n8nEventLog*.log` 를 쓴다.

**★09-12·09-13 본 갈래도 실패 — 인스타 이틀 결번**: exec 381(09-12)·389(09-13) 모두 `Collect Children` 에서 "자식 컨테이너가 5개가 아니다(4개) — 게시 중단". IG API 재조회 최신 게시물 = 09-11 08:01 KST(`DdH96RAEp2e`). 5장 card-jpeg 주소는 09-13 08:4x 전부 200(2.3~4.0초). 빠진 장·원인 미확인(execution_data는 flatted 형식이라 정규식으로 못 뽑음). 수동 재실행 결재 REQ-20260913-IG001-01 대기. ★09-13 04:17 스냅샷의 "09-10~09-12 사흘 배달"은 틀렸다 — IG timestamp가 UTC(23:01Z=다음날 08:01 KST)라 날짜를 하루 밀려 읽은 것으로 보인다. **IG timestamp는 반드시 KST로 변환해 판정할 것.**

## ★2026-09-20 — 같은 "4개" 고장 3번째. 그리고 내가 또 속을 뻔한 자리

[확인: 09-20 08:5x `n8nEventLog*.log` 직접 집계 + Graph API 재조회]

```text
09-19   exec 432 success  /  434 FAILED · 435 FAILED      <- 정상 패턴
09-20   exec 439 FAILED   /  441 FAILED · 443 FAILED      <- 성공 0건, 결번
```

- 439 실패 사유가 **`Collect Children`에서 "자식 컨테이너가 5개가 아니다(4개) — 게시 중단"** — **09-12·09-13과 똑같다. 세 번째다.**
  `Get IG User ID`는 통과했으니 09-04 자격증명 건과는 다르다. `Create Child Container`가 17초 걸려 4개만 반환했다.
- Graph 재조회 최신 = **09-19 08:01 KST**. 09-14~09-19은 정상 게시됐다가 오늘 다시 터진 것 — **간헐 재발**이지 단발 장애가 아니다.
- **09-13에 올린 결재 `REQ-20260913-IG001-01`이 아직 살아 있다.** 오늘 `REQ-20260920-IG-01`을 새로 올렸는데,
  **같은 고장에 결재만 두 장이 된 셈**이다. 다음엔 새 번호 붙이기 전에 이 파일부터 펴서 기존 건에 이어붙일 것.

### ★★판정할 때 반드시 성공 건을 따로 셀 것

이 파일 윗부분의 *"매일 실패 2건은 정상"* 을 읽고 **오늘 실패 2건을 보고 정상이라 넘길 뻔했다.**
실패 건수는 정상일 때도 비정상일 때도 2건 이상이라 **판별력이 없다.**
→ `n8n.workflow.success` 를 **따로 세서 1건 이상인지** 보고, 그다음 Graph 재조회로 확정한다.
전날과 나란히 놓고 비교하면 바로 드러난다(위 표처럼).

### 자격증명 읽을 때 (2026-09-20 추가)

`export:credentials --decrypted --all` 로 **전체를 덤프하지 말 것** — 09-20에 그렇게 했다가
무관한 `github-blog-pat`(GitHub PAT) 값이 작업 화면에 그대로 찍혔다(형께 폐기·재발급 권고함).
**반드시 `--id=VCULFgF3wJiZOpmu` 로 하나만** 뽑는다.
또 이 명령의 stdout 첫 줄은 `Error tracking disabled...` 안내문이라 **JSON은 2번째 줄부터**다(그냥 파싱하면 깨진다).
