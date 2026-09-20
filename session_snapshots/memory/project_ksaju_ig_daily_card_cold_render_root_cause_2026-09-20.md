---
name: project_ksaju_ig_daily_card_cold_render_root_cause_2026-09-20
description: "인스타 '자식 컨테이너 4개' 결번의 원인 확정 — 그날 첫 요청이 daily-card 콜드 렌더를 못 기다려 페북이 9004로 거부. 42건 전수조사로 확정, 수리는 Retry on Fail"
metadata:
  type: project
---

**09-12·09-13·09-20 세 번의 인스타 결번은 전부 같은 원인이고, 원인이 확정됐다.**

## 실제 오류 (exec 439 실행데이터 직접 조회)

```text
card: daily-card
400 "Only photo or video can be accepted as media type."
OAuthException code 9004 / subcode 2207052 / is_transient: false
error_user_title: "미디어 다운로드에 실패했습니다"
```

`Create Child Container` 가 5개 중 4개만 id를 반환 → `Collect Children` 의
`자식 컨테이너가 5개가 아니다(4개) — 게시 중단` 가드가 발행을 막는다. **가드는 제 일을 한 것이다.**

## ★42건 전수조사 결과 (2026-09-20)

[확인: 보관된 ksajuCarouselV5 실행 42건 전부 파싱]

```text
실패한 실행   3건 (exec 381=09-12 · 389=09-13 · 439=09-20)
실패한 카드   3건 모두 daily-card, 3건 모두 1번째 항목
나머지 4종    hook·keyword·action·cta 는 42건 내내 실패 0건
```

**결정적 증거**: 실패한 3일 모두 **바로 뒤 형제 실행**(383·385 / 391·393 / 441·443)이
**같은 daily-card로 5/5 성공**했다. → daily-card 자체가 망가진 게 아니라 **그날 첫 요청만** 실패한다.

**원인**: 그날 처음 만들어지는 카드라 k-saju.me가 새로 렌더해야 하는데, 끝나기 전에 페이스북이
가져가려다 이미지가 아닌 응답을 받아 9004로 거부한다. 노드가 **17.3초** 걸린 것도 이걸로 설명된다.

**반증조건**: daily-card가 **아닌** 카드가 실패하거나, 그날 첫 실행이 아닌데 실패하면 이 결론은 틀렸다.

**미분리**: daily-card가 *1번째라서* 인지 *daily-card라서* 인지는 못 갈랐다 — 항상 1번째라 둘이 붙어 있다.
순서를 바꿔 한 번 돌리면 갈린다.

## 수리안 (형 결재 대기)

`Create Child Container` 노드에 **Retry on Fail (2~3회, 5초 간격)**. 20초 뒤엔 된다는 게 실측이라
**3번 다 이걸로 막혔을 것**이다. 보강안: 워크플로 맨 앞에 daily-card URL을 한 번 불러 캐시를 데우는 노드.

## ★★execution_data 는 읽을 수 있다 (09-13에 못 읽는다고 적은 건 틀렸다)

09-13에 *"flatted 형식이라 정규식으로 못 뽑음"* 이라 적고 포기했는데, **정규식이 아니라
flatted 규칙대로 역직렬화하면 그냥 읽힌다.** 이게 이번에 원인을 잡은 열쇠였다.

```python
def unflat(arr):            # arr = json.loads(execution_data.data)
    seen={}
    def rec(i):
        if i in seen: return seen[i]
        v=arr[i]
        if isinstance(v,list):
            out=[]; seen[i]=out
            for x in v: out.append(rec(int(x)) if isinstance(x,str) and x.lstrip('-').isdigit() else x)
            return out
        if isinstance(v,dict):
            out={}; seen[i]=out
            for k,x in v.items(): out[k]=rec(int(x)) if isinstance(x,str) and x.lstrip('-').isdigit() else x
            return out
        seen[i]=v; return v
    return rec(0)
# root["resultData"]["runData"]["<노드명>"][run]["data"]["main"][branch][item]["json"]
```

- DB는 `docker cp` 로 꺼내되 **`database.sqlite-wal`·`-shm` 까지 같이** 복사해야 최신 실행이 보인다
  ([[reference_n8n_sqlite_wal_must_be_copied_2026-09-18]]).
- 컨테이너 안엔 `sqlite3` 가 없지만, **호스트 파이썬 `sqlite3` 로 읽으면 된다.**

## 깨진 가설 2개 (같은 자리 다시 파지 말 것)

- ❌ "슬라이드 이미지 1장이 일시적으로 안 열렸다" — 09-13에 5장 전부 200을 확인하고도 4개였다.
- ❌ "디스코드 프록시 URL(`images-ext-1.discordapp.net`)을 페북에 줘서 실패한다" —
  **성공한 날(418·425·432)도 똑같이 프록시 URL을 쓴다.** 프록시는 범인이 아니다.

관련: [[reference_ksaju_ig_daily_two_failed_execs_2026-09-10]] · [[feedback_find_counterexample_first]]
