# 네이버 블로그 자동화 SaaS — 페이즈1 설계 (화면 · DB 스키마 · 인터페이스 스펙)

작성: 윤서진(CTO) · 2026-08-08 · **rev9 (qa-lead-jian 8차 검수 FAIL 반영 — 문서 서술만 수정)**
선행 결정문서: [[2026-08-08_naver_blog_saas_plan]] (형 결재 완료 · 노선 ㉡ 사용자 PC 설치형 확정)
상태: **페이즈1 완료(10라운드 검수 PASS) · 형 결재 완료 2026-08-08 → 페이즈2(개발) 진행 중**

> **[페이즈2 진행 표시 2026-08-08]** 2-4의 마지막 남은 **[미검증]**(제약 9개 실제 실행)이 **해소됐다.** 실행 결과·실측 발견 3건·뮤테이션 검증은 **2-4 절 안**에 기록했다. 구현 레포는 `D:\Develop\nblog-saas`(포트 3002).

> 결정문서 관례를 따라 전문용어에는 괄호로 짧은 한글 설명을 붙였다.

---

## rev9 변경 이력 (8차 검수 지적 4건 — 전부 문서 서술)

8차에서 **`SL4-SWEEP` 가드축 수정이 8,704개 상태 전수탐색으로 통과**했고, 하네스 엔진부가 원본과 바이트 동일임도 확인됐다. **그래서 rev9는 SQL·로직을 한 글자도 건드리지 않았다**(전수탐색 통과분에 손대면 회귀 위험만 있다). 고친 것은 문서 서술 4곳뿐이다.

| # | 지적 | 처리 |
|---|---|---|
| ① | `F6` 개수 자기모순 — 1050줄은 "9종"인데 **유일한 원본**인 1503줄은 "5종"(항목은 ①~⑨). 하필 "항목 원문은 8장 한 곳에만 두고 참조만 한다"는 장치를 세워놓고 그 원본이 틀렸다 | 원본을 **"슬롯 생명주기 9종"**으로 정정 |
| ② | **"194·819줄 둘 다 정정"이 거짓 — 1건만 고침.** 819줄(현 834줄) 문말이 "제약 7이 없으면 성립하지 않았다"로 남아, 방금 고친 209줄과 **한 주장이 두 번호로 갈림**(고치면서 모순이 하나 늘었다) | 834줄도 **제약 8**로 정정 |
| ③ | **D-0에서 세운 하네스 고지 규칙을 같은 제출물에서 재위반.** D-1에 "변경분 단 1곳"이라 썼지만 실제 diff는 헝크 3개이고 시나리오 드라이버가 전면 재작성됨(미고지 4건) | D-1을 **"엔진 1곳 + 드라이버 4건 + 헤더 주석"**으로 재작성하고 4건을 표로 전부 열거. **`diff` 원문을 D-1-1에 그대로 첨부.** 스크립트 상단 주석의 "단 1곳" 표기도 정정 |
| ④ | 913줄이 "4개 시나리오 + 추가 2개를 **rev7** 규범으로 재실행"인데 부록 D는 이제 rev8 규범 4종 | 현행에 맞게 갱신 |

> **패턴 자백**: ③은 **D-0에서 이 실수를 인정하고 재발 방지 규칙을 세운 바로 그 문서 안에서 같은 실수를 반복**한 것이다. 원인은 두 번 다 같다 — **`diff`를 뜨지 않고 "내가 바꾸려던 것"을 기억으로 적었다.** 규칙을 문장으로 적는 것만으로는 안 고쳐진다는 게 증명됐으므로, 절차를 바꾼다: **① 스크립트 제출 전 `diff` 먼저 실행 → ② 그 출력을 붙여넣고 → ③ 그걸 보면서 변경분 표를 작성**한다. 순서를 뒤집지 않는다.

---

## rev8 변경 이력 (7차 검수 지적 4건)

7차에서 6차 지적(`INV5`·`SL4-SWEEP`·트리거 재정의·대안② 미채택 논거)은 전부 통과했다. 이번 지적은 **새 결함 1건 + 내 "증명" 서술의 신뢰성 문제 2건 + 문구 2곳**이다. **신뢰성 문제를 가장 무겁게 받는다.**

| # | 지적 | 처리 |
|---|---|---|
| **중대1** | `SL4-SWEEP`이 **자기가 고치려던 상황에서 막힘**. 3번째 `NOT EXISTS`(ACTIVE 잡 0건)와 `SL2`의 `consumedAt IS NULL`이 서로를 막아, 사용자가 재시도 버튼을 누르면 `QUEUED` 잡이 생기며 스윕이 정지 → 복구가 1분이 아니라 **최대 `SLOT_TTL` 3시간**. 1004줄 "1분 안에 자동으로 낫는다"가 거짓 | **가드축 교체.** 조건 ①이 이미 "발행 흔적 0건"을 보장하므로 지킬 대상은 `ACTIVE` 잡이 아니라 **살아있는 남의 예약**이다. `SL4`와 **같은 소유권 축**으로 통일(검수 제시 SQL 채택). 회귀테스트 **`F6-⑨`** 신설(`F6-⑦`은 깨끗한 상태만 봐서 못 잡음). 검수 하네스로 복구 확인: `t=1m SWEEP rows=1 → INV4=OK → R claim rows=1` |
| **중대2** | **"시나리오는 원본 그대로"라는 내 서술이 거짓**. 실제로는 시나리오 4의 트리거 판정 술어를 무조건 실행으로 치환했음 | **인정.** 부록 D에 **D-0(사실과 달랐던 서술)** 절을 신설해 명시하고, **하네스 고지 규칙**을 문서에 고정 — 검수자 스크립트를 고쳐 제출할 땐 `diff`로 변경분을 빠짐없이 열거하고, "원본 그대로"는 `diff`가 빌 때만 쓴다. rev8 하네스(`rev8_check.js`)의 변경분은 **1곳뿐**임을 diff 블록으로 제시 — **⚠️ 이 "1곳뿐"은 거짓이었다(8차 반려 ③ → D-1 참조)** |
| **중대3** | 부록 D 1행 "동일(통과 유지)"도 거짓 — 그 시나리오의 초기 상태는 **제약 9 하에서 구성 불가**이고, 출력 1행이 `res=-/-`였는데도 통과로 보고 | **인정.** 제약 9에 맞는 셋업(`A`가 `TERMINAL`이 된 뒤 `B` 투입)으로 **재작성**하고 raw 출력으로 대체(부록 D-3) |
| 경미 | 제약 번호 전수갱신 미완 2곳(194·819줄) — 한 문장 안에서 자기모순 | 둘 다 **제약 8**로 정정. 47·76·79줄은 rev4/rev5 이력이라 당시 번호 유지 |

> **가장 아프게 받은 지적**: 6·7차 연속으로 **결론은 맞았는데 근거 서술이 부정확**했다. 특히 이번엔 "안 바꿨다"고 적은 것이라 성격이 다르다. 결론이 우연히 맞았다는 사실이 서술의 부정직을 면제해주지 않는다. 위 하네스 고지 규칙을 이후 모든 검증 제출에 적용한다.

---

## rev7 변경 이력 (6차 검수 지적 5건)

6차 지적의 공통 원인은 **"`SL4`에만 가드를 달아서 그 앞단(`SL2`·`SL3`)과 비대칭이 생긴 것"**이었다. 이번엔 **선언 대신 실행으로 증명**했다 — 검수가 준 스크립트를 그대로 돌려 실패를 재현하고, 규범을 고친 뒤 재실행해 부록 D에 결과를 붙였다.

| # | 지적 | 처리 |
|---|---|---|
| **중대1** | rev6의 "조합 불가" 논거가 **반증됨**. 순서를 뒤집으면(`예약 만료 → B가 자리 인수 → 그 다음 A의 R1-a가 consumedAt 세팅`) 조합이 실재하고, `R1-c`가 가드에 막혀 **`INV4` 파괴 · 자리 영구 소각**(4차 치명 재발). ⓙ 경로로도 재현 | **`INV5` 신설**(한 슬롯에 `ACTIVE` 잡 최대 1건) → `SL2`에 활성잡 배타 `NOT EXISTS` 추가 + **DB 제약 9**(부분 유니크). 근본원인은 "예약 만료 = 잡 종료"라는 혼동이었다. 추가로 **`SL4-SWEEP` 재구동 경로 신설**(`job-reaper` 매분 자가복구, `integrity-check`는 탐지→**복구**까지) + 회귀테스트 `F6-⑥⑦`. 검수 대안 ②(`SL3`에 소유권 가드)는 **채택하지 않음** — 조건부로 `consumedAt`을 안 찍으면 그게 곧 `INV4` 파괴라 병을 병으로 바꾸는 셈 |
| **중대2** | 단일화한 트리거 문언이 **`R1-c` 자체를 배제**. `UNVERIFIED`가 이미 `TERMINAL`이라 `R1-a`에서 1회 소진 → `UNVERIFIED→FAILED`는 "전이"도 아니고 횟수도 없음 → `SL4` 미실행 → 자리 영구 소각. 게다가 트리거 모델이 문서에 3중 잔존 | **"정확히 1회" 삭제.** 트리거를 **조건 기반**으로 재정의 — ⓧ `TERMINAL` **안으로 들어가거나 그 내부에서 이동** ⓨ `publishAttemptAt` **세팅/해제** ⓩ **주기 스윕**, 그리고 **멱등**. `SL4` SQL 주석·`job-reaper`·`integrity-check` 행을 그 정의에 통일 |
| 경미① | `reservedByJobId` NOT NULL인데 `reservedUntil` NULL이면 가드 3개 disjunct가 전부 UNKNOWN → 영구 no-op | **CHECK 제약 7 신설**(두 컬럼 동시 NULL 또는 동시 NOT NULL). 제약 번호가 밀려 **"제약 7"→"제약 8"** 표기를 전수 갱신하고 총 개수를 **9개(CHECK 7 + 부분 유니크 2)** 로 정정 |
| 경미② | `consumedByJobId` 정합성 불변식 부재 → 감사추적이 엉뚱한 잡을 가리킴 | `INV4`를 확장해 **`consumedByJobId` = 실제 발행한 그 잡(`INV2`에 의해 유일)** 을 포함. `SL3` 문안에도 명시 |
| 경미③ | 경계 `reservedUntil = now()`에서 `SL2`·`SL4` 양쪽 다 "살아있음"으로 봐 교착 | 양쪽 모두 **`<= now()`** 로 통일 |

---

## rev6 변경 이력 (5차 검수 지적 6건 — 치명 0)

5차에서 `INV4` 기전은 통과. 남은 것은 **동시성 가드 1건 + 임계값 불일치 1건 + 문구 정정 4건**이었다. 검수 권고대로 지목된 토큰(`reservedByJobId`/`reservedUntil`, `DF4`/임계값, `S1`/`SL2`, `D3`/`DF3`)이 나오는 줄을 **전부 펼쳐 일괄 처리**했다.

| # | 지적 | 처리 |
|---|---|---|
| **중대1** | `SL4` SQL에 **예약 소유권 가드가 없어** `job-reaper`가 종료된 잡 A로 `SL4`를 재실행하면 진행 중인 잡 B의 살아있는 예약이 지워지고 → 자리 FREE 오인 → 잡 C가 `SL2` 통과 → **같은 자리 동시 발행**. 게다가 산문이 트리거를 이중 정의(“`publishAttemptAt`이 NULL이 되는 트랜잭션” vs “잡이 `TERMINAL`이고”)하는데 SQL은 둘 다 인코딩 안 함 | **가드 추가** `AND (reservedByJobId IS NULL OR = $jobId OR reservedUntil < now())`. **트리거를 "`TERMINAL` 전이 트랜잭션에서 정확히 1회"로 단일화**(이중 정의 제거). 가드가 정당한 해제를 막지 않는 이유(`SL2`가 `consumedAt IS NULL`을 요구하므로 그 조합이 발생 불가)도 명시. 회귀테스트 `F6-④` 추가 |
| **중대2** | `DF4` 임계가 세 곳에서 불일치 — 규범 "4를 넘으면"(=5) / 스키마주석 "4 초과"(=5) / `F7` "4에서"(=4). 구현대로 짜면 `F7`이 무조건 실패. "만 이틀 무발행"은 정확히 4슬롯이라 `>4`는 자기 근거와도 모순 | **세 곳 모두 `>= 4`로 통일.** `F7`에 "3에서는 안 뜨는 것" 확인도 추가 |
| 경미1 | 774줄 문장 뒤쪽 "그 자체가 **S1**에 구멍" (지금 S1은 화면이라 말이 안 됨) | `SL2`로 정정 |
| 경미2 | 598줄 "(3-A 규칙 **D3**)" — 3-A에 D3 없음, 결함 [D3]과 충돌 | `DF3`으로 정정 |
| 경미3 | 개수표기 5라운드 연속 재발 — 937줄 제목 "DF1~DF3"(표엔 DF4 존재) / 36줄 "DF1~DF3" / 935줄 "회귀테스트 2개" vs 변경이력 3개 vs `F6` 실제 항목 수 | 제목·목록 **`DF1`~`DF4`**, `F6`은 실제 항목 수에 맞춰 **5종**으로 통일하고 본문 참조도 일치시킴 |
| 경미4 | 610줄 `SL3` 경로가 "두 개"인데 실제 세 번째 경로(**이벤트 유실 → `/result`만 도착 시 보정 기록**)가 존재. 열거만 보고 구현하면 그 경로에서 `consumedAt` 미설정 → `INV4` 파괴 → 자리 FREE 오인 | `SL3`에 **세 경로(ⓘⓙⓚ) 전부 열거** + ⓙ 누락 시 위험 명시. 회귀테스트 `F6-⑤` 추가 |

---

## rev5 변경 이력 (4차 검수 지적 8건)

4차 검수에서 3차 지적 8건은 전부 통과. 구조를 갈아엎다가 **좁지만 새로운 결함**이 생겼고, 그중 치명 1건은 **"내가 없앴다고 선언한 병(정의가 두 곳으로 갈라져 어긋남)이 3-A 안에서 재발"** 한 것이었다. 검수 권고대로 **`consumedAt`을 언급하는 모든 줄을 한 화면에 펼쳐 상호모순을 먼저 대조한 뒤** 고쳤다.

| # | 지적 | 처리 |
|---|---|---|
| **①** [치명] | `R1-c` 경로에서 `consumedAt`이 안 돌아가 **자리 영구 소각**(rev2 E2 부활). `SL4`는 "`consumedAt`은 애초에 안 찍혔으므로 손대지 않는다"인데 `R1-a`가 이미 찍은 뒤라 전제가 거짓 → 먹통 재시도 버튼 + 실제 발행 0건인데 "2회 다 씀" | **기전 신설.** `consumedAt`을 독립 상태값에서 빼고 **`INV4`(`consumedAt IS NOT NULL` ⟺ 그 슬롯에 `publishAttemptAt` 있는 잡 존재)의 파생값**으로 격하. `SL3`·`SL4`를 각자 규칙이 아니라 **둘 다 `INV4`를 유지하는 동작**으로 재정의 → 어느 경로로 `publishAttemptAt`이 생기거나 사라지든 자동으로 따라온다. `SL4` 해제 SQL 원문 추가 + 회귀테스트 3개(`F6`) |
| **②** [중대] | 143줄이 rev3 서술("수령 시점에 `consumedAt`") 그대로 — `SL3`와 정면 충돌, 철회된 "중복방어 더 강해진다"도 잔존 | 문단 **재작성**. 동시성=`SL2`(예약) / 쿼터=`SL3`+`INV4` / 최후방어=DB 제약 7로 역할을 갈라 적고 철회 사실 명시 |
| **③** [중대] | 747줄 "실시간예방은 규칙 S1(예약)" — S1은 생성, 예약은 S2 | `SL2`로 정정 |
| **④** [경미] | 519줄 "S1~S4" | `SL2~SL4`로 정정 |
| **⑤** [경미] | 회귀테스트의 `deferCount` 6 (4라운드 연속 개수오류) | `job.deferCount` 상한 **3** + `blog.consecutiveDeferredSlots` 8로 정정 |
| **⑥** [경미] | **ID 네임스페이스 3중 충돌**(규칙 S1~S5 vs 화면 S1~S11, 규칙 D1~D3 vs 결함 [D1]~[D9]) | 슬롯 규칙 → **`SL1`~`SL5`**, 지연 규칙 → **`DF1`~`DF4`** 로 분리 |
| **⑦** [경미] | `L1`·`L3`가 정의만 되고 참조 0회 → "19개 일치" 주장 재현 안 됨 | `L1`은 S8 화면에, `L3`은 2-4에 **실제 참조 추가**. "19개"의 산출근거는 아래에 밝힘 |
| **⑧** [경미] | `DF2`의 `SKIPPED` 분기가 카운터를 안 올려 **매 슬롯 SKIP되는 블로그가 영구 무경보** | **`DF4` 신설** — 발행 없이 끝난 슬롯을 세고 `>= 4`(=이틀 무발행)에서 경보+사용자 알림. `DF3`(감쇠 건전성·내부)과 `DF4`(무발행·고객영향)를 분리한 근거 기재 |
| 추가 | 5-3에 슬롯 생성 누락 | `slot-daily` cron 행 신설(`SL1` 수행) |

> **[⑦ 답] "19개 일치"의 산출근거**: 그 숫자는 내가 쓴 grep 정규식 `(G[12]|S[1-5]|R1-?[abc]?|D[123]|J[12]|INV[123])`이 매칭한 **토큰 19종**(G 2 + S 5 + R1계열 4 + D 3 + J 2 + INV 3)이 정의집합·참조집합에서 동일하다는 뜻이었고, **`L1`~`L4`는 애초에 그 정규식에 없었다.** "문서의 모든 규칙 ID가 참조된다"로 읽힐 수 있게 쓴 것은 과장이었다. rev5는 `L1`·`L3` 참조를 실제로 추가하고 검증 스크립트도 `L`계열을 포함하도록 고쳤다.

---

## rev4 변경 이력 (3차 검수 지적 8건 + 구조 재작성)

3차 검수의 진단이 정확했다: **"숫자·문구만 바꾸고 기전은 그대로인 동일 패턴", "E2가 whack-a-mole의 새 진원지"**. 3라운드 내내 같은 로직이 문서 여러 곳에 중복 서술돼 **한쪽만 고쳐지는 것**이 진짜 원인이었다.

### 구조 변경 (F0) — 이번 반려의 근본원인 제거
- **3장을 "규범 정의(3-A) / 근거(3-B) / 검증잡(3-C)"로 재작성.** 간격·쿼터·슬롯·재시도·지연흡수의 정의는 **3-A에만** 존재하고, 4·5·7·8장은 규칙 ID(`G1`·`G2` 게이트, `SL1`~`SL5` 슬롯, `R1` 리스만료, `DF1`~`DF4` 지연흡수, `J1`·`J2` 지터, `INV1`~`INV4` 불변식, `L1`~`L4` 방어층)를 **참조만** 한다.
- 중복 서술이던 **3-3(판정 SQL)·3-3-1(슬롯 규칙)을 삭제**하고 3-A로 흡수했다. 5-2의 "만료 후 재수령" 문구처럼 3-A와 충돌하던 문장도 제거.
- **CI 항목 신설(F0)**: 판정 SQL이 코드에 1곳에만 있는지, `L2`/`L4`가 같은 함수를 호출하는지, 3-A 밖에 판정 리터럴이 새로 생기지 않았는지 검사(8장).

### 개별 지적 처리

| # | 지적 | 처리 |
|---|---|---|
| **①** [치명] | `L2` 좌변은 고쳤는데 **3-3 판정 SQL은 `now()`인 채** 남아 100% SKIP 재생산 | 3-3 자체를 삭제하고 `G1`으로 단일화. **`G1` 내부에 `now()`가 없고 호출자가 `candidateRunAt`을 넘긴다**. `now()`를 넘기는 곳은 `L4` 하나 |
| **②** [치명] | `SKIPPED`가 자리 해제 목록에 없어 **자리 영구 소각** | `SL4`의 조건을 "`TERMINAL` ∧ `publishAttemptAt IS NULL`"로 정의하고 **`TERMINAL`에 `SKIPPED` 포함**을 명시. 예약(`reservedUntil`)과 소모(`consumedAt`)를 컬럼 수준에서 분리해 애초에 소각이 불가능하게 만듦 |
| **③** [치명] | "이미 점유돼 있으면" 판정 기준 미정의 → 재수령 죽거나 중복발행 | 두 가지를 동시에 답함: `SL2`에 `OR reservedByJobId = $jobId`(자기 잡 갱신 허용)를 명시하고, **`R1`으로 재수령 자체를 금지**. 리스 만료는 "결과 미상"으로 보고 검증 잡으로만 구제 → 중복발행 경로 소멸 |
| **④** [중대] | L3가 rev2보다 약해졌는데 문서가 안 밝힘 | 인정하고 **DB 제약 7(부분 유니크 인덱스) 신설** — "한 자리에 실제 발행 1건". `INV2 ∧ INV3 ⇒ 하루 실제 발행 ≤ 2`를 DB가 보장. 다만 이 제약이 **발행 후에** 터지는 사후 방어라는 점도 명시 |
| **⑤** [중대] | `deferCount` 상한 6이 여전히 죽은 방어 | per-job → **`Blog.consecutiveDeferredSlots`(블로그 단위 누적)**로 교체. 정시 발행 시 0 리셋, 8 초과 시 경보+자동 일시중지. 왜 per-job으로는 원리적으로 못 잡는지도 서술 |
| **⑥** [경미] | 9.94 vs 12.46 설명이 자기모순 + 산수 오류 | 재측정해 **원인이 2축(분모·실행지연)**임을 확인. 교차일+지연 19.74% / 교차일+지연0 **12.53%(=검수 수치)** / 양쪽평균+지연 **9.90%(=내 수치)**. 검산 19.74÷2=9.87 |
| **⑦** [경미] | 개수 표기 3라운드 연속 재발 | 2-4 자기 절 안의 "위 5개"·"CHECK 5개"까지 수정. 이번엔 **grep 전수 스캔 결과를 근거로** 제약 7개(CHECK 6 + 부분 유니크 1)로 정정 |
| **⑧** [경미] | 구스키마 잔존(`slotDate/slotIndex가 NULL`) + `PublishSlot` 생성주체·시점 미정의 | `slotId IS NULL`로 정정. **`SL1`에 생성 주체·시점 명시**(블로그 타임존 매일 00:05, `slot-planner`, `plannedAt`은 지터 적용 전) |

---

## rev3 변경 이력 (2차 검수 지적 5건 처리)

2차 검수에서 D2~D9는 통과. **D1이 층만 옮겨 살아있었고 신규 중대 2건**이 나왔다.

| # | 지적 | 처리 | 반영 위치 |
|---|---|---|---|
| **E1** | D1이 L4만 계산하고 **L2를 모델링 안 함**. 문서 문자 그대로면 100% SKIPPED. 게다가 3-1의 "12h"와 3-2 규칙B의 "11h15m"이 문서 내부에서 모순 | **수정** — 지적이 맞다. QA의 **100.00%를 그대로 재현**했다. 근본원인은 L2가 `now()`(예정 35분 전)를 기준으로 삼은 것. **L2·L4를 동일 임계(11h15m)·동일 컬럼(`publishAttemptAt`)·동일 술어로 통일**하되 L2의 좌변을 `now()`가 아니라 **잡의 예정 실행시각**으로 바꿔 리드타임 의존성 자체를 제거. 두 프레이밍 모두 **0.00%**, 리드타임 35·60분 무관 | 3-A, 3-B |
| **E2** | CHECK#2 + unique 조합 때문에 **MANUAL/RETRY 잡을 INSERT할 자리가 없음**(EXPIRED 후 수동발행이 unique violation) | **수정** — `PublishSlot` 테이블로 분리. 슬롯(하루 2개 상한)과 잡 시도(N회)를 1:N 정규화. 슬롯 예약을 **발행 전에** 잡으므로 중복 방어도 같이 강해짐 | 2-1, 2-2, 2-5 |
| **E3** | 지연흡수에 복귀규칙이 없어 예약시각이 **영구 이탈**(09:00→11:30 고착), `deferCount` 상한2는 절대 안 걸림 | **수정** — 재현 확인. 흡수 목표를 `직전+12h`(여유 0을 재생성하던 원인) → **`직전+11h20m`**로 바꾸니 **드리프트가 슬롯당 40분씩 감쇠**해 최대 4슬롯(2일) 안에 정시 복귀. 그 과정에서 하드룰은 한 번도 안 깨짐 | 3-A-6, 3-B-4 |
| **E4** | 변경이력 D3행 "CHECK 3개"인데 실제 5개 (D7과 같은 종류 실수 재발) | **수정** — 스크립트로 세어 **6개**로 정정(E2로 1개 증가). 문서의 모든 개수 표기를 grep으로 재검증 | 변경이력, 2-4 |
| **E5** | `skipReason` 값이 스키마 주석 4개 / 5-2장 5개로 불일치 | **수정** — **6개로 단일화**하고 2-5에서만 정의, 다른 곳은 참조만 | 2-2, 2-5, 5-2 |
| 권고 | 45분 허용오차는 수용 가능하나, 공통지터로 같은 날 간격이 12h로 **결정화**되는 부작용(지터 본래 목적=패턴 은닉과 역행)을 남길 것 | **반영** | 10장 |

---

## rev2 변경 이력 (1차 검수 지적 9건 처리)

| # | 지적 | 처리 | 반영 위치 |
|---|---|---|---|
| **D1** | 지터 ±10분 때문에 두 번째 발행의 50%가 조용히 SKIPPED | **수정** — 시뮬레이션으로 재현(49.86%) 후 3개 조치: 슬롯 간격 12h 고정 · 하루 공통 지터 · **실측 허용오차 45분** · 지연 흡수(deferral). 재시뮬 결과 위반 0.00% | 3-B |
| **D2** | 12시간을 어느 컬럼으로 재는지 미정의 → 중복발행 위험 | **수정** — 기준 컬럼 `publishAttemptAt` 신설·명시, 판정 SQL 원문 기재. `postedAt`/`finishedAt`은 쿼터 판정 사용 금지 명문화 | 3-A-3 |
| **D3** | L3(DB유니크)가 slotIndex=2를 못 막아 실제로 3중 | **수정** — Prisma가 CHECK 미지원임을 인정하고 초기 마이그레이션에 raw SQL CHECK 제약 추가(**rev3 기준 6개**, E4로 개수 정정). 잘못된 주석 삭제 | 2-4, 8장 |
| **D4** | VERIFY(검증) 잡이 모델·API에 없음 → 3-2·7장이 실행 불가 | **수정** — `JobKind` enum, `verifyTargetJobId` 자기참조, claim/result 스펙에 VERIFY 분기, 이벤트 4종 추가 | 2-3, 3-C, 5-2 |
| **D5** | 화면↔스키마 불일치 4건 | **수정** — `Blog.preferredAgentId` / 본문 스냅샷 3필드 / `Payment` 모델 / `User.role` 추가 | 2-3 |
| **D6** | 가격 확정을 페이즈2로 조용히 이월 | **수정** — 9장 #2를 "추천안"이 아니라 **"미이행 · 이월 승인 요청"**으로 표기 | 9장 |
| **D7** | 규모 표기 오류(테이블 12→15, 화면 11→13) | **수정** — 모델 16개(Payment 추가), 화면 13개로 정정 | 전역 |
| **D8** | claim 200 예시에 `skipped` 누락, 사유 저장 컬럼 없음 | **수정** — 예시 보강 + `PublishJob.skipReason` 추가 | 2-3, 5-2 |
| **D9** | 구글 OAuth 선택 시 refresh_token 평문 저장 | **수정** — 6장 보안표에 앱레벨 암호화 항목 추가 | 6장 |
| — | 자정경계 차단 주체를 L2로 잘못 기술 | **수정** — L2/L4가 각각 어느 타이밍을 담당하는지 정확히 재기술 | 3-1 |

---

## 0. 이 문서가 확정하는 것 / 확정하지 않는 것

| | 내용 |
|---|---|
| **확정(승인 대상)** | ① DB 스키마 **모델 17개** + raw SQL 제약 **10개**(CHECK 7 + 부분 유니크 인덱스 3 — 2026-08-08 `INV6` 추가) ② 웹 대시보드 **화면 13개** ③ PC 에이전트↔서버 인터페이스 **엔드포인트 7개** ④ 발행 제약(하루 2회·12시간) 강제 지점 4곳 + 근거 계산 |
| **확정 안 함(형 결재 필요, 9장)** | 요금 금액(**미이행·이월 승인 요청**) · 구글시트 연결 방식 · 에이전트 배포/코드서명 · 신규 레포/포트 |
| **범위 밖(절대 안 만듦)** | 사용자 네이버 아이디·비밀번호·세션쿠키의 서버 저장 (선행문서 5장) |
| 웹 배포(2026-08-08 형 승인) | **Vercel(호스팅) + Neon(PostgreSQL)** — saju-studio와 동일 패턴, 개발단계는 Neon 무료플랜 |

### 0-1. 설계를 관통하는 4개 원칙
1. **서버는 비밀을 모른다.** 네이버 인증정보는 사용자 PC 밖으로 나오지 않는다. 에이전트는 "로그인 되어 있음/없음"과 "블로그 ID"만 보고한다.
2. **발행 경로에 AI가 없다.** 본문은 발행 시점에 만드는 게 아니라 미리 시트/DB에 들어와 있다. 로컬 LLM이 죽어도 발행은 안 멈춘다.
3. **중복 발행은 실패보다 나쁘다.** "결과를 모르겠는 상태(UNVERIFIED)"는 자동 재시도하지 않고 검증 잡으로만 구제한다(3-C).
4. **하드 룰은 한 곳에 두지 않는다.** 하루 2회·12시간 제약은 UI·잡생성기·DB제약·수령시점 4중으로 막는다(3장).

---

## 1. 시스템 구성

```
[사용자 브라우저]
      │ NextAuth v5 세션
      ▼
[웹 대시보드 + API]  Next.js 16 (App Router)
      │                    ├─ /api/agent/v1/*        (에이전트 전용, Bearer 토큰)
      │                    └─ /api/internal/cron/*   (스케줄러, 시크릿 헤더)
      ▼
[PostgreSQL]  Prisma 6
      ▲                    ▲
      │                    │
[시트 동기화 워커]     [글감 생성 워커(업셀 전용)]
 Google Sheets API      로컬 LLM (LM Studio, 배치·비실시간)
                             │
                    (여기까지 서버 영역 — 네이버 접속 없음)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    (여기부터 사용자 PC — 네이버 접속 있음)
[PC 에이전트]  트레이 앱
   폴링으로 잡 수령 → 사용자 본인 크롬의 실제 네이버 세션으로 발행 → 결과 보고
```

- **경계선의 의미**: 네이버에 접속하는 코드는 전부 사용자 PC 안에만 있다. 우리 서버는 네이버와 통신하지 않는다. 선행문서 5장 보안원칙의 구조적 구현이다.
- 에이전트 기술 스택은 페이즈2 확정. 현재 유력안은 **트레이 앱(Tauri/Electron) + Playwright·CDP로 사용자 기본 크롬 프로필에 attach**.

---

## 2. DB 스키마

PostgreSQL + Prisma 6 (saju-studio와 동일 스택). 시각 컬럼은 전부 UTC 저장, 표시·쿼터 계산만 블로그별 타임존 적용.

### 2-1. 모델 17개

| 모델 | 역할 | 핵심 관계 |
|---|---|---|
| `User` | 사용자(테넌트) + **role(운영자 권한)** | 최상위 |
| `Account` / `Session` / `VerificationToken` | NextAuth v5 표준 | User 1:N |
| `Plan` | 요금제 정의(코드·쿼터) | 마스터 |
| `Subscription` | 사용자의 구독·애드온 | User 1:1 |
| **`Payment`** | **결제 이력(S10)** | User 1:N |
| `Blog` | 연결된 네이버 블로그 | **User 1:N (최대 3)** |
| `Agent` | 페어링된 PC | User 1:N |
| `PairingCode` | 1회용 페어링 코드 | User 1:N |
| `SheetSource` | 구글시트 연동 | Blog 1:1 |
| `ContentItem` | 글감(제목·본문) | Blog 1:N |
| `Schedule` | 예약 슬롯 **정의**(요일·시각) | **Blog 1:N (최대 2)** |
| **`PublishSlot`** | **하루치 발행 자리(쿼터 토큰). 하루 2개가 상한** | **Blog 1:N (하루 최대 2)** |
| `PublishJob` | 한 슬롯에 대한 **시도 1회** / 검증 잡 | **PublishSlot 1:N**, 자기참조 |
| `JobEvent` | 잡 단계 타임스탬프 로그 | PublishJob 1:N |
| `AuditEvent` | 계정·설정·페어링 변경 로그 | User 1:N |

**이벤트 테이블을 둘로 나눈 이유**: `JobEvent`는 잡 1건당 5~8행씩 쌓이는 고빈도·정형 로그라 `jobId` 하나로 빠르게 긁어야 한다. `AuditEvent`는 저빈도·비정형(보안 감사용)이다. 한 테이블에 섞으면 잡 타임라인 조회가 전체 스캔이 되고, 보존기간(잡 90일 / 감사 365일)도 따로 못 준다.

**[E2] 슬롯과 잡을 분리한 이유 (rev3 신규)**: rev2는 `PublishJob`에 `slotDate`·`slotIndex`를 직접 달고 거기에 유니크를 걸었다. 그 결과 **"하루 2회"가 "블로그·날짜당 잡 행 2개"로 잘못 표현**됐고, 슬롯0이 `EXPIRED`(PC 꺼짐)된 뒤 사용자가 수동 발행이나 재시도를 하면 **행이 이미 있어서 unique violation이 나 재시도 자체가 구조적으로 불가능**했다(2차 검수 지적 E2). 7장이 약속한 "실패 시 재시도·수동 발행" 선택지가 DB 레벨에서 막혀 있던 것이다.

rev3은 개념을 둘로 나눈다.
- **`PublishSlot` = 자리(쿼터).** `(blogId, slotDate, slotIndex)` 유니크 + `slotIndex ∈ {0,1}` → **하루 최대 2자리**. 이게 L3의 진짜 주체다.
- **`PublishJob` = 그 자리에 대한 시도.** 한 자리에 여러 번 시도(최초·재시도·수동 대체)가 매달릴 수 있다.

동시성 방어는 **예약(`reservedUntil`, 규칙 `SL2`)** 과 **`INV5`(한 자리에 ACTIVE 잡 최대 1건)** 가 함께 담당한다. 예약만으로는 부족하다 — 예약이 만료돼도 그 잡은 아직 살아있을 수 있고, rev6은 그 둘을 혼동해 자리 인수 구멍이 있었다(6차 반려 중대1). **소모(`consumedAt`, 규칙 `SL3`)는 이와 별개로 "발행 버튼을 실제로 누른 시점"에만 찍히고**, 그 값은 `INV4`에 의해 `publishAttemptAt`의 파생값으로만 존재한다.

> **[4차 반려·중대] 이 문단의 rev3 원문을 폐기했다.** 원문은 "`consumedAt`을 잡 수령 시점에 잡기 때문에 중복 방어가 더 강해진다"였는데, ① rev4의 `SL3`(발행 버튼 시점)와 정면 충돌하고 ② "더 강해진다"는 주장 자체를 2-4의 [F4] 문단에서 이미 철회했다(DB 제약 8이 없으면 성립하지 않는 주장이었다). 예약과 소모를 분리한 지금은 **동시성=`SL2`, 쿼터=`SL3`+`INV4`, 최후 방어=DB 제약 8**로 역할이 갈린다.

### 2-2. Prisma 스키마

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DATABASE_URL_UNPOOLED")
}

// ─────────────────────────── 사용자 / 인증 ───────────────────────────

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  emailVerified DateTime?
  timezone      String    @default("Asia/Seoul")

  // [D5] 운영자 콘솔(A1) 접근 권한. MEMBER는 /admin 라우트 진입 자체가 404
  role UserRole @default(MEMBER)

  notifyEmail     Boolean @default(true)
  notifyOnFailure Boolean @default(true)
  notifyOnOffline Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  accounts     Account[]
  sessions     Session[]
  subscription Subscription?
  payments     Payment[]
  blogs        Blog[]
  agents       Agent[]
  pairingCodes PairingCode[]
  auditEvents  AuditEvent[]
}

enum UserRole {
  MEMBER
  ADMIN
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  // [D9] 구글시트 연동을 OAuth로 갈 경우 이 두 컬럼에 구글 토큰이 들어온다.
  //      DB 평문 저장 금지 — 앱 레벨 AES-256-GCM 암호문만 저장(6장).
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ─────────────────────────── 요금제 / 구독 / 결제 ───────────────────────────

model Plan {
  code            String  @id            // "BASIC" | "PRO" ...
  name            String
  blogQuota       Int     @default(1)
  aiDraftIncluded Boolean @default(false)
  priceKrw        Int?                   // [미확정] 9장 #2 결재 전까지 null
  isActive        Boolean @default(true)
  sortOrder       Int     @default(0)

  subscriptions Subscription[]
}

model Subscription {
  id     String @id @default(cuid())
  userId String @unique
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  planCode String
  plan     Plan               @relation(fields: [planCode], references: [code])
  status   SubscriptionStatus @default(TRIALING)

  // ── 업셀 애드온 2종 (선행문서 3·7장) ──
  extraBlogSlots Int     @default(0)   // plan.blogQuota + 이 값 <= 3 (앱 + CHECK 제약)
  aiDraftEnabled Boolean @default(false)

  billingProvider        String?
  externalCustomerId     String?
  externalSubscriptionId String? @unique

  currentPeriodEnd DateTime?
  trialEndsAt      DateTime?
  canceledAt       DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([status])
}

enum SubscriptionStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELED
}

// [D5] S10 결제 이력 화면의 데이터 원천
model Payment {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  provider          String    // 결제 레일(페이즈2 확정)
  externalPaymentId String?   @unique
  amountKrw         Int
  status            PaymentStatus @default(PAID)
  paidAt            DateTime
  periodStart       DateTime?
  periodEnd         DateTime?
  receiptUrl        String?
  memo              String?

  createdAt DateTime @default(now())

  @@index([userId, paidAt])
}

enum PaymentStatus {
  PAID
  REFUNDED
  FAILED
}

// ─────────────────────────── 블로그 (1:N, 최대 3) ───────────────────────────

model Blog {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  naverBlogId String
  displayName String
  timezone    String     @default("Asia/Seoul")
  status      BlogStatus @default(PENDING_VERIFY)

  // 소유 증명: 서버가 확인할 방법이 없으므로 "그 PC의 네이버 로그인 세션이
  // 이 blogId를 소유한다"는 에이전트 보고로 갈음한다.
  // 에이전트가 삭제돼도 증명 이력은 남아야 하므로 관계가 아닌 값으로 보관.
  verifiedAt        DateTime?
  verifiedByAgentId String?

  // [D5] S6·7장 "선호 기기". null이면 아무 에이전트나 수령 가능.
  preferredAgentId String?
  preferredAgent   Agent?  @relation("PreferredAgent", fields: [preferredAgentId], references: [id], onDelete: SetNull)

  // [D1] 지터는 슬롯이 아니라 블로그 단위. 같은 날 두 슬롯에 동일 오프셋을
  //      적용해 같은 날 간격이 항상 정확히 12시간이 되게 만든다(3-A 규칙 J1).
  jitterSec Int @default(600)   // 상한 600 — 앱 + CHECK 제약

  // [F5] 규칙 DF3 — 지연 흡수가 연속 몇 슬롯째 걸렸나(감쇠 건전성, 내부 지표).
  //      정시 발행 시 0 리셋. 최악 드리프트에도 4를 안 넘으므로 8 초과는 버그 신호.
  //      per-job 카운터로는 체인 이상을 절대 못 잡는다(rev3의 죽은 방어) → 블로그 단위.
  consecutiveDeferredSlots Int @default(0)

  // 규칙 DF4 — 발행 없이 끝난 슬롯이 연속 몇 개인가(고객 영향 지표).
  //      DF3은 흡수에만 반응해서 "매번 SKIPPED되는 블로그"를 못 잡는다(4차 검수 발견).
  //      발행 성공 시 0 리셋. >= 4(= 하루 2슬롯 x 이틀 무발행)면 경보 + 사용자 알림.
  consecutiveUnpublishedSlots Int @default(0)

  defaultCategoryName String?
  defaultOpenType     String  @default("PUBLIC")   // PUBLIC | NEIGHBOR | PRIVATE
  defaultAllowComment Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  sheetSource SheetSource?
  schedules   Schedule[]
  slots       PublishSlot[]
  contents    ContentItem[]
  jobs        PublishJob[]

  // 같은 사용자가 같은 블로그를 두 번 등록하는 것만 막는다.
  // 전역 unique로 안 하는 이유: 대행사가 고객 블로그를 관리하는 정당한 경우가
  // 있고, 전역 unique는 "선점 등록"으로 남의 블로그를 막아버리는 부작용이 있다.
  @@unique([userId, naverBlogId])
  @@index([status])
}

enum BlogStatus {
  PENDING_VERIFY   // 에이전트 소유 확인 전 — 발행 불가
  ACTIVE
  PAUSED
  DISCONNECTED
}

// ─────────────────────────── 에이전트 / 페어링 ───────────────────────────

model Agent {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  deviceName    String
  os            String
  osVersion     String?
  machineIdHash String   // PC 식별자의 해시. 원본 하드웨어 ID 미저장
  agentVersion  String

  // ★ 토큰 원문 미저장. sha256 해시만.
  tokenHash      String    @unique
  tokenIssuedAt  DateTime  @default(now())
  tokenExpiresAt DateTime
  revokedAt      DateTime?
  revokedReason  String?

  lastSeenAt    DateTime?
  lastStatus    AgentRunState @default(IDLE)
  naverLoggedIn Boolean       @default(false)
  knownBlogIds  String[]
  nextPollSec   Int           @default(60)
  lastIpHash    String?       // 감사용. 원본 IP 미저장

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  claimedJobs       PublishJob[]
  preferredForBlogs Blog[]       @relation("PreferredAgent")

  @@index([userId, revokedAt])
  @@index([lastSeenAt])
}

enum AgentRunState {
  IDLE
  BUSY
  ERROR
}

model PairingCode {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  codeHash       String    @unique   // 코드 원문 미저장
  expiresAt      DateTime            // 발급 +10분
  usedAt         DateTime?
  usedByAgentId  String?
  failedAttempts Int       @default(0)
  voidedAt       DateTime?           // 5회 실패 시 폐기

  createdAt DateTime @default(now())

  @@index([userId, expiresAt])
}

// ─────────────────────────── 글감 (구글시트) ───────────────────────────

model SheetSource {
  id     String @id @default(cuid())
  blogId String @unique
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  spreadsheetId String
  sheetName     String @default("글감")
  headerRow     Int    @default(1)

  lastSyncedAt   DateTime?
  lastSyncStatus String?   // OK | PERMISSION_DENIED | SCHEMA_MISMATCH | NOT_FOUND
  lastSyncError  String?
  syncedRowCount Int       @default(0)

  writeBackEnabled Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ContentItem {
  id     String @id @default(cuid())
  blogId String
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  source     ContentSource @default(SHEET)
  sheetRowNo Int?          // 시트 원본 행 번호 (write-back 대상)

  title        String
  bodyHtml     String    @db.Text   // 스마트에디터3.0 서식 규격
  tags         String[]
  categoryName String?
  desiredDate  DateTime? @db.Date
  priority     Int       @default(0)

  status     ContentStatus @default(READY)
  statusNote String?

  contentHash String   // 제목+본문 sha256. 중복 글감 탐지 + 검증 잡 대조 키
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  jobs PublishJob[]

  @@index([blogId, status, desiredDate, priority])
  @@unique([blogId, sheetRowNo])
}

enum ContentSource {
  SHEET     // 사용자가 시트에 직접 채움 (기본플랜)
  AI_DRAFT  // 배치 워커가 채움 (업셀)
  MANUAL    // 대시보드에서 직접 입력
}

enum ContentStatus {
  DRAFT
  READY
  ASSIGNED
  PUBLISHED
  FAILED
  SKIPPED
}

// ─────────────────────────── 예약 (블로그당 정확히 2슬롯) ───────────────────────────

model Schedule {
  id     String @id @default(cuid())
  blogId String
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  slotIndex Int   // 0 | 1 — CHECK 제약으로 값 제한(2-4)
  hour      Int   // slot0은 0~11만 허용(규칙 J2). slot1 = slot0 + 12h 자동 산출
  minute    Int
  weekdays  Int[] // 0(일)~6(토). 비우면 매일
  enabled   Boolean @default(true)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([blogId, slotIndex])
}

// ─────────────────────────── 발행 슬롯(쿼터) ───────────────────────────

// [E2] "하루 최대 2회"를 표현하는 유일한 주체. 잡이 아니라 이 테이블에 유니크가 걸린다.
model PublishSlot {
  id     String @id @default(cuid())
  blogId String
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  slotDate  DateTime @db.Date   // 블로그 타임존 기준 날짜
  slotIndex Int                 // 0 | 1 — CHECK 제약(2-4)
  plannedAt DateTime            // 지터 적용 전 기준시각. 12시간 계획 검사의 기준(규칙 G1)

  // ★[F2/F3] 예약(reservation)과 소모(consumption)는 서로 다른 개념이다. 3-A 규칙 SL2~SL4.
  //   예약 = 짧은 배타 임대(동시성 제어). 잡 리스와 함께 만료된다.
  //   소모 = 영구. 에이전트가 발행 버튼을 실제로 누른 사실(publishAttemptAt)에만 반응한다.
  //   rev3은 이 둘을 consumedAt 하나로 뭉쳐서 SKIPPED가 자리를 영구 소각하는 버그가 있었다.
  reservedByJobId String?
  reservedUntil   DateTime?

  consumedAt      DateTime?
  consumedByJobId String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  jobs PublishJob[]

  @@unique([blogId, slotDate, slotIndex])
  @@index([blogId, slotDate])
}

// ─────────────────────────── 발행 잡 / 검증 잡 ───────────────────────────

model PublishJob {
  id     String @id @default(cuid())
  blogId String
  blog   Blog   @relation(fields: [blogId], references: [id], onDelete: Cascade)

  // [D4] 잡 종류. VERIFY는 UNVERIFIED 구제 전용이며 슬롯을 소비하지 않는다.
  kind JobKind @default(PUBLISH)

  // [E2] PUBLISH 잡은 슬롯에 반드시 매달리고, VERIFY 잡은 절대 안 매달린다(CHECK 제약).
  //   한 슬롯에 여러 시도(최초·재시도·수동 대체)가 attemptSeq로 구분돼 공존한다.
  slotId     String?
  slot       PublishSlot? @relation(fields: [slotId], references: [id], onDelete: Cascade)
  attemptSeq Int          @default(1)

  contentItemId String?
  contentItem   ContentItem? @relation(fields: [contentItemId], references: [id])

  // [D4] VERIFY 잡이 확인하려는 대상 발행 잡 (자기참조)
  verifyTargetJobId String?
  verifyTarget      PublishJob?  @relation("VerifyTarget", fields: [verifyTargetJobId], references: [id])
  verifyJobs        PublishJob[] @relation("VerifyTarget")

  // 지터·지연흡수가 반영된 실제 목표시각
  scheduledAt DateTime
  expiresAt   DateTime            // slot.plannedAt + 3시간
  origin      JobOrigin @default(SCHEDULED)

  status      JobStatus @default(QUEUED)
  attempt     Int       @default(0)
  maxAttempts Int       @default(3)
  // [F5] 이 잡 한 건이 밀린 횟수. 체인 전체의 이상 감지는 이 컬럼이 아니라
  //      Blog.consecutiveDeferredSlots가 담당한다(3-A 규칙 DF3). rev3은 이걸 혼동해
  //      "잡마다 1로 끝나 절대 안 걸리는" 죽은 상한을 들고 있었다.
  deferCount  Int       @default(0)   // 상한 3
  skipReason  String?                 // 값 정의는 2-5 한 곳에서만

  claimedByAgentId String?
  claimedByAgent   Agent?    @relation(fields: [claimedByAgentId], references: [id])
  claimedAt        DateTime?
  leaseExpiresAt   DateTime?

  // [D2] ★12시간 판정의 유일한 기준 컬럼.
  //   PUBLISH_SUBMITTED 이벤트 수신 시각(= 발행 버튼을 누른 시각)을 기록한다.
  //   이벤트를 못 받고 result만 온 경우 result 수신 시각으로 보정 기록.
  //   SUBMITTED / UNVERIFIED / VERIFIED 전 상태에서 NOT NULL이 보장된다.
  publishAttemptAt DateTime?

  // [D5] 발행 당시 본문 스냅샷 — 글감이 나중에 수정·삭제돼도 S9d에서 실제
  //      올라간 내용을 보여줘야 하고, 검증 잡의 대조 기준이기도 하다.
  titleSnapshot    String?
  bodySnapshotHtml String?  @db.Text
  tagsSnapshot     String[]
  contentHash      String?

  idempotencyKey String    @unique   // 결과 보고 중복 차단
  postUrl        String?
  postedAt       DateTime?           // 표시용. ★쿼터 판정에 쓰지 않음(3-A-3)
  errorCode      String?
  errorMessage   String?
  finishedAt     DateTime?           // 표시용. ★쿼터 판정에 쓰지 않음(3-A-3)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  events JobEvent[]

  // [E2] 하루 2회 상한은 PublishSlot이 담당한다. 여기서는 한 슬롯 안에서
  //      시도 번호가 겹치지 않는 것만 보장한다(재시도·수동 대체 허용).
  @@unique([slotId, attemptSeq])
  @@index([status, scheduledAt])
  @@index([blogId, kind, status])
  @@index([blogId, publishAttemptAt])
}

enum JobKind {
  PUBLISH
  VERIFY
}

enum JobOrigin {
  SCHEDULED
  MANUAL
  RETRY
  VERIFY_FOLLOWUP   // [D4] UNVERIFIED 후속 검증
}

enum JobStatus {
  QUEUED
  CLAIMED
  RUNNING
  SUBMITTED
  VERIFIED
  UNVERIFIED   // ★자동 재시도 금지. VERIFY 잡으로만 구제
  FAILED
  EXPIRED
  CANCELED
  SKIPPED
}

model JobEvent {
  id    String     @id @default(cuid())
  jobId String
  job   PublishJob @relation(fields: [jobId], references: [id], onDelete: Cascade)

  type       String
  at         DateTime            // 발생 시각(에이전트 보고분은 서버시간으로 보정)
  recordedAt DateTime @default(now())
  actor      String              // "server" | "agent:<id>" | "user:<id>"
  detail     Json?

  @@index([jobId, at])
}

model AuditEvent {
  id     String @id @default(cuid())
  userId String
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)

  type       String
  entityType String?
  entityId   String?
  ipHash     String?
  detail     Json?
  at         DateTime @default(now())

  @@index([userId, at])
}
```

### 2-3. 잡 단계 이벤트 타입

정상 수명은 아래 순서로 **각각 1행씩** `JobEvent`에 남는다. S9d가 이걸 세로 타임라인으로 그린다.

| 순서 | type | 주체 | 의미 |
|---|---|---|---|
| 1 | `JOB_CREATED` | server | 슬롯 잡 생성 |
| 2 | `CONTENT_BOUND` | server | 글감 바인딩 + 본문 스냅샷 확정 |
| 3 | `JOB_CLAIMED` | agent | 수령(리스 시작) |
| 4 | `AGENT_SESSION_OK` | agent | 네이버 로그인 확인 |
| 5 | `EDITOR_OPENED` | agent | 에디터 진입 |
| 6 | `CONTENT_FILLED` | agent | 제목·본문·태그 입력 완료 |
| 7 | `PUBLISH_SUBMITTED` | agent | **발행 버튼 클릭 → 서버가 `publishAttemptAt` 기록** |
| 8 | `PUBLISH_VERIFIED` | agent | 결과 URL 확인 → 성공 |
| — | `PUBLISH_UNVERIFIED` | agent | 눌렀으나 URL 확인 실패 |
| — | `VERIFY_SCHEDULED` | server | [D4] 검증 잡 생성 |
| — | `VERIFY_STARTED` | agent | [D4] 최근 글 목록 조회 시작 |
| — | `VERIFY_FOUND` | agent | [D4] 일치 글 발견 → 대상 잡 VERIFIED 승격 |
| — | `VERIFY_NOT_FOUND` | agent | [D4] 없음 → 대상 잡 FAILED, 재시도 가능 |
| — | `VERIFY_INCONCLUSIVE` | agent | [D4] 판단 불가 → UNVERIFIED 유지, 사람 확인 |
| — | `JOB_FAILED` | agent/server | 실패 확정(errorCode 포함) |
| — | `JOB_RETRY_SCHEDULED` | server | 재시도 예약 |
| — | `JOB_DEFERRED` | server | [D1] 지연 흡수로 목표시각 재조정 |
| — | `LEASE_RENEWED` / `LEASE_EXPIRED` | server | 리스 갱신/만료 |
| — | `JOB_SKIPPED` | server | 제약 위반(skipReason 동봉) |
| — | `JOB_EXPIRED` | server | 슬롯 만료(PC 꺼짐 등) |
| — | `JOB_CANCELED` | user | 사용자 취소 |

보존기간: `JobEvent` 90일 / `AuditEvent` 365일 (일 배치 삭제).

### 2-4. [D3] Prisma로 표현 안 되는 제약 — 초기 마이그레이션 raw SQL

> **개수 변경 이력**: rev4~rev9 내내 **9개**(CHECK 7 + 부분 유니크 2)였고, 2026-08-08 페이즈2 2차 검수의 치명 발견으로 **제약 10(`INV6`)이 추가돼 지금은 10개**(CHECK 7 + 부분 유니크 **3**)다. 아래 본문·8장·0장의 개수는 전부 10 기준으로 갱신했다. rev 변경이력(문서 상단)의 "9개"는 그 시점 기록이라 그대로 둔다.

**여기가 방어층 `L3`의 실체다.** **Prisma 6은 CHECK 제약을 스키마 문법으로 지원하지 않는다.** 1차 설계에서 "`slotIndex Int` + 유니크로 3번째 잡이 물리적으로 안 생긴다"고 쓴 것은 **사실이 아니었다**(slotIndex=2가 그냥 INSERT됨). 아래 SQL을 **초기 마이그레이션에 포함해야만** L3가 성립한다.

```sql
-- 1) 예약 정의의 슬롯 인덱스는 0 또는 1만
ALTER TABLE "Schedule" ADD CONSTRAINT schedule_slot_index_range
  CHECK ("slotIndex" IN (0, 1));

-- 2) [E2] 실제 쿼터를 쥔 슬롯도 0 또는 1만.
--    이 CHECK + @@unique(blogId, slotDate, slotIndex) 조합이 불변식 `INV3`("하루 최대 2자리")의 실체다.
ALTER TABLE "PublishSlot" ADD CONSTRAINT publish_slot_index_range
  CHECK ("slotIndex" IN (0, 1));

-- 3) [E2] 발행 잡은 슬롯에 반드시 매달리고, 검증 잡은 절대 안 매달린다
ALTER TABLE "PublishJob" ADD CONSTRAINT publish_job_slot_shape CHECK (
  ("kind" = 'PUBLISH' AND "slotId" IS NOT NULL)
  OR
  ("kind" = 'VERIFY'  AND "slotId" IS NULL)
);

-- 4) 블로그 상한 3개 (Plan.blogQuota + extraBlogSlots <= 3)
ALTER TABLE "Subscription" ADD CONSTRAINT subscription_extra_slots_range
  CHECK ("extraBlogSlots" BETWEEN 0 AND 2);

-- 5) 지터 상한 600초 — 3-B-3의 허용오차 계산이 이 상한에 의존한다
ALTER TABLE "Blog" ADD CONSTRAINT blog_jitter_range
  CHECK ("jitterSec" BETWEEN 0 AND 600);

-- 6) 슬롯0은 오전(0~11시)만 — slot1 = slot0 + 12h가 같은 달력일에 들어오게(3-A 규칙 J2)
ALTER TABLE "Schedule" ADD CONSTRAINT schedule_hour_shape CHECK (
  ("slotIndex" = 0 AND "hour" BETWEEN 0 AND 11) OR
  ("slotIndex" = 1 AND "hour" BETWEEN 12 AND 23)
);

-- 7) ★[6차 반려 경미①] 예약 두 컬럼은 항상 함께 NULL이거나 함께 NOT NULL.
--    한쪽만 NULL이면 SL4 가드의 세 disjunct가 전부 UNKNOWN이 되어(NULL 비교)
--    그 자리가 영구 no-op이 된다. 상태 자체를 만들 수 없게 막는다.
ALTER TABLE "PublishSlot" ADD CONSTRAINT publish_slot_reservation_pair CHECK (
  ("reservedByJobId" IS NULL     AND "reservedUntil" IS NULL)
  OR
  ("reservedByJobId" IS NOT NULL AND "reservedUntil" IS NOT NULL)
);

-- ─── 부분 유니크 인덱스 2개 (CHECK로는 표현 불가) ───

-- 8) ★[F4] 한 자리에서 실제로 발행된 잡은 최대 1건 = 불변식 `INV2`.
--    이게 없으면 DB는 "자리 2개"만 강제하고 "실제 발행 2회"는 앱 로직에만 의존하게 된다
--    (= rev3에서 L3가 rev2보다 약해졌던 지점). 이 인덱스로 DB 레벨 보장을 되찾는다.
--    Postgres는 부분 인덱스를 지원하므로 publishAttemptAt이 찍힌 행만 대상으로 건다.
CREATE UNIQUE INDEX publish_job_one_published_per_slot
  ON "PublishJob" ("slotId")
  WHERE "publishAttemptAt" IS NOT NULL;

-- 9) ★[6차 반려 중대1] 한 자리에 살아있는(ACTIVE) 잡은 최대 1건 = 불변식 `INV5`.
--    "예약 만료 = 잡이 끝났다"로 오인해 남의 활성 잡 자리를 인수하던 문을 DB에서도 닫는다.
--    앱은 SL2의 NOT EXISTS로 먼저 막고, 이 인덱스는 최후 방어선이다.
CREATE UNIQUE INDEX publish_job_one_active_per_slot
  ON "PublishJob" ("slotId")
  WHERE "status" IN ('QUEUED','CLAIMED','RUNNING','SUBMITTED');

-- 10) ★[2차 검수·치명] 한 블로그에 진행 중(in-flight)인 발행 잡은 최대 1건 = 불변식 `INV6`.
--    제약 8·9는 슬롯 단위라 "다른 슬롯의 형제 잡"을 못 막았고, 그 틈으로 12시간 간격을
--    무시한 2회 발행이 가능했다(3-A-3 참조). 앱은 `G3` + Blog 행 잠금으로 먼저 막고,
--    이 인덱스가 최후 방어선이다. QUEUED는 집합에서 뺀다 — 넣으면 형제 대기 잡이 교착된다.
CREATE UNIQUE INDEX publish_job_one_inflight_per_blog
  ON "PublishJob" ("blogId")
  WHERE "kind" = 'PUBLISH' AND "status" IN ('CLAIMED','RUNNING','SUBMITTED');
```

> **[E2] rev2에서 바뀐 점**: rev2의 CHECK#2는 `PublishJob`에 `slotDate`/`slotIndex`를 강제해 **블로그·날짜당 PUBLISH 행이 영구히 2개로 고정**됐고, `EXPIRED` 후 수동 발행·재시도가 unique violation으로 막혔다. rev4는 쿼터를 `PublishSlot`으로 옮겨 **자리는 2개로 유지되면서 시도는 여러 번 가능**하고, 제약 8로 **"자리당 실제 발행 1회"를 DB가 다시 보장**한다.

> **[F4] 제약 8과 앱 로직의 역할 분담 (정직하게)**: 제약 8은 `publishAttemptAt`을 UPDATE하는 순간, 즉 **에이전트가 이미 발행 버튼을 누른 뒤에** 위반을 잡는다. 따라서 이건 *실시간 예방*이 아니라 **불변식 위반을 시끄럽게 터뜨리는 최후 방어선**이다. 실시간 예방은 3-A 규칙 `SL2`(예약)가 담당한다. 제약 8이 발동하면 그 자체가 `SL2`에 구멍이 있다는 뜻이므로 A1에 즉시 경보를 띄운다. rev3은 이 역할 분담을 안 밝히고 "중복 방어가 더 강해졌다"고만 썼는데, 그 주장은 제약 8이 없으면 성립하지 않았다.

> `prisma migrate dev` 로 생성된 SQL 파일 끝에 위 **10개(CHECK 7 + 부분 유니크 인덱스 3)** 를 손으로 덧붙이고, 이후 `prisma migrate diff` 로 드리프트가 안 나는지 확인한다. **CI에 "제약 10개 존재 확인" 테스트를 넣는다** — 나중에 누가 마이그레이션을 재생성하면 조용히 사라지는 종류의 방어이기 때문이다.

**검증 상태 (정직하게 구분)**
- **[확인]** 위 SQL이 참조하는 테이블·컬럼 식별자는 `prisma migrate diff --from-empty --script`로 실제 DDL을 뽑아 대조했다. `"PublishJob"."kind"`는 `CREATE TYPE "JobKind" AS ENUM ('PUBLISH','VERIFY')` 타입, `"PublishJob"."slotId" TEXT` nullable, `"PublishSlot"."slotIndex" INTEGER`, `"Schedule"."slotIndex"·"hour"`, `"Blog"."jitterSec"`, `"Subscription"."extraBlogSlots"` 모두 존재하며 대소문자 인용도 일치한다. `PublishSlot_blogId_slotDate_slotIndex_key`, `PublishJob_slotId_attemptSeq_key` 유니크 인덱스도 실제로 생성된다.
- ~~**[미검증]** 위 **9개 문(ALTER 7 + CREATE INDEX 2)** 을 **실제 Postgres에서 실행해 보지는 못했다.**~~ → **[검증 완료 2026-08-08 · 페이즈2 착수 첫 단계]** 아래 참조.

**★[검증 완료 2026-08-08] 제약 9개 실제 실행 결과 (페이즈2 첫 마이그레이션)**

| 항목 | 결과 |
|---|---|
| 실행 환경 | PostgreSQL **16.4** (로컬 포터블 바이너리, `127.0.0.1:5433`). docker pull은 이번에도 자격증명 오류(`A specified logon session does not exist`)로 실패 — Docker 없이 Maven Central의 zonky embedded-postgres 바이너리를 받아 클러스터를 직접 띄웠다 |
| 적용 방법 | `prisma migrate dev`가 만든 초기 마이그레이션 SQL 끝에 2-4의 9개 문을 **원문 그대로** 덧붙여 실행 (레포 `nblog-saas`, 마이그레이션 `20260808105757_init`) |
| 실행 결과 | **9개 전부 성공.** `pg_constraint`에 CHECK 7개, `pg_indexes`에 부분 유니크 인덱스 2개가 이름 그대로 존재 |
| 드리프트 | `prisma migrate diff --from-schema-datasource --to-schema-datamodel` = **빈 마이그레이션**. 즉 손으로 덧붙인 제약이 Prisma의 드리프트 감지에 걸리지 않는다(2-4 마지막 단락의 절차가 실제로 성립) |
| 동작 확인 | 3번째 슬롯 INSERT 거부(제약 2+유니크=`INV3`) · 한 자리 두 번째 `publishAttemptAt` UPDATE 거부(제약 8=`INV2`) · 한 자리 두 번째 ACTIVE 잡 거부(제약 9=`INV5`) · 나머지 CHECK 5개도 거부/통과 양쪽 확인. 총 **33개 테스트가 실제 DB에 대고 통과** |

**★실행해 봐야 알 수 있었던 것 3가지 (설계 문서만으로는 안 보였다)**

1. **제약 6이 제약 1을 가린다.** `Schedule`에 `slotIndex = 2`를 넣으면 제약 1(`schedule_slot_index_range`)이 아니라 **제약 6(`schedule_hour_shape`)이 먼저 터진다** — `slotIndex ∉ {0,1}`은 제약 6의 두 disjunct를 모두 못 만족하기 때문이다. 거부된다는 결과는 같지만 **에러 메시지에 뜨는 제약 이름이 다르므로**, "제약 1이 막는다"고 단정하는 테스트/운영 알림은 실패한다. 제약 1의 단독 동작은 제약 6을 잠시 뗀 롤백 트랜잭션에서 따로 확인했다.
2. **부분 유니크 인덱스 위반 메시지에는 인덱스 이름이 안 실린다.** Prisma는 `Unique constraint failed on the fields: (slotId)`, raw SQL도 `Key ("slotId")=(...) already exists`까지만 준다. 그래서 **"제약 8이 막았나 제약 9가 막았나"를 에러 메시지로 구별할 수 없다** — 2-4 [F4]가 요구한 "제약 8이 발동하면 A1에 즉시 경보"는 메시지 파싱으로는 구현 불가이고, 위반 시점에 슬롯 상태를 되짚어 판별해야 한다. 페이즈2 A1 경보 구현 시 반영 필요.
3. **제약 8은 예상대로 "이미 누른 뒤"에만 터진다.** 첫 잡이 `VERIFIED`(TERMINAL)여도 두 번째 잡의 `publishAttemptAt` UPDATE를 막는다 — 2-4 [F4]가 밝힌 "실시간 예방이 아닌 최후 방어선"이 실측으로 확인됐다.

**★회귀테스트 유효성 자체를 검증했다 (뮤테이션 3종).** 테스트가 통과하는 것만으로는 "정말 잡는지" 알 수 없어, 과거 반려 3건의 버그를 코드에 일부러 되살려 넣고 돌렸다. 셋 다 **의도한 테스트가 죽었다.** 다만 죽은 개수는 하나씩이 아니다 — **①②는 각각 1개, ③은 2개**(`R1-c`를 두 테스트가 함께 밟기 때문)를 죽였다.

| 되살린 버그 | 죽인 테스트 | 죽은 개수 |
|---|---|---|
| ① `SL4-SWEEP` 가드축을 rev7(ACTIVE 잡 0건)로 되돌림 | `F6-⑨` 스윕이 QUEUED 잡에 막힘 | 1 |
| ② `SL2`에서 `INV5` 배타조건 제거(rev6 상태) | `F6-⑥` 예약 만료 인터리빙 | 1 |
| ③ `R1-c`가 `SL4`를 안 부름(4차 치명) | `F6-①②③` R1-a→R1-c 왕복 · `F6-⑥` 예약 만료 인터리빙 | **2** |

**★이번 검증의 범위 한계 (문서만 읽는 사람이 오해하지 않도록 명시)**
**이번 검증은 DB 레벨에 한정된다.** `F6-⑤`의 세 경로(ⓘ 정상 발행 · ⓙ `/result`만 도착 · ⓚ 리스만료)는 **같은 함수(`sl3Consume`)를 호출하는 형태로만 확인했고, 그 함수의 `path` 인자는 현재 본문에서 쓰이지 않는다** — 즉 세 테스트는 동작상 동일한 테스트 3개다. 실제 API 경로(에이전트 `/result` 수신·이벤트 유실) 연동 검증은 **페이즈2 앱 계층 작업에서 수행**한다. `F1`·`F5`·`F7`·`E3`·`D1`은 이번 범위 밖이다.

산출물: 레포 `D:\Develop
blog-saas` (커밋 `c83a172`) — `prisma/schema.prisma`는 2-2 원문과, `prisma/constraints.sql`은 2-4 원문(제약 1~9 부분)과 **`diff` 결과 0바이트 차이**(양쪽 다 문서에서 직접 추출).

> **★행번호를 적을 때는 반드시 커밋 해시를 같이 박는다.** 여기 적었던 "229~752행"은 vault 커밋 `7d4c868` 기준으로 맞았지만, 이후 커밋 `3d0f752`가 155행에 한 줄을 끼워 넣어 밀렸고, 검수자와 내가 서로 다른 리비전을 보며 "네 번호가 틀렸다"를 주고받았다. 리비전을 안 밝힌 행번호는 **다음 커밋에 바로 거짓이 된다.** (2026-08-08 2차 검수 교훈)
> 더 나은 방법은 행번호가 아니라 명령이다 — ` ```prisma ` 펜스 다음 줄부터 닫는 펜스 전까지를 뽑아 `diff`하면 리비전과 무관하게 성립한다.

### 2-5. [E5] `skipReason` 표준값 — 정의는 여기 한 곳에만

rev2는 스키마 주석(4개)과 5-2장(5개)에 따로 적어 불일치가 났다. rev3은 아래 **6개**를 유일한 정의로 두고, 스키마 주석·API 스펙·S9 화면은 전부 이 표를 참조만 한다.

| 값 | 언제 | 사용자에게 보이는 문장 |
|---|---|---|
| `MIN_INTERVAL_12H` | `G1` 거짓이고 `DF2` 지연 흡수도 불가 | "직전 글과 너무 가까워 이번 발행을 건너뛰었습니다" |
| `DAILY_QUOTA` | 그날 슬롯 2개가 이미 점유됨 | "오늘 발행 2회를 모두 사용했습니다" |
| `NO_CONTENT` | 바인딩할 `READY` 글감 없음 | "발행할 글감이 없습니다" |
| `BLOG_PAUSED` | 블로그가 `PAUSED`/`DISCONNECTED`/`PENDING_VERIFY` | "블로그가 일시중지 상태입니다" |
| `AGENT_NOT_PREFERRED` | 선호 기기 지정 + 그 기기가 15분 내 온라인 | "지정하신 PC에서 발행을 기다리는 중입니다" |
| `SUBSCRIPTION_INACTIVE` | 구독이 `PAST_DUE`/`CANCELED` | "구독 상태를 확인해 주세요" |

**★[페이즈2 추가 2026-08-08] 일시형 2개 — 종결형 6개와 구분한다.** 위 6개는 잡이 실제로 `SKIPPED`로 끝날 때 `PublishJob.skipReason`에 저장되는 값이다. 아래 2개는 **잡이 `QUEUED`로 살아 있고 다음 폴링에 다시 시도**되는 경우이며, API 응답의 `skipped[].reason`으로만 나가고 DB에 저장되지 않는다. `G3` 신설로 필요해졌다 — 이전 구현은 이 두 경우를 `DAILY_QUOTA`로 뭉뚱그려 사용자에게 **"오늘 2회 다 썼다"는 거짓 사유**를 보냈다.

| 값 | 언제 | 사용자에게 보이는 문장 |
|---|---|---|
| `BLOG_BUSY` | `G3` 거짓 — 같은 블로그에 진행 중인 발행이 있음 | "이 블로그의 다른 글을 올리는 중입니다" |
| `SLOT_UNAVAILABLE` | `SL2`가 0행 — 그 자리를 남이 쥐고 있거나 이미 소모됨 | "발행 자리를 준비 중입니다. 잠시 후 다시 시도합니다" |

---

## 3. 발행 제약 — 규범 정의 (Single Source of Truth)

> ### ★ 이 문서를 고칠 사람에게
> **간격·쿼터·슬롯·재시도·지연흡수의 정의는 오직 3-A에만 있다.** 3-B는 "왜 이렇게 됐나"(근거·이력)이고, 4·5·7·8장은 규칙 ID(`G1`,`SL2`,`R1`…)를 **참조만** 한다.
> 지금까지 3라운드 반려가 전부 **같은 로직이 여러 절에 중복 서술돼 한쪽만 고쳐진 것**이 원인이었다(3차 반려 ①: 3-1의 L2는 고쳤는데 3-3 판정 SQL은 `now()`인 채로 남음). 그래서 rev4는 **로직을 다시 쓰는 것을 금지**한다.
> **규칙을 바꿀 때는 3-A만 고치고, 다른 절에 로직 문장이 새로 생겼는지 확인할 것.** 8장에 이를 검사하는 CI 항목을 넣었다.

### 3-A. 규범 정의 — 여기가 유일한 정의처

#### 3-A-1. 상수

| 이름 | 값 | 역할 |
|---|---|---|
| `MIN_INTERVAL` | 12h | 명목 하드룰(대외 표기·상품 설명) |
| `TOLERANCE` | 45m | 지터·실행지연 흡수폭 |
| **`GATE`** | **11h15m** (`= MIN_INTERVAL − TOLERANCE`) | **실제 판정 임계. 모든 층이 이 값 하나만 쓴다** |
| `DEFER_OFFSET` | 11h20m (`= GATE + 5m`) | 지연 흡수 목표 오프셋 |
| `SLOT_TTL` | 3h | `expiresAt = plannedAt + SLOT_TTL` |
| `JITTER_MAX` | 600s | 지터 상한 (DB CHECK 5로 고정) |
| `LEASE` | 15m | 잡 임대 시간 |
| `VERIFY_DELAY` | 60s | UNVERIFIED → 검증 잡 지연 |
| `PLAN_LEAD` | 35m | 잡 사전 생성 리드타임. **운영 파라미터이며 정확성과 무관**(3-B-2에서 증명) |

#### 3-A-2. 상태와 불변식

```
잡 상태  ACTIVE   = { QUEUED, CLAIMED, RUNNING, SUBMITTED }
        TERMINAL = { VERIFIED, UNVERIFIED, FAILED, EXPIRED, CANCELED, SKIPPED }
        RISKY    = { SUBMITTED, UNVERIFIED, VERIFIED }      ← 네이버에 올라갔을 수 있는 상태
슬롯 상태 FREE ⇄ RESERVED ⇄ CONSUMED     ← 상태는 독립 저장값이 아니라 INV4의 결과다
```

| 불변식 | 내용 | 지키는 주체 |
|---|---|---|
| `INV1` | `status ∈ RISKY` ⟺ `publishAttemptAt IS NOT NULL` | 앱 + `integrity-check` 일배치 |
| `INV2` | 한 슬롯에 `publishAttemptAt`이 찍힌 잡은 **최대 1건** | **DB 제약 8**(2-4) |
| `INV3` | 한 블로그·하루에 슬롯 행은 **최대 2개** | **DB 제약 2 + 유니크**(2-4) |
| **`INV4`** | **`slot.consumedAt IS NOT NULL` ⟺ 그 슬롯에 `publishAttemptAt IS NOT NULL`인 잡이 존재.** 그리고 그때 `slot.consumedByJobId` = **그 잡의 id**(`INV2`에 의해 유일) | 앱(`SL3`·`SL4`) + `job-reaper` 자가복구 + `integrity-check` |
| **`INV5`** | **한 슬롯에 `ACTIVE` 잡은 최대 1건** | **DB 제약 9**(2-4) + 앱(`SL2`) |
| **`INV6`** | **한 블로그에 `INFLIGHT`(`CLAIMED`·`RUNNING`·`SUBMITTED`) `PUBLISH` 잡은 최대 1건** | 앱(`G3` + `Blog` 행 잠금) + **DB 제약 10**(2-4). 2차 검수 치명 발견으로 신설 |

> `INV2 ∧ INV3` ⇒ **블로그당 하루 실제 발행 ≤ 2회가 DB 레벨에서 보장된다.** (3차 반려 ④ 대응 — rev3은 INV2가 없어 이 보장이 앱 로직에만 있었다.)
>
> **★[6차 반려·중대1] `INV5`를 신설한 이유 — rev6의 "조합 불가" 논거가 반증됐다.**
> rev6은 "`SL2`가 `consumedAt IS NULL`을 요구하므로 '`consumedAt`을 풀어야 하는데 남의 살아있는 예약이 있는' 조합은 발생 불가"라고 **선언**했다. 그런데 그건 **"`consumedAt`이 먼저 찍히고 그 다음 남이 예약을 잡는" 순서만** 따진 것이었다. 검수가 **순서를 뒤집어** 반증했다:
> ```
> t=0       A claim (예약 A, +15m)
> t=15m10s  A 예약 만료. reaper(1분 주기)는 아직 안 돎 → 수동발행 B가 SL2 통과 (예약 B)
>           ※ 이때 A는 여전히 ACTIVE(CLAIMED)인데도 자리를 뺏겼다
> t=15m40s  reaper의 R1-a → SL3(ⓚ)가 consumedAt=A 세팅  ← "불가능"하다던 조합이 성립
> t=18m     검증 NOT_FOUND → R1-c → SL4($jobId=A) → 가드에 막혀 0행
> 결과      consumedAt은 A로 남고 publishAttemptAt 잡은 0건 → INV4 위반 · G2가 발행 0건 자리를 셈 · 재시도 먹통
> ```
> 즉 **4차 치명(자리 영구 소각)이 그대로 재발**했고, ⓙ 경로로도 같은 조합이 만들어졌다.
>
> **근본 원인**: rev6은 `SL4`에만 소유권 가드를 달고 `SL2`·`SL3`는 그대로 뒀다. 그래서 **"예약 만료만으로 남의 *활성* 잡 자리를 인수"하는 문**이 열려 있었다. 예약 만료는 "잡 A가 끝났다"는 뜻이 아닌데 `SL2`가 그렇게 취급한 것이다.
> **수정**: `SL2`에 활성잡 배타 조건을 넣어 `INV5`를 세운다 — 그러면 위 인터리빙의 `t=15m10s` 창 자체가 닫힌다(B가 claim을 못 한다). 검수가 제시한 대안 ②(`SL3`에도 소유권 가드)는 **채택하지 않았다**: `SL3`가 조건부로 `consumedAt`을 안 찍으면 그게 곧 `INV4` 파괴라, 병을 다른 병으로 바꾸는 셈이기 때문이다.
> **증명은 선언이 아니라 실행으로 남겼다** — 검수 하네스를 rev8 규범으로 재실행한 결과(4종)를 부록 D에 raw 출력으로 붙였다.
>
> **★[4차 반려·치명] `INV4`를 신설한 이유.** rev4는 "`CONSUMED`는 되돌아오지 않는다(예외 `R1-c`)"라고 선언해놓고, 정작 `R1-c`가 부르는 `SL4`는 "`consumedAt`은 애초에 안 찍혔으므로 손대지 않는다"고 적혀 있었다. `R1-a`가 이미 `consumedAt`을 찍은 뒤라 그 전제가 거짓이 되는 경로(리스만료 → 검증 `NOT_FOUND`)에서 **자리가 영구 소각**됐다 — 재시도 버튼은 뜨는데 `SL2`가 잡을 안 내주는 먹통 버튼이 되고, `G2`는 실제 발행 0건인 자리를 계속 세서 "오늘 2회 다 썼다"고 표시한다. rev2 E2가 다른 경로로 부활한 것이고, **"정의가 두 곳으로 갈라져 어긋난다"는 병이 3-A 안에서 재발**한 것이다.
>
> 그래서 `consumedAt`을 **독립적으로 관리하는 상태값에서 빼고, `publishAttemptAt`의 파생값으로 격하**했다. `SL3`·`SL4`는 각자 규칙을 쓰는 게 아니라 **둘 다 `INV4`를 유지하는 동작**으로 정의된다. 어느 경로로 `publishAttemptAt`이 생기거나 사라지든 `consumedAt`이 자동으로 따라오므로, 앞으로 새 경로가 추가돼도 같은 버그가 원리적으로 안 생긴다.

#### 3-A-3. 판정 술어 — 유일 정의

**`lastAttemptAt(blogId)` — 간격 판정의 유일한 기준값**

```sql
SELECT MAX("publishAttemptAt")
  FROM "PublishJob"
 WHERE "blogId" = $1
   AND "kind"   = 'PUBLISH'
   AND "publishAttemptAt" IS NOT NULL;
```
> `status` 목록으로 거르지 않는다. `INV1`에 의해 `publishAttemptAt IS NOT NULL` 하나로 RISKY 집합과 동치이고, 컬럼 하나만 보면 상태 목록을 빠뜨리는 실수가 원천 봉쇄된다.
> **`postedAt`·`finishedAt`은 표시 전용이며 이 판정에 절대 등장하지 않는다.**

**`G1` 간격 게이트**

```
G1(blogId, candidateRunAt) :=
      lastAttemptAt(blogId) IS NULL
   OR (candidateRunAt − lastAttemptAt(blogId)) ≥ GATE
```
> ★ **`candidateRunAt`은 반드시 호출자가 넘긴다. `G1` 내부에 `now()`가 없다.** 이것이 3차 반려 ①의 근본 수정이다. `now()`를 넘기는 곳은 `L4` 하나뿐이다.

**`G2` 일일 쿼터 게이트**

```sql
SELECT COUNT(*) FROM "PublishSlot"
 WHERE "blogId" = $1 AND "slotDate" = $2 AND "consumedAt" IS NOT NULL;
```
```
G2(blogId, slotDate) := 위 COUNT < 2
```
> `INV3`에 의해 슬롯 행 자체가 2개를 넘을 수 없으므로 이 값은 구조적으로 0·1·2뿐이다.

> **★[2차 검수·치명 2026-08-08] 이 자리에 있던 rev4 문장은 틀렸다.** 원문은 이랬다:
> > ~~"동시 실행 배타는 별도 술어를 두지 않는다. rev3에는 `CLAIMED`/`RUNNING`이 있으면 차단하는 세 번째 쿼리가 따로 있었는데, **슬롯 예약(`SL2`)이 같은 일을 더 정확히 한다.** 중복 서술을 없애기 위해 그 쿼리는 삭제한다."~~
>
> **삭제된 rev3 술어는 `blogId` 단위였고 `SL2`는 `slotId` 단위다. 같은 일이 아니다.** 중복 서술을 지우는 과정에서 **범위가 다른 방어를 중복으로 오인해 없앤 것**이고, 9차 반려의 "형제 인스턴스" 계열이 규칙 층에서 재발한 사례다.
> 그 결과 뚫린 구멍: `G1`의 기준값 `publishAttemptAt`은 `PUBLISH_SUBMITTED`에야 찍히므로 **아직 발행 전인 형제 잡끼리는 서로를 못 본다** → 같은 블로그의 due 잡 2개가 둘 다 `G1`을 통과하고 **각자 다른 슬롯**을 `SL2`로 예약해 둘 다 수령된다 → 12시간 하드룰이 무시된 채 몇 분 간격 2회 발행. 제약 8·9도 슬롯 단위라 DB 백스톱도 없었다. **페이즈2 구현 중 검수가 재현했다**(claim `max=2` 1회 호출 / 에이전트 2개 동시 `max=1`, 둘 다 재현).
>
> **`G3` 블로그 단위 동시성 배타 — 유일 정의**
> ```
> G3(blogId, jobId) := 같은 blogId에 이 잡(jobId) 외에
>                      status ∈ INFLIGHT 인 kind='PUBLISH' 잡이 하나도 없을 것
> INFLIGHT = { CLAIMED, RUNNING, SUBMITTED }        ← ACTIVE에서 QUEUED를 뺀 집합
>
> ★적용 범위: G3는 수령 대상이 kind='PUBLISH'인 잡에만 건다.
>   kind='VERIFY'는 G1·G2와 마찬가지로 G3에서도 면제다(3-C).
> ```
> ★**`VERIFY` 잡을 면제하는 이유**: 검증 잡은 읽기 전용이라 중복 발행 위험이 원리적으로 없고(3-C), `UNVERIFIED`의 **유일한 구제 경로**다. 여기에 `G3`를 걸면 같은 블로그의 다음 발행이 진행 중일 때 구제 잡이 `expiresAt`(`scheduledAt + 3h`)까지 못 나가고 그대로 만료된다 — 구제 수단이 봉인되는 것이라 "안전 쪽 실패"가 아니다. (3차 검수 발견: 초기 구현의 원자 UPDATE가 **수령 대상의 kind를 안 가려** 실제로 `VERIFY` 잡이 `BLOG_BUSY`로 튕겼다. 앱 게이트는 `PUBLISH`에만 걸고 원자 UPDATE는 전 kind에 걸어 **같은 규칙이 두 층에서 다르게 걸려 있던 것**이 원인이다 — 규범과 구현은 반드시 같은 술어여야 한다.)
> ★**`QUEUED`를 넣지 않는 이유**: 넣으면 형제 대기 잡 2건이 서로를 막아 **아무도 수령 못 하는 교착**이 된다. 막으려는 것은 "동시 발행"이지 "대기열에 2건 있는 상태"가 아니다.
> ★**판정과 전이는 분리하지 않는다.** `G3`를 읽고 나서 따로 수령 UPDATE를 하면(TOCTOU) 동시 요청에 그대로 뚫린다. 수령은 `G3` 조건을 **UPDATE의 WHERE에 포함한 원자적 문**이어야 하고, 그것만으로는 서로 다른 행을 건드리는 동시 트랜잭션의 write-skew가 남으므로 **해당 `Blog` 행을 `FOR UPDATE`로 먼저 잠근다**(READ COMMITTED 기준).
>
> ```sql
> -- G3 + 수령 전이. $1=jobId $2=agentId $3=leaseExpiresAt. 앞서 Blog 행을 FOR UPDATE로 잠근 상태여야 한다.
> UPDATE "PublishJob" j
>    SET "status" = 'CLAIMED', "claimedByAgentId" = $2, "claimedAt" = now(),
>        "leaseExpiresAt" = $3, "attempt" = j."attempt" + 1
>  WHERE j."id" = $1
>    AND j."status" = 'QUEUED'
>    -- ★배타는 수령 대상이 PUBLISH일 때만. VERIFY 잡은 면제(3-C).
>    AND ( j."kind" <> 'PUBLISH'
>       OR NOT EXISTS (
>         SELECT 1 FROM "PublishJob" o
>          WHERE o."blogId" = j."blogId" AND o."id" <> j."id"
>            AND o."kind" = 'PUBLISH'
>            AND o."status" IN ('CLAIMED','RUNNING','SUBMITTED') ) );
> ```

#### 3-A-4. 슬롯 규칙 SL1~SL5

| ID | 규칙 |
|---|---|
| **`SL1` 생성** | `slot-planner`가 **블로그 타임존 기준 매일 00:05**에 그날의 슬롯 행을 만든다. `enabled`이고 `weekdays`가 그날과 맞는 `Schedule` 하나당 1행. `plannedAt = 그날 날짜 + hour:minute`(타임존 적용, **지터 적용 전** — `G1` 규칙A의 기준이므로). 수동 발행 시 해당 자리 행이 없으면 그 시점에 생성한다(비어 있는 `slotIndex` 사용). |
| **`SL2` 예약** | 잡 수령 시 아래 UPDATE가 **1행을 반환할 때만** 잡을 내준다. 0행이면 내주지 않는다. |
| **`SL3` 소모** | **`publishAttemptAt`을 세팅하는 모든 트랜잭션**은 같은 트랜잭션에서 `consumedAt = now()`, **`consumedByJobId = 그 잡의 id`**를 세팅한다(`INV4` 유지 — `consumedByJobId`가 실제 발행한 잡을 가리켜야 S9d·A1·감사추적이 엉뚱한 잡을 가리키지 않는다). 그런 트랜잭션은 **정확히 세 개**다 — ⓘ 정상 발행(`PUBLISH_SUBMITTED` 이벤트 수신) ⓙ **이벤트를 못 받고 `/result`만 도착한 경우**(결과 수신 시각으로 보정 기록) ⓚ `R1-a`(리스만료 보수 처리). **ⓙ를 빠뜨리면 `INV4`가 깨져 발행된 자리가 FREE로 오인된다**(5차 반려 경미). |
| **`SL4` 해제** | **트리거는 조건이지 횟수가 아니다.** 아래 셋 중 무엇이든 해당하면 실행한다 — ⓧ 잡이 `TERMINAL` **집합 안으로 들어가거나 그 내부에서 이동**하는 트랜잭션(`UNVERIFIED → FAILED` 포함) ⓨ `publishAttemptAt`이 **세팅되거나 해제되는** 모든 트랜잭션 ⓩ `job-reaper`·`integrity-check`의 **주기 스윕**(`SL4-SWEEP`). **멱등**이므로 몇 번 돌아도 안전하다. 동작은 `INV4` 재평가 — 그 슬롯에 `publishAttemptAt IS NOT NULL`인 잡이 하나도 없고 살아있는 남의 예약도 없으면 예약·소모 4개 컬럼을 전부 NULL로. |
| **`SL5` 재사용** | 해제된 자리에는 `attemptSeq + 1` 잡을 새로 만들 수 있다(재시도·수동 발행). `INV5` 때문에 **직전 잡이 `TERMINAL`이 된 뒤에만** 가능하다. |

```sql
-- SL2 예약: 원자적 UPDATE. 반환 행이 0이면 그 잡은 수령 불가.
UPDATE "PublishSlot" s
   SET "reservedByJobId" = $jobId,
       "reservedUntil"   = now() + interval '15 minutes'
 WHERE s."id" = $slotId
   AND s."consumedAt" IS NULL
   -- ★[INV5] 이 자리에 아직 살아있는 남의 잡이 있으면 인수 금지.
   --   예약 만료는 "잡 A가 끝났다"는 뜻이 아니다. rev6은 이걸 혼동해 t=15m 창이 열렸다.
   AND NOT EXISTS (
        SELECT 1 FROM "PublishJob" j
         WHERE j."slotId" = s."id" AND j."id" <> $jobId
           AND j."status" IN ('QUEUED','CLAIMED','RUNNING','SUBMITTED') )
   AND ( s."reservedUntil" IS NULL
      OR s."reservedUntil" <= now()
      OR s."reservedByJobId" = $jobId )     -- ★자기 잡의 리스 갱신은 허용
RETURNING s."id";
```

```sql
-- SL4 해제: 트리거 ⓧⓨ. $jobId = 방금 상태가 바뀐 그 잡. 멱등.
--   ⓐ 애초에 발행 못 한 종료(SKIPPED·EXPIRED·CANCELED·FAILED): consumedAt이 원래 NULL → 예약만 풀림
--   ⓑ R1-c(검증 미발행 확정): publishAttemptAt이 지워지므로 consumedAt까지 풀림
UPDATE "PublishSlot" s
   SET "reservedByJobId" = NULL, "reservedUntil" = NULL,
       "consumedAt"      = NULL, "consumedByJobId" = NULL
 WHERE s."id" = $slotId
   -- INV4 재평가: 이 자리에 발행 흔적이 하나도 없어야 한다
   AND NOT EXISTS (
        SELECT 1 FROM "PublishJob" j
         WHERE j."slotId" = s."id" AND j."publishAttemptAt" IS NOT NULL )
   -- 예약 소유권 가드: 남이 쥔 살아있는 예약은 건드리지 않는다
   --   (제약 7이 reservedByJobId/reservedUntil의 짝을 보장하므로 NULL 비교 함정 없음)
   AND ( s."reservedByJobId" IS NULL
      OR s."reservedByJobId" = $jobId
      OR s."reservedUntil"  <= now() );
```

```sql
-- SL4-SWEEP: 트리거 ⓩ. job-reaper(1분)·integrity-check(일 1회)가 돌리는 자가복구.
--   가드축은 "살아있는 남의 예약"(소유권)이다. ACTIVE 잡 유무가 아니다 — 아래 주석 참고.
UPDATE "PublishSlot" s
   SET "reservedByJobId" = NULL, "reservedUntil" = NULL,
       "consumedAt"      = NULL, "consumedByJobId" = NULL
 WHERE s."consumedAt" IS NOT NULL
   -- ① 이 자리에 발행 흔적이 하나도 없다(= consumedAt이 유령이다)
   AND NOT EXISTS (
        SELECT 1 FROM "PublishJob" j
         WHERE j."slotId" = s."id" AND j."publishAttemptAt" IS NOT NULL )
   -- ② 살아있는 남의 예약은 보호. 예약이 없거나·만료됐거나·예약 주인이 이미 끝났으면 지운다.
   AND ( s."reservedByJobId" IS NULL
      OR s."reservedUntil"  <= now()
      OR NOT EXISTS (
           SELECT 1 FROM "PublishJob" j
            WHERE j."id" = s."reservedByJobId"
              AND j."status" IN ('QUEUED','CLAIMED','RUNNING','SUBMITTED') ) );
```
> **★[7차 반려·중대1] 가드축을 바꾼 이유 — rev7의 "1분 안에 자동으로 낫는다"는 거짓이었다.**
> rev7의 스윕은 세 번째 조건으로 **"그 슬롯에 `ACTIVE` 잡이 0건"** 을 요구했다. 그런데 스윕이 고쳐야 할 상황(`consumedAt`은 있는데 발행 흔적 0건)에서 **사용자가 재시도·수동 발행 버튼을 누르면 `QUEUED` 잡이 생기고, 그 순간 스윕이 스스로 막힌다.** 검수 재현:
> ```
> stale 주입   INV4=VIOLATED G2=1
> 재시도 잡 R INSERT (제약 9는 ACTIVE 1건이라 안 막음)
> t=1m   SWEEP rows=0 ← R이 ACTIVE라 3번째 NOT EXISTS 실패
>        R claim SL2 rows=0 ← consumedAt 잔존이라 실패
> t=60m  여전히 VIOLATED …  t=180m R이 SLOT_TTL 도달 EXPIRED → 그제서야 해제
> ```
> 즉 실제 복구 시간은 1분이 아니라 **끼어든 잡이 `TERMINAL`이 될 때까지(최대 `SLOT_TTL` 3시간)** 였고, 증상은 4차 치명과 동일했다(먹통 버튼 + `G2`가 발행 0건 자리를 셈). 게다가 **유발 경로가 하필 재시도 버튼**이라, 사용자가 이상을 눈치채고 누르는 행동이 오히려 복구를 막는 역설이었다.
> **원인은 가드축을 잘못 고른 것.** 조건 ①이 이미 "발행 흔적 0건"을 보장하므로 `ACTIVE` 잡이 있어도 스윕이 지울 것은 없다. 지켜야 할 대상은 **"살아있는 남의 예약"**이지 `ACTIVE` 잡이 아니다. 그래서 `SL4`와 **같은 소유권 축**으로 통일했다. 이제 살아있는 예약은 보호되고, 예약을 안 쥔 `ACTIVE` 잡(= 방금 만들어진 재시도 잡)은 스윕 후 정상 claim된다. 회귀테스트 `F6-⑨`.
>
> **경계값(`reservedUntil = now()`)**: `SL2`·`SL4`·`SL4-SWEEP` 모두 `<= now()`(만료로 취급)로 통일했다. rev6은 `<`라서 정확히 같은 순간에는 **아무도 못 건드리는 교착**이 생겼다(6차 반려 경미③).

> **한 줄 요약**: `consumedAt`은 스스로 관리되는 상태가 아니라 **"이 자리에 발행 흔적이 있는가"의 캐시**다. `SL3`가 켜고 `SL4`가 끄되, 둘 다 판단 근거는 `publishAttemptAt` 하나뿐이다.
```
> **`OR "reservedByJobId" = $jobId` 절의 의미(3차 반려 ③ 답)**: 판정 기준은 **"다른 잡이 살아있는 예약을 쥐고 있는가"**다. 자기 잡이면 통과 — 리스 **갱신**은 살아야 하기 때문이다. 다만 **다른 에이전트가 같은 잡을 다시 가져가는 경로는 `R1`이 원천 금지**하므로, 이 절은 리스 갱신에서만 쓰인다.

#### 3-A-5. 리스 만료 규칙 R1 — 재수령을 금지한다

**PUBLISH 잡은 한 번 수령되면 다시 수령되지 않는다.** 서버는 "에이전트가 발행 버튼을 누르기 전에 죽었는지, 누른 직후에 죽었는지"를 구별할 방법이 없다. 재수령을 허용하면 후자에서 **중복 발행**이 난다(3차 반려 ③). 그래서 리스가 만료되면 결과를 *모르는 것*으로 처리한다.

| ID | 상황 | 처리 |
|---|---|---|
| `R1-a` | 리스 만료 시 상태가 `CLAIMED`/`RUNNING`/`SUBMITTED` | `publishAttemptAt = claimedAt`(보수적으로 가장 이른 가능 시각)로 채우고 `UNVERIFIED`로 전이 → `SL3`로 슬롯 CONSUMED → 검증 잡 생성(3-C). `INV1` 유지 |
| `R1-b` | 리스 만료 시 상태가 `QUEUED`(한 번도 수령 안 됨) | `EXPIRED`. 에이전트가 손댄 적 없으므로 발행 가능성 0 → `publishAttemptAt` NULL 유지, `SL4`로 자리 해제. 검증 불필요 |
| `R1-c` | 검증 결과 `NOT_FOUND` (= 미발행 확정) | **`publishAttemptAt`을 NULL로 되돌리고** `FAILED`로 전이 → 같은 트랜잭션에서 `SL4`가 `INV4`를 재평가해 **`consumedAt`까지 함께 해제** → 자리가 완전히 되살아나 재시도 가능. **문서 전체에서 `publishAttemptAt`을 지우는 유일한 경로**이며, 근거를 `AuditEvent`에 남긴다 |

> **`R1-a` → `R1-c` 왕복이 정상 동작하는지가 이 설계의 급소다**(4차 반려 치명). `R1-a`가 자리를 CONSUMED로 만들었다가 `R1-c`가 되돌리는 경로이므로, `SL4`가 `consumedAt`을 안 건드리면 자리가 영구 소각된다. 회귀 테스트는 8장 **`F6`(9종)** 에 못 박았다. **항목 원문은 8장 한 곳에만 두고 여기서는 개수만 참조한다.** **항목 원문은 `F6` 한 곳에만 두고 여기서는 참조만 한다**(개수 표기가 두 곳으로 갈라져 어긋나던 5라운드 반복을 끊기 위해).

#### 3-A-6. 지연 흡수 규칙 DF1~DF4

| ID | 규칙 |
|---|---|
| `DF1` | `G1(blog, scheduledAt)`이 거짓이면 `deferTo = lastAttemptAt + DEFER_OFFSET` 을 계산한다 |
| `DF2` | `deferTo ≤ expiresAt`이면 `scheduledAt = deferTo`, `job.deferCount += 1`(상한 3), `blog.consecutiveDeferredSlots += 1`. 아니면 `SKIPPED(MIN_INTERVAL_12H)` + `SL4` |
| `DF3` | 흡수 없이 정시 발행이 한 번 성공하면 `blog.consecutiveDeferredSlots = 0`. **8을 넘으면** A1 경보 + 해당 블로그 자동 일시중지 |
| **`DF4`** | **발행 없이 끝난 모든 슬롯**(`SKIPPED`·`EXPIRED`·`R1-c`로 미발행 확정)마다 `blog.consecutiveUnpublishedSlots += 1`. 발행이 한 번이라도 성공하면 0으로 리셋. **`>= 4`이면**(= 하루 2슬롯 x 이틀 = 만 이틀 무발행) A1 경보 + 사용자 알림 |

> **`DF3`이 블로그 단위인 이유(3차 반려 ⑤ 답)**: 드리프트 체인은 **슬롯마다 다른 잡**으로 이어지므로 `PublishJob.deferCount`(per-job)는 항상 1에서 끝난다 — rev3이 상한을 2에서 6으로 올린 것은 **더 도달 불가능하게 만든 것**이지 수정이 아니었다. 체인 이상은 잡을 가로지르는 누적 카운터로만 잡을 수 있어서 `Blog`로 옮겼다. 드리프트는 슬롯당 40분씩 줄어 최악(3시간)에도 4를 안 넘으므로, **8 초과는 감쇠가 깨졌다는 뜻 = 실제로 발동하는 방어**다.

> **`DF4`를 신설한 이유(4차 반려 경미 ⑤ 답 — 채택)**: `DF3`은 **흡수(defer)에만** 반응한다. 그런데 `DF2`의 `SKIPPED` 분기는 카운터를 안 올리므로, **매 슬롯이 흡수 없이 곧장 `SKIPPED`되는 블로그는 실제 발행 0건인데도 영원히 무경보**가 된다(검수가 10슬롯 시뮬로 확인). "왜 이걸 경보에 넣는가"에 대한 판단은 **넣는다**이다 — 사용자가 돈을 내고 사는 것은 "글이 올라가는 것"이지 "흡수가 안 걸리는 것"이 아니므로, 감시 지표는 흡수 여부가 아니라 **발행 여부**여야 한다. 그래서 `DF3`(감쇠 건전성, 내부 지표)과 `DF4`(무발행 감지, 고객 영향 지표)를 **분리**했다. 임계는 `>= 4`이고 하루 2슬롯 x 이틀에 정확히 해당하며, 이틀 연속 무발행이면 사용자에게도 알린다.

#### 3-A-7. 지터 규칙 J1~J2

| ID | 규칙 |
|---|---|
| `J1` | `offset(blogId, slotDate) = PRNG(hash(blogId + slotDate)) ∈ [−jitterSec, +jitterSec]` — **하루에 하나만 뽑아 그날 두 슬롯에 공통 적용**. 그래서 같은 날 두 발행 간격은 지터와 무관하게 정확히 12h |
| `J2` | 슬롯0의 시각은 `00:00~11:59`, 슬롯1 = 슬롯0 + 12h(사용자 편집 불가). "12시간 이상"이 아니라 **정확히 12시간** — 매일 반복 시 `a+b=24 ∧ a≥12 ∧ b≥12 ⇒ a=b=12`이므로 다른 값은 수학적으로 불가능(3-B-1) |

#### 3-A-8. 4중 방어선 — 각 층은 위 규칙을 "호출"만 한다

| 층 | 시점 | 호출하는 규칙 | 위반 시 |
|---|---|---|---|
| `L1` | S8에서 예약 저장 | `J2` | 저장 거부(UI에서 애초에 입력 불가) |
| `L2` | `slot-planner`가 잡 생성 | `G1(blog, `**`그 잡의 scheduledAt`**`)` ∧ `G2` | `DF1`→`DF2` |
| `L3` | DB INSERT/UPDATE | `INV2` ∧ `INV3` | 예외 발생 + A1 경보 |
| `L4` | 잡 수령(claim) | `G1(blog, `**`now()`**`)` ∧ `G2` ∧ **`G3`** ∧ `SL2` (전부 `Blog` 행을 잠근 한 트랜잭션 안에서) | `DF1`→`DF2`, 또는 잡 미발급 |

> ★ **`L2`와 `L4`의 유일한 차이는 `G1`에 넘기는 `candidateRunAt` 값뿐이다.** 임계·컬럼·쿼리는 완전히 동일하다. 둘 중 하나만 고쳐서 어긋나는 일이 다시 생기지 않도록, 구현에서도 **같은 함수 하나를 인자만 바꿔 호출**해야 한다(8장 CI 항목).
>
> **각 층이 담당하는 시간대**: `L2`는 "잡 생성 시점에 이미 확정된 과거 발행"을, `L4`는 "잡 생성 이후~수령 직전에 새로 생긴 발행"(수동 발행 끼어들기, 직전 슬롯의 지연 발행)을 본다. 자정 경계 케이스(23:50 → 익일 00:10)를 실제로 막는 것은 **`L4`**다.

### 3-B. 근거 — 왜 이 규칙들이 이 값인가

> 이 절은 **설명만** 한다. 규칙은 3-A에만 있다.

#### 3-B-1. 왜 `J2`가 "12시간 이상"이 아니라 "정확히 12시간"인가

매일 2회를 반복하면 하루 24시간을 두 간격이 나눠 갖는다. 두 간격이 **모두** 12시간 이상이려면
`a ≥ 12 ∧ b ≥ 12 ∧ a + b = 24` → **`a = b = 12` 뿐**이다. **여유가 수학적으로 0**이므로 13시간 같은 설정을 허용하면 날짜 경계 간격이 11시간이 되어 매일 한 번이 죽는다. 1차 설계의 "±12시간 회색 처리(=13시간 허용)" UI가 정확히 이 함정이었다.

#### 3-B-2. 왜 `L2`가 `now()`가 아니라 예정시각을 넘기는가 — 3라운드에 걸친 오진의 종착점

잡 생성은 예정 `PLAN_LEAD`(35분) 전에 일어난다. 따라서 `now()`는 **구조적으로 항상 예정시각보다 35분 이르다**. 12시간 간격 스케줄에서 "지금 12시간이 지났나"는 **영원히 참이 될 수 없다.**

L2를 포함해 다시 측정한 결과(부록 B):

| 구성 | A: 쌍 단위 위반 | B: 체인 스킵률 |
|---|---|---|
| rev2/rev3 3-3 문자 그대로 (`now()` 기준 · 임계 12h · 리드 35분) | **100.00%** | 50.00% |
| 관대 해석 (`now()` 기준 · 임계 `GATE` · 리드 35분) | 9.90% | 9.88% |
| 참고: 리드타임만 30분으로 | 3.63% | 3.58% |
| **채택안 (예정시각 기준 · 임계 `GATE` · 리드 35분)** | **0.00%** | **0.00%** |
| **채택안 + 리드타임 60분** | **0.00%** | **0.00%** |
| 채택안 + PC지연 5%(최대 3h) | — | 스킵 0.07% / 흡수 8.51% |

**핵심**: 좌변을 예정시각으로 바꾸면 **`PLAN_LEAD`가 정확성에서 완전히 분리된다**(35분·60분 동일 0.00%). 리드타임을 30분으로 낮춰 푸는 방법도 있었지만 여유가 5분뿐인 경계값 튜닝이라 채택하지 않았다.

**[⑥ 정정] 검수 수치와의 차이 — rev3의 설명이 틀렸다.**
rev3은 "차이의 원인은 분모 하나"라고 썼는데 **원인은 두 개**였고, 그 결과 "교차일만 본 값이 12.5%"라면서 자기 교차일 값은 19.9%라고 적는 자기모순이 있었다. 실측 분해:

| 조건 | 값 |
|---|---|
| 교차일 쌍만 · 실행지연 포함 | **19.74%** |
| 교차일 쌍만 · 실행지연 0 | **12.53%** ← 검수의 12.46%는 이것 |
| 같은 날 쌍만 · 실행지연 포함 | 0.00% |
| 양쪽 쌍 평균 · 실행지연 포함 | **9.90%** ← 내 9.94%는 이것 |
| 양쪽 쌍 평균 · 실행지연 0 | 6.26% |

즉 차이는 **① 분모에 같은 날 쌍(항상 0%)을 넣느냐 ② 실행지연을 넣느냐** 두 축이다. 검산: 19.74 ÷ 2 = 9.87 ≈ 9.90 (같은 날 쌍이 0%이므로 평균은 정확히 절반). rev3이 적었던 "12.46 ÷ 2" 식의 산수는 애초에 성립하지 않았다.

#### 3-B-3. 허용오차 `TOLERANCE`가 45분인 근거

```
최악 실측 간격 = 12h − (지터 최대차 20분) − (실행지연 최대차 5분) = 11h 35분
GATE(11h 15분) 대비 여유 = 20분
```
지터 상한 600초는 DB CHECK 5로 고정했다(2-4). **이 상한이 풀리면 위 계산이 깨지므로** 스키마에 묶어 둔 것이다.

`J1`(하루 공통 지터)만으로는 해결되지 않는다는 점도 측정했다 — 최악값을 만드는 것은 날짜 경계 간격이고 지터 결합은 거기에 영향이 없다.

| 구성(L4 단독) | 12h 미만 비율 | 최소 실측 간격 |
|---|---|---|
| 슬롯별 독립 지터, 허용오차 0 | 49.86% | 11h 35.9m |
| 하루 공통 지터, 허용오차 0 | 50.02% | 11h 36.0m |
| **하루 공통 지터 + 허용오차 45분** | **0.00%** | 11h 35.5m |

**실질적 해결책은 허용오차이고, `J1`은 같은 날 간격을 결정적으로 만드는 보조책이다.**

#### 3-B-4. `DEFER_OFFSET`이 `+12h`가 아니라 `+11h20m`인 근거

`+12h`로 흡수하면 **여유 0인 상태를 그대로 재생성**하므로 드리프트가 영원히 유지된다(2차 검수가 재현한 09:00→11:30 고착). `GATE + 5분`으로 흡수하면 드리프트가 스스로 줄어든다.

```
드리프트 D = 실제 발행시각 − 원래 예정시각
다음 목표  = 실제 + 11h20m = 원래예정 + D + 11h20m
다음 드리프트 D' = D − 40분          ← 슬롯마다 40분씩 감쇠
D ≤ 45분이면 G1을 그냥 통과하므로 흡수가 안 걸린다 → 정시 복귀
```

실행 검증(부록 C):

| 슬롯 | `+12h` 흡수 | `+11h20m` 흡수 (채택) |
|---|---|---|
| 1 | DEFER 예정+150분 · 간격 12.000h | DEFER 예정+110분 · 간격 11.333h |
| 2~3 | DEFER 예정+150분 | DEFER 예정+70분 → +30분 |
| 4 | DEFER 예정+150분 | **정시 · 간격 11.500h** |
| 5~6 | DEFER 예정+150분 (영구) | **정시 · 간격 12.000h** |

최악(드리프트 3시간 = `SLOT_TTL` 한계)에서도 **4슬롯(2일) 안에 정시 복귀**하고 모든 간격이 `GATE` 이상이다.

#### 3-B-5. "두 번째 발행이 조용히 안 죽는다"는 근거 정리

| 경로 | 결과 | 근거 |
|---|---|---|
| L2 통과 | **0.00%** (리드 35·60분 모두) | 3-B-2 |
| 같은 날 슬롯0→슬롯1 | 간격 항상 정확히 12h | `J1` |
| 날짜 경계 슬롯1→다음날 슬롯0 | 최악 11h36m > `GATE` | 3-B-3 |
| 직전 발행 지연 | 흡수 후 40분씩 감쇠해 정시 복귀 | 3-B-4 |
| `SLOT_TTL` 초과 지연 | `EXPIRED` + 사용자 알림(장기 시뮬 0.07%) | `R1-b` |
| `EXPIRED`/`SKIPPED` 후 재시도·수동 발행 | 자리 해제되어 `attemptSeq+1`로 정상 생성 | `SL4`,`SL5` |
| 수동 발행 끼어들기 | 정상 차단(의도된 동작) + S4에 사유·해제 예정시각 | `G1`,`G2` |

> **[미검증]** 위 수치는 시뮬레이션과 산술 근거다. 실제 네이버 계정에서 "12시간 간격 2회"가 저품질을 피하는지는 페이즈3 베타 실측 전까지 알 수 없다. 선행문서 10장 kill 기준 유지.

### 3-C. [D4] UNVERIFIED 구제 — 검증 잡(VERIFY)

1차 설계는 `nextAction: VERIFY_LATER`와 7장 표가 검증 잡에 의존하는데 **모델·API에 그 기능이 아예 없었다.** UNVERIFIED는 자동 재시도가 금지된 상태라 검증 잡이 유일한 구제 수단이므로, 없으면 그 잡은 영원히 사람이 손대야 한다. 아래를 추가한다.

**생성 계기는 두 가지다.** ① `/result`가 `outcome=UNVERIFIED`로 온 경우 ② **리스 만료(`R1-a`)로 결과를 모르게 된 경우**. 둘 다 서버가 `kind=VERIFY`, `origin=VERIFY_FOLLOWUP`, `verifyTargetJobId=<대상>`, `scheduledAt = now() + VERIFY_DELAY` 잡을 만든다(`VERIFY_SCHEDULED`).

**슬롯을 소비하지 않는다** — 검증 잡은 `slotId`가 NULL이고(DB 제약 3), `G1`·`G2`는 `kind='PUBLISH'`로 필터한다.

**수행**: 에이전트가 대상 블로그의 최근 글 목록을 열어 `titleSnapshot` 완전일치 + 게시시각이 `publishAttemptAt ± 10분` 범위인 글을 찾는다.

| 결과 | 대상 잡 처리 | 슬롯 | 사용자에게 |
|---|---|---|---|
| `FOUND` | `VERIFIED`로 승격 + `postUrl` 기록 | CONSUMED 유지 | 성공으로 표시 |
| `NOT_FOUND` | `R1-c` — `publishAttemptAt`을 NULL로 되돌리고 `FAILED`(errorCode=`VERIFY_NOT_FOUND`) | **`SL4`로 해제** → 재시도 가능 | "발행 안 됨, 재시도" |
| `INCONCLUSIVE` | `UNVERIFIED` 유지 | CONSUMED 유지 | "직접 확인 필요" + 재발행은 명시 확인 후에만 |

검증 잡이 3회 연속 `INCONCLUSIVE`면 중단하고 사람에게 넘긴다. **검증 잡은 절대 글을 쓰지 않는다** — 읽기 전용이라 중복 발행 위험이 구조적으로 없다. 그래서 `R1`이 재수령을 금지하고 이 경로로만 구제하는 것이 안전하다.

---

## 4. 웹 대시보드 화면 (13개)

```
공개   ├ S1 랜딩/요금제
       └ S2 로그인·가입
로그인  ├ S3 온보딩 위저드(4스텝)   ├ S8 예약 설정
       ├ S4 대시보드 홈            ├ S9 발행 이력
       ├ S5 블로그 관리            ├ S9d 잡 상세
       ├ S6 에이전트 관리          ├ S10 요금제·결제
       ├ S7 글감(시트)             └ S11 계정 설정
운영자  └ A1 운영자 콘솔  (User.role = ADMIN 만 접근)
```

### S1. 랜딩 / 요금제
- 제품 설명, 플랜 비교표(기본 / +추가블로그 / +AI글감대행), FAQ.
- **PC 설치형이라는 사실과 "PC가 켜져 있어야 발행된다"를 가입 전에 명시**한다. 숨기면 첫 달 이탈로 돌아온다.
- "네이버 비밀번호를 요구하지 않습니다"를 전면 배치.

### S2. 로그인 / 가입
- NextAuth v5. 구글 OAuth + 이메일 매직링크. 자체 비밀번호 없음.
- 가입 즉시 `Subscription`을 `TRIALING`으로 생성.

### S3. 온보딩 위저드 (4스텝 — 선행문서 3장 플로우)
| 스텝 | 화면 | 완료 조건 |
|---|---|---|
| 1 | 블로그 연결 | `naverBlogId` 입력 → `Blog(PENDING_VERIFY)` 생성 |
| 2 | 에이전트 설치·페어링 | 설치파일 다운로드 → 페어링 코드(10분 카운트다운) → 에이전트가 붙으면 폴링으로 자동 전환. 에이전트가 보고한 `knownBlogIds`와 스텝1 블로그를 대조해 `ACTIVE` 승격 |
| 3 | 구글시트 연동 | 시트 템플릿 "복사하기" → 연결 → 첫 동기화 1행 이상 성공 |
| 4 | 예약 설정 | **슬롯0 시각(0~11시) 선택 → 슬롯1 자동 확정** 후 저장 |
- 각 스텝 이탈 후 재진입 가능. 스텝2에서 막히는 사용자가 가장 많을 것이므로 **"안 될 때" 체크리스트**(방화벽·크롬 미설치·네이버 미로그인)를 접이식으로 상시 노출.

### S4. 대시보드 홈
- **오늘 발행 현황**: 블로그별 슬롯 2칸 타임라인 — `09:00 ✓완료 / 21:00 ⏳대기`.
- **에이전트 오프라인 배너**: "마지막 응답 N분 전 · 이대로면 오늘 21:00 발행이 안 됩니다".
- **네이버 로그아웃 경고**: 에이전트는 살아있는데 `naverLoggedIn=false`면 별도 경고(발행 시점에야 실패하는 걸 미리 잡음).
- 글감 3건 미만 경고 / 최근 실패 3건 + 재시도 버튼.
- **수동 발행 버튼**: 오늘 슬롯이 소진됐거나 12시간 룰에 걸리면 비활성 + 사유·해제 예정시각 표시(G1·G2 결과 그대로).

### S5. 블로그 관리
- 목록(`2/3` 쿼터 표시), 추가·이름변경·일시중지·연결해제.
- 쿼터 초과 시 업셀 모달. **하드캡 3개는 결제로도 못 넘음**(`extraBlogSlots ≤ 2` CHECK).
- 블로그별 발행 기본값(카테고리·공개범위·댓글) + **지터 폭**(0~10분) 편집.
- `PENDING_VERIFY`면 "에이전트가 이 블로그의 로그인을 확인하지 못했습니다" + 해결 가이드.

### S6. 에이전트 관리
- 기기 목록: 이름·OS·버전·온라인여부·마지막 응답·네이버 로그인 여부·인식된 블로그.
- **페어링 코드 발급**(10분, 남은 시간 표시, 재발급 시 이전 코드 즉시 폐기).
- 기기 연결 해제(revoke) — 다음 폴링에서 에이전트가 401 받고 스스로 정지.
- **[D5] 블로그별 선호 기기 지정** — `Blog.preferredAgentId`. 지정 시 그 기기만 해당 블로그 잡을 수령한다. 단 선호 기기가 **15분 이상 오프라인**이면 다른 기기가 대신 가져간다(폴백). 폴백이 없으면 "회사 PC를 선호로 지정 → 그날 회사 안 감 → 발행 0"이 되기 때문이다.

### S7. 글감 (구글시트)
- 연결 상태·마지막 동기화·오류 사유(권한없음/헤더불일치/시트없음), "지금 동기화".
- 글감 테이블: 상태·희망일·제목·글자수·중복경고(같은 `contentHash`).
- 대시보드 직접 추가/수정(`source=MANUAL`).
- AI 글감 대행 사용자는 "생성 대기 N / 검토 대기 N" 큐 추가 표시.

**시트 표준 헤더(고정)**: `상태 | 발행희망일 | 제목 | 본문 | 태그 | 카테고리 | 결과URL | 결과시각 | 실패사유`
→ 앞 6열 = 사용자 입력, 뒤 3열 = 우리가 write-back 하는 출력.

### S8. 예약 설정 ★rev2에서 재설계
- 블로그별 슬롯 편집기. **슬롯 칸은 2개 고정**(3번째 추가 버튼 없음).
- **사용자는 슬롯0 시각만 고른다(00:00~11:59). 슬롯1은 `+12시간`으로 자동 표시되고 편집 불가.**
  안내 문구: "네이버 저품질 위험을 줄이려고 하루 2회·12시간 간격을 고정합니다. 두 번째 시각은 첫 시각에 맞춰 자동으로 정해집니다."
- 이 화면이 방어층 `L1`을 수행한다(`J2` 검증). 1차 설계의 "±12시간 회색 처리(13시간 등 허용)" 방식은 **날짜 경계 간격이 11시간이 되어 매일 한 번이 죽으므로 폐기**(3-B-1).
- 요일 선택, 일시중지, 지터 안내("정확히 정각이 아니라 ±10분 안에서 자연스럽게 올립니다").
- 미리보기: "다음 7일 발행 예정 시각" — **지터·지연 흡수 반영 후의 실제 예상 시각**을 보여준다.

### S9. 발행 이력
- 필터(블로그·상태·기간), 상태 배지, `postUrl` 바로가기.
- 실패 건은 사유 + "재시도"/"수동 발행". **`SKIPPED` 건은 `skipReason`을 한국어 문장으로 풀어서 표시**(D8) — 조용히 사라진 것처럼 보이면 안 된다.

### S9d. 잡 상세
- **단계 타임라인**: `JobEvent` 세로 배치 — 요청됨 09:00:00 → 수령 09:00:12 → 로그인확인 09:00:15 → 에디터열림 09:00:31 → 작성완료 09:01:12 → 발행클릭 09:01:20 → 확인됨 09:01:34. 단계별 소요시간(델타) 표시.
- **[D5] 발행 본문 스냅샷**: `titleSnapshot` / `bodySnapshotHtml` / `tagsSnapshot`. 글감이 나중에 수정·삭제돼도 실제 올라간 내용을 보여준다.
- 검증 잡이 붙은 경우 그 결과도 같은 타임라인에 이어서 표시(`verifyTargetJobId` 역참조).
- `UNVERIFIED` 건은 **"이미 올라갔을 수 있으니 블로그를 먼저 확인하세요"** 경고 + 재발행 버튼 기본 비활성(체크박스 명시 확인 시 활성).

### S10. 요금제 · 결제
- 현재 플랜, 애드온 토글(추가 블로그 수 / AI 글감 대행), 다음 결제일, 해지.
- **[D5] 결제 이력 테이블** — `Payment` 기준: 결제일·금액·기간·상태·영수증 링크.
- 금액은 `Plan.priceKrw`에서 렌더 — 화면은 만들되 값은 9장 #2 결재 후 주입.

### S11. 계정 설정
- 프로필, 타임존, 알림 설정, 데이터 내보내기, 탈퇴.
- **"우리가 저장하지 않는 것" 고지 블록** 상시 노출(비번·세션쿠키). 신뢰가 판매 포인트라 화면에 못 박는다.

### A1. 운영자 콘솔 (내부) — **`User.role = ADMIN` 전용**
- **[D5] 접근 제어**: 미들웨어에서 `role !== ADMIN`이면 `/admin/*`을 404로 응답(403이 아니라 404 — 존재 자체를 숨긴다). 진입 시도는 `AuditEvent`에 기록.
- 테넌트 목록, 잡 성공률/실패코드 분포, 에이전트 버전 분포, 오프라인 비율, **`SKIPPED`/`DEFERRED` 발생률**(3-A-6 설계가 실제로 먹히는지 보는 계기판).
- **실패코드 분포가 1순위 지표** — `EDITOR_DOM_CHANGED` 급증은 네이버 에디터 개편이고 전 고객 동시 장애다. 임계치 초과 시 즉시 경보.

---

## 5. PC 에이전트 ↔ 서버 인터페이스 스펙

Base URL `https://{app}/api/agent/v1` · HTTPS · JSON · 인증 `Authorization: Bearer <agentToken>`(페어링 제외).
공통 응답 헤더 `X-Server-Time`(RFC3339). **에이전트는 로컬 시계를 신뢰하지 않고 서버 시간을 기준으로 삼는다** — 사용자 PC 시계가 틀어져 있으면 발행 시각이 통째로 어긋난다.

### 5-1. 페어링 프로토콜

```
[대시보드]                [서버]                     [PC 에이전트]
    │  코드 발급 요청 ──────▶│
    │◀── "K7Q2-M4XR" (10분) │  DB엔 sha256(코드)만 저장
    │   사용자가 코드를 에이전트 창에 입력 ─────────────▶│
    │                        │◀── POST /pair {code, device, ver} ──│
    │                        │   코드해시 조회·만료·사용여부 검사   │
    │                        │── {agentId, agentToken, ...} ──────▶│
    │                        │   코드 usedAt 기록(1회용 소멸)      │
    │◀── 화면 자동 전환(폴링) │            토큰은 OS 자격증명 저장소에 보관
```

**`POST /pair`** (인증 불필요)
```jsonc
// 요청
{ "code": "K7Q2M4XR",
  "device": { "name": "사무실-데스크탑", "os": "Windows", "osVersion": "11", "machineIdHash": "<sha256>" },
  "agentVersion": "1.0.0" }
// 200
{ "agentId": "cl...", "agentToken": "<64자 랜덤>", "tokenExpiresAt": "2026-11-06T…Z",
  "pollIntervalSec": 60, "serverTime": "2026-08-08T…Z" }
```
| 실패 | 코드 |
|---|---|
| 400 `INVALID_CODE` | 코드 없음/형식오류 (실패 카운트 +1) |
| 410 `CODE_EXPIRED` | 10분 경과 |
| 409 `CODE_USED` | 이미 사용됨 |
| 429 `TOO_MANY_ATTEMPTS` | IP당 분당 5회 / 코드당 누적 5회 실패 시 코드 즉시 폐기 |

**설계 근거**
- 코드는 혼동문자(I·L·O·U) 제외 대문자·숫자 8자리 = 32⁸ ≈ 1.1조 조합. 10분 TTL + 5회 실패 폐기와 합치면 추측 공격이 성립하지 않는다.
- 코드·토큰 모두 **평문 미저장**(sha256). DB가 유출돼도 남의 에이전트를 조종할 수 없다.
- 토큰 90일, 만료 30일 전부터 `/token/rotate`로 무중단 갱신. 대시보드에서 해제하면 `revokedAt` 즉시 세팅 → 다음 요청부터 401.
- 페어링에 **네이버 비번은 물론 사용자 이메일조차 필요 없다.**

### 5-2. 하트비트 / 잡 수신 (폴링)

**결정: WebSocket 상시연결이 아니라 폴링.** 사용자 PC는 NAT·기업방화벽 뒤에 있고 노트북은 절전·네트워크 전환이 잦아 상시연결 재접속 관리가 그 자체로 실패 원인이 된다. 발행 시각 정밀도는 분 단위면 충분하고(±10분 지터를 주는 마당에 초 단위는 무의미), 폴링이 방화벽을 가장 잘 통과한다.

**폴링 주기(제안)** — 값은 서버가 `nextPollSec`로 지시하고 **에이전트는 하드코딩하지 않는다**(서버만 고쳐서 전체 조절 가능해야 한다).

| 상황 | 주기 |
|---|---|
| 평시 | **60초** |
| 슬롯 예정시각 T−5분 ~ T+30분 | **15초** |
| 잡 실행 중 | 폴링 중단, 진행 이벤트가 하트비트를 겸함(최소 30초마다 1회) |
| 서버 5xx/네트워크 오류 | 지수 백오프 30초→10분 상한, 지터 ±20% |
| 401(revoked) | 폴링 영구 중단 + 트레이 알림 |

트래픽: 1명·평시 60초 = 하루 약 1,440 요청. 200명이면 약 29만 요청/일, 응답 본문 200바이트 수준. **[미검증 — 계산치, 베타에서 실측 필요]**

**`POST /heartbeat`**
```jsonc
// 요청 — ★쿠키·비번·세션토큰은 절대 담지 않는다
{ "agentVersion": "1.0.0", "runState": "IDLE",
  "naver": { "loggedIn": true, "blogIds": ["myshop2020"] },
  "currentJobId": null }
// 200
{ "serverTime": "…", "nextPollSec": 60, "pendingJobs": 0,
  "commands": [ { "type": "UPDATE_AVAILABLE", "version": "1.1.0" } ] }
```
- `commands`: `REVOKE` / `UPDATE_AVAILABLE` / `RESYNC_BLOGS` / `PING_LOG`.
- **오프라인 판정**: `lastSeenAt + max(180초, 3 × nextPollSec)` 경과. 3배인 이유는 폴링 1~2회 유실을 오프라인으로 오인하지 않기 위해서다.

**`POST /jobs/claim`** — 잡 수령(GET이 아닌 이유: 리스를 거는 상태 변경)
```jsonc
// 요청
{ "max": 1, "capabilities": { "editor": "se3", "browser": "chrome" } }

// 200 — 발행 잡
{ "serverTime": "2026-08-09T00:00:03Z",
  "jobs": [ {
    "jobId": "cl…", "kind": "PUBLISH", "idempotencyKey": "…",
    "blog": { "id": "cl…", "naverBlogId": "myshop2020" },
    "scheduledAt": "2026-08-09T00:00:00Z", "expiresAt": "2026-08-09T03:00:00Z",
    "leaseExpiresAt": "2026-08-09T00:15:00Z",
    "content": { "title": "…", "bodyHtml": "…", "tags": ["…"],
                 "categoryName": "일상", "openType": "PUBLIC", "allowComment": true }
  } ],
  "skipped": [] }

// 200 — [D4] 검증 잡
{ "serverTime": "…",
  "jobs": [ {
    "jobId": "cl…", "kind": "VERIFY", "idempotencyKey": "…",
    "blog": { "id": "cl…", "naverBlogId": "myshop2020" },
    "leaseExpiresAt": "…",
    "verify": { "targetJobId": "cl…", "expectedTitle": "…",
                "contentHash": "sha256:…", "since": "2026-08-09T00:01:00Z",
                "toleranceSec": 600 }
  } ],
  "skipped": [] }

// 200 — [D8] 내줄 잡이 제약에 걸린 경우 (사유를 반드시 실어 보낸다)
{ "serverTime": "…", "jobs": [],
  "skipped": [ { "jobId": "cl…", "reason": "MIN_INTERVAL_12H",
                 "detail": { "lastPublishAttemptAt": "…", "retryAfterSec": 4200 } } ] }

// 204 — 내줄 것도 알릴 것도 없음 (본문 없음)
```
- **리스(lease)**: 수령 시 `LEASE`(15분) 임대, 진행 이벤트로 갱신(`SL2`의 자기 잡 재예약 경로). **에이전트가 죽어도 같은 잡을 다시 내주지 않는다** — 리스 만료는 `R1`이 처리한다(`R1-a` 결과 미상 → `UNVERIFIED` → 검증 잡 / `R1-b` 미수령이면 `EXPIRED` + 자리 해제). rev3까지 있던 "만료 후 재수령" 문구는 **`R1`과 정면 충돌하는 중복 서술이라 삭제했다**(3차 반려 ③).
- 서버는 이 시점에 `L4`를 수행한다 — `G1(blog, now())` ∧ `G2` ∧ `SL2`. 위반 시 `DF1`~`DF2`(지연 흡수) 또는 `SKIPPED` 후 위 `skipped` 배열로 사유를 알린다. **판정 로직은 3-A에만 있고 여기서는 호출만 한다.**
- `reason` 값은 **2-5의 표준 6개**를 그대로 쓴다(여기서 따로 정의하지 않는다 — rev2의 불일치 원인).
- `max`는 1 권장 — 한 PC가 두 글을 동시에 쓰면 에디터가 충돌한다.

**`POST /jobs/{jobId}/events`** — 진행 보고 (리스 갱신 겸용)
```jsonc
{ "events": [ { "type": "EDITOR_OPENED", "at": "…", "detail": { "ms": 3120 } } ],
  "renewLease": true }
// 200 → { "leaseExpiresAt": "…", "abort": false, "abortReason": null }
```
- `abort:true`면 에이전트 즉시 중단. **`abortReason`은 두 가지다(2026-08-08 확장 — 페이즈2 검수 반례 R2).**
  - `CANCELED` — 사용자가 취소했다.
  - **`JOB_EXPIRED` — 잡의 수명(`expiresAt` = `plannedAt + SLOT_TTL`)이 끝났다.** 이때 서버는 **리스 갱신을 거부한다**(`renewLease:true`여도 `leaseExpiresAt`이 한 톨도 안 밀린다).
- **왜 이 확장이 필요한가**: 이게 없으면 리트라이 루프에 빠진 에이전트가 진행 이벤트만 계속 쏴서 리스를 무한 갱신할 수 있고, 그러면 `R1-a`(리스 만료)도 `R1-b`(`QUEUED` 한정)도 그 잡을 못 걷어 **`INV6`로 블로그가 무기한 잠긴다**(5-2-1 R2 반례).
- **왜 `job-reaper`가 강제 종료하지 않는가**: 에이전트가 살아 있는데 서버가 잡을 종료시키면, 뒤늦게 도착하는 **진짜 `/result`가 "이미 끝난 잡"으로 취급돼 멱등 처리에 삼켜진다**(실제 발행 결과가 조용히 유실). 갱신만 거부하면 리스가 자연 만료되고 `LEASE`(15분) 안에 `R1-a`가 평소 경로로 `UNVERIFIED` 처리한 뒤 검증 잡이 실제 결과를 회수한다. **이 보장은 에이전트가 `abort`를 지키는지와 무관하다** — 갱신 거부의 주체가 서버라서 잠금 상한이 `expiresAt + LEASE`로 고정된다.
- **단, 이벤트 기록 자체는 막지 않는다.** 이미 발행 버튼을 눌렀다면 `PUBLISH_SUBMITTED`가 들어와야 `publishAttemptAt`이 찍히고 `INV4`·`G1`이 성립한다. 막는 쪽이 더 위험하다.
- 서버는 `PUBLISH_SUBMITTED` 수신 시 **`publishAttemptAt`을 기록한다**(규칙 `SL3`).

**`POST /jobs/{jobId}/result`** — 최종 결과
```jsonc
// 발행 잡
{ "idempotencyKey": "…", "kind": "PUBLISH",
  "outcome": "VERIFIED",            // VERIFIED | UNVERIFIED | FAILED
  "postUrl": "https://blog.naver.com/myshop2020/223…",
  "postedAt": "…", "errorCode": null, "errorMessage": null }
// 200 → { "accepted": true, "duplicate": false, "nextAction": "IDLE" }

// [D4] 검증 잡
{ "idempotencyKey": "…", "kind": "VERIFY",
  "outcome": "FOUND",               // FOUND | NOT_FOUND | INCONCLUSIVE
  "postUrl": "https://blog.naver.com/myshop2020/223…",
  "matchedAt": "…", "candidatesChecked": 12 }
// 200 → { "accepted": true, "targetJobStatus": "VERIFIED" }
```
- `idempotencyKey`가 이미 처리됐으면 `{"accepted":true,"duplicate":true}` + **200**. 에러를 주지 않는다 — 에러를 주면 에이전트가 재시도를 반복하다 중복 발행으로 이어진다.
- `nextAction`: `IDLE` | `VERIFY_LATER`(UNVERIFIED → 60초 후 검증 잡) | `STOP`.

**에이전트 실패코드 표준** (`errorCode`)
| 코드 | 의미 | 서버 처리 |
|---|---|---|
| `NAVER_LOGGED_OUT` | 세션 없음/만료 | 재시도 안 함. "네이버 로그인 필요" 알림 |
| `CAPTCHA_REQUIRED` | 캡차·추가인증 | 재시도 안 함. 사용자 개입 요청 |
| `EDITOR_DOM_CHANGED` | 에디터 구조 변경 | 재시도 안 함. **운영자 즉시 경보**(전체 장애 신호) |
| `BROWSER_UNAVAILABLE` | 크롬 없음/attach 실패 | 5분 후 1회 재시도 |
| `NETWORK` | 네트워크 오류 | 백오프 재시도(최대 3) |
| `NAVER_RATE_LIMITED` | 네이버 제한 | 당일 해당 블로그 발행 중단 |
| `CONTENT_REJECTED` | 본문 거부(길이·금칙어) | 재시도 안 함. 글감 `FAILED` |
| `VERIFY_NOT_FOUND` | [D4] 검증 결과 글 없음 | 대상 잡 `FAILED`, 재시도 허용 |
| `UNKNOWN` | 그 외 | 1회 재시도 후 중단 |

**`POST /token/rotate`** — 구 토큰으로 인증 → 신 토큰 발급, 구 토큰 5분 유예 후 폐기.
**`GET /release/latest`** — 자동 업데이트용(버전·서명된 설치파일 URL·sha256).

> **★[페이즈2 구현 중 발견 2026-08-08] "구 토큰 5분 유예"는 승인된 스키마로 구현 불가.**
> 2-2의 `Agent`에는 `tokenHash`가 **한 개뿐**이라 신·구 토큰을 동시에 살려둘 자리가 없다. 현재 구현은 **교체 즉시 구 토큰이 죽는다**(응답에 `oldTokenRevokedImmediately: true`로 밝힌다 — 없는 기능을 있는 척하지 않는다).
> **선택지**: ㉠ `Agent.previousTokenHash` + `previousTokenExpiresAt` 두 컬럼 추가(스키마 변경, 유예 실현) **(내가 추천)** ㉡ 유예를 포기하고 5-1 문구를 "즉시 교체"로 수정 — 교체 요청은 에이전트가 idle일 때 하므로 실패해도 다음 폴링에서 재시도하면 되고, 실제 위험은 "교체 응답을 못 받은 채 구 토큰이 죽는" 드문 경우뿐이다(그때는 재페어링 필요).
> 형 결재 대상은 아니고 페이즈2 내 기술 결정이다. 에이전트 실물을 만들 때 확정한다.

### 5-2-1. [페이즈2 구현 현황 2026-08-08] 연결 골격 완료

설계 8장 4항("발행 로직보다 페어링·폴링·하트비트 골격을 먼저")에 따라 **엔드포인트 7개 전부 구현**하고 실제 DB·실제 HTTP로 검증했다. 레포 `D:\Develop\nblog-saas` 커밋 `9589b60`.

| 엔드포인트 | 구현 | 검증 |
|---|---|---|
| `POST /pair` | 코드 sha256만 저장 · 1회용 소멸 · 코드당 5회 실패 시 폐기 · IP당 분당 5회 | 성공/CODE_USED/CODE_EXPIRED/INVALID_CODE/429 5경로 + "DB에 코드·토큰 원문이 없음"을 원문 조회 0건으로 확인 |
| `POST /heartbeat` | `nextPollSec` 서버 지시(평시 60초 / 슬롯 근처 15초) · 401은 `TOKEN_REVOKED`까지 구분 | 폴링 주기 분기 · 오프라인 판정 `max(180초, 3×nextPollSec)` 경계값 4종 |
| `POST /jobs/claim` | 방어선 `L4` = `G1(now)` ∧ `G2` ∧ `SL2`, 위반 시 `DF1`~`DF2` | 슬롯 예약·리스 부여 · 재수령 금지 · `DF2` 흡수/건너뜀 **두 분기 모두** · 스킵 사유 4종 · 테넌트 격리 |
| `POST /jobs/{id}/events` | `PUBLISH_SUBMITTED` → `SL3` ⓘ · 리스 갱신(자기 잡 재예약) | `publishAttemptAt`·`consumedAt` 동시 기록, `INV4` 무위반 |
| `POST /jobs/{id}/result` | 멱등 · `SL3` ⓙ · `UNVERIFIED` → 검증 잡 · `NOT_FOUND` → `R1-c` | 중복 보고 부작용 0 · 자리 완전 복구 · 자동 재시도 미발생 |
| `POST /token/rotate` | 즉시 교체(위 유예 미구현 주석 참고) | 구 토큰 401 / 신 토큰 200 |
| `GET /release/latest` | 미설정 시 **503 + 누락 항목** (가짜 URL 하드코딩 금지) | 미설정/설정 양쪽 |

- 테스트 **70개** 전부 실제 Postgres에 대고 통과. 뮤테이션으로 새 테스트가 실제로 잡는 것을 확인했다(`SL3` ⓙ 제거 · 멱등 가드 제거 · 테넌트 격리 제거 · **`G3` 3중 방어 제거**).

**★[2차 검수 치명 2026-08-08] `claim`에 블로그 단위 배타가 없어 12시간 하드룰이 뚫렸다 — 수리 완료.**
원인·규범 정의는 **3-A-3**에 있다(여기서 로직을 다시 쓰지 않는다). 여기서는 조치 결과만 적는다.

| 층 | 조치 |
|---|---|
| 규범 | 3-A-3에 `G3` 신설, 틀린 문장("`SL2`가 같은 일을 더 정확히 한다")을 폐기 원문과 함께 기록. 3-A-2에 `INV6`, 3-A-8 `L4` 행에 `G3` 추가 |
| 앱 | `L4` 전체(`G1`·`G2`·`G3`·`SL2` + 수령 전이)를 **`Blog` 행을 `FOR UPDATE`로 잠근 하나의 트랜잭션**으로 합침. 수령 UPDATE의 WHERE에도 `G3` 조건 포함 |
| DB | 제약 10(`publish_job_one_inflight_per_blog`) 신설 — 마이그레이션 `20260808120000_blog_inflight_exclusion` |
| 테스트 | `F8` 2종 신설. **수리 전에 먼저 돌려 둘 다 실패하는 것을 확인**하고, 수리 후 통과로 바뀌는 것을 확인했다 |

**층별 기여도를 분리 측정했다**(둘 다 켜두고 "통과했다"로 끝내지 않았다):
- 앱 3중(잠금·`G3`·원자 UPDATE 조건)을 **전부 제거** → `F8` 2종 모두 실패.
- 앱은 그대로 두고 **DB 제약 10만 제거** → `F8` 2종 **통과**(실패는 "부분 유니크 3개" 개수 테스트 하나뿐). 즉 **실제로 막는 것은 앱 계층이고 제약 10은 최후 방어선**이다. 제약 8이 그랬듯 이 인덱스가 발동하면 그 자체가 앱에 구멍이 있다는 신호다.
- 규칙(`G1`·`G2`·`SL2`·`SL3`·`SL4`·`SL4-SWEEP`·`R1-c`·`DF1~DF4`)은 `src/server/rules/` 한 곳에만 두고 라우트는 **호출만** 한다 — 3-A의 단일 정의 원칙을 코드 구조로 옮긴 것.
- **아직 없는 것**: 대시보드 화면 13개 · NextAuth 세션 · 5-3 cron **7종**(`job-reaper`는 완료 — 5-3-1) · 시트 동기화 · 에이전트 실물(트레이 앱). 지금은 잡이 이미 있다고 가정하고 수령·보고 경로만 도는 상태다.
  > **[2026-08-09 갱신]** 이 목록은 5-2-1 시점 기준이다. 이후 `slot-planner`(5-3-2)·`sheet-sync`+스케줄 등록(5-3-3)이 붙어 **cron은 4/8**, 글감 공급과 잡 생성이 실제로 돈다. 남은 cron 4종은 `agent-watch`·`ai-draft`·`integrity-check`·`retention`이고, **에이전트 실물과 대시보드 화면은 그대로 없다.**
- **★[전제조건 미충족 → 2026-08-08 해소, 단 한 번 정정을 거쳤다]** `INV6`(블로그 단위 배타)는 **`job-reaper`가 있어야 안전한 방어**였다. reaper가 없던 동안은 걷히지 않은 `CLAIMED` 잡 하나가 **그 블로그의 후속 발행을 무기한 막았다**(`expiresAt` 3h 상한도 `EXPIRED` 전이를 reaper가 하므로 자동 발동하지 않았다). `job-reaper` 구현으로 **리스가 만료되는 경로는** 해소됐고, 상태값이 아니라 `claim` 결과로 확인했다(5-3-1 회귀 `F9-②`).
  > **[검수 반려 R2 · 반례] "해소됐다"는 최초 단정은 과했다.** 잡이 `CLAIMED`인데 `expiresAt`은 지났고 **리스는 진행 이벤트로 계속 갱신되는** 경로가 남아 있었다 — `R1-a`는 리스가 살아 있어 대상이 아니고 `R1-b`는 술어가 `QUEUED` 한정이라 역시 대상이 아니다. reaper를 돌려도 0/0이고 형제 잡은 계속 `BLOG_BUSY`다(검수 재현). 자동화가 리트라이 루프에 빠져 이벤트만 계속 쏘면 **3시간 상한과 무관하게 블로그가 잠긴다.** 구현이 3-A-5 문언을 따른 것은 맞지만, 문제는 내가 "해소"라고 단정한 것이다. → 5-2 규범을 확장해 **닫았다**(아래 `abort` 항목). 지금의 잠금 상한은 **`expiresAt + LEASE`(최대 15분)** 이고 `F9-②-b`가 이를 못 박는다.
- **[3차 검수 수정]** `G3`의 적용 범위를 수령 대상이 `PUBLISH`인 경우로 좁혔다. 초기 구현은 원자 UPDATE가 대상 잡의 kind를 안 가려 **검증 잡까지 `BLOG_BUSY`로 튕겼고**, 그러면 `UNVERIFIED`의 유일한 구제 경로가 봉인된다. 규범(3-A-3)과 구현이 **같은 술어**를 쓰도록 규범을 먼저 고치고 코드를 맞췄다. 회귀테스트 1종 + 반례 1종 추가(수리 전 실패 → 수리 후 통과 → 뮤테이션으로 재사망 확인).
- **[미구현 → 2026-08-08 해소]** `DF3`(연속 흡수 8 **초과** → 경보 + 블로그 자동 일시중지)와 `DF4`(무발행 **4 이상** → 경보 + 사용자 알림)는 카운터 증감만 있고 임계 평가가 없어 "숫자만 쌓이고 아무 일도 안 일어나는" 상태였다. `job-reaper` 사이클 ⑤단계로 붙였다(5-3-1). **사용자 알림의 발송 채널(이메일 등)은 여전히 없어서 `AuditEvent`에 `delivered:false`로 기록만 한다** — 없는 기능을 있는 척하지 않기 위해 값으로 명시한다.
- **[미검증]** IP 레이트리밋이 **프로세스 메모리** 기반이라 인스턴스가 여러 개면 인스턴스마다 따로 센다. 배포 형태 확정 시 공유 저장소로 옮겨야 한다.
- **[환경 주의]** 테스트 DB는 `bun run db:test:setup`으로 마이그레이션 원문에서 **매번 새로 만든다**(Prisma CLI가 셸의 `DATABASE_URL`보다 `.env`를 우선하는 것을 실측해서, `migrate deploy`를 테스트 DB에 쓸 수 없다). 로컬 포터블 Postgres는 검수 중 한 번 죽은 적이 있다 — CI 이관 시 **DB 크래시를 테스트 실패로 오진하지 않도록** 접속 헬스체크를 앞에 두는 것을 권한다.

### 5-3. 서버 내부 스케줄러 (cron)

| 잡 | 주기 | 하는 일 |
|---|---|---|
| `slot-daily` | 블로그 타임존 매일 00:05 | **`SL1` — 그날의 `PublishSlot` 행 생성**(`Schedule`의 요일·enabled 반영, `plannedAt` 확정, 지터 적용 전) |
| `slot-planner` | 5분 | 앞으로 `PLAN_LEAD` 내 슬롯 스캔 → `PublishJob` 생성(글감 바인딩 · 본문 스냅샷 확정 · `J1` 지터 확정 · `L2` 검사) |
| `sheet-sync` | 15분 | 시트 → `ContentItem` 동기화 + 결과 write-back |
| `job-reaper` | 1분 | 리스 만료 처리(`R1-a`/`R1-b`) / `expiresAt` 초과 잡 `EXPIRED` + 알림 / **구제 검증 잡 보충(3-C)** / **`SL4-SWEEP` 자가복구**(트리거 ⓩ — `INV4`가 깨진 슬롯을 매분 되돌림) / **`DF3`·`DF4` 임계 평가** |
| `agent-watch` | 1분 | 오프라인 전환 감지 → 알림(6시간 쿨다운) |
| `ai-draft` | 1시간 | 업셀 사용자 글감 부족분 로컬 LLM 배치 생성 |
| `integrity-check` | 일 1회 | `INV1`·`INV4`·`INV5` 위반 **탐지 + 복구**(`SL4-SWEEP` 실행) + `AuditEvent` 기록. rev6까지는 탐지만 하고 복구 정의가 없었다(6차 반려) |
| `retention` | 일 1회 | `JobEvent` 90일 / `AuditEvent` 365일 삭제 |

### 5-3-1. [페이즈2 구현 현황 2026-08-08] `job-reaper` 완료 (cron 8종 중 1종)

레포 `D:\Develop\nblog-saas`. 엔드포인트 `POST|GET /api/internal/cron/job-reaper`(시크릿 헤더 `CRON_SECRET`, 미설정 시 **503 + 누락 항목**). 한 사이클의 순서는 아래와 같고, **판정 로직을 새로 쓰지 않고 3-A의 규칙 함수를 부르기만 한다.**

| 단계 | 규칙 | 동작 | 회귀 |
|---|---|---|---|
| ① | `R1-a` | in-flight인데 리스가 끝난 잡 → `UNVERIFIED`(+`SL3` ⓚ로 `publishAttemptAt = claimedAt`, 자리 CONSUMED) + **검증 잡 생성**. 검증 잡 자신이 리스 만료면 `FAILED` | `F9-①` |
| ② | `R1-b` | 한 번도 수령 안 된 채 `expiresAt` 초과(또는 `QUEUED`인데 리스 시각이 남은 이상 상태) → `EXPIRED` + `SL4` 자리 해제 + `DF4` +1 + 알림 기록 | `F9-③` |
| ③ | 3-C | 살아있는 검증 잡이 하나도 없는 `UNVERIFIED`에 검증 잡 **보충**(상한 3회, 넘으면 사람에게 넘기고 감사 1건) | `F9-④` |
| ④ | `SL4-SWEEP` | `INV4`가 깨진 슬롯 자가복구(트리거 ⓩ). 멱등 | `F9-⑤` |
| ⑤ | `DF3`·`DF4` | 임계 평가 → `DF3`(>8) 경보 + **블로그 자동 일시중지** / `DF4`(>=4) 경보 + 사용자 알림 기록 | `F9-⑥⑦` |

- **순서에 이유가 있다**: ①②가 잡 상태와 `publishAttemptAt`을 바꾸므로 ④ 스윕은 그 뒤라야 같은 사이클에서 정리되고, ⑤는 ②가 올린 `DF4` 카운터까지 보고 판정한다(`F9-⑦`에 그 연쇄를 못 박았다).
- **TOCTOU 가드**: 후보 SELECT와 전이 UPDATE 사이에 에이전트가 리스를 갱신하거나 결과를 보고할 수 있다. **선택 술어와 전이 술어를 같은 상수 하나로 쓰고** 전이는 그 술어를 WHERE에 포함한 원자적 UPDATE다. 1행이 아니면 건드리지 않는다(`F9-①-b`).
- 테스트 **110개**(신규 40) 전부 실제 Postgres 통과.

> **★[검수 반려 R1 — 내 검증 주장이 사실과 달랐다 · 정정]**
> 최초 제출문의 "**뮤테이션 16종을 넣어 전부 죽는 것을 확인**"은 **사실이 아니었다.** 검수가 25종을 독립으로 심어 돌리자 **4종이 살아남았고**, 하필 이번 커밋의 ★치명 수리 지점이었다:
>
> | 살아남은 뮤테이션 | 왜 안 죽었나 |
> |---|---|
> | `runJobReaper`의 `ensureUtcSession(db)` 호출 삭제 | 검사 **함수**만 테스트하고 **호출 배선**은 아무도 안 봤다 |
> | `claimJobs`의 `ensureUtcSession(prisma)` 호출 삭제 | 위와 동일 |
> | `VERIFY_MAX_ATTEMPTS` 3 → 99 | 테스트가 상수를 `import`해 써서 값이 고정되지 않았다 |
> | `REAP_BATCH` 200 → 1 | 위와 동일 |
>
> 즉 "세션이 UTC가 아니면 아예 안 돈다"는 이번 라운드의 핵심 방어에 **회귀 테스트가 0개**였다. 그 한 줄이 나중에 지워지면 테스트는 전부 초록인 채 배포되고 잡이 조용히 몰살된다 — 이 문서가 여섯 라운드 앓은 **"방어가 조용히 사라진다"** 병 그대로다.
>
> **원인 두 개를 분리해 적는다.** ⓐ *검사 대상을 잘못 골랐다* — 함수의 동작만 보고 "그 함수가 실제 경로에 붙어 있는가"를 안 봤다. ⓑ *뮤테이션 하네스가 조용히 no-op이었다* — 재검증 중 `perl` 치환 패턴이 CRLF 줄바꿈과 안 맞아 **3종이 적용조차 안 된 채 "살아남음"으로 집계**됐다(첫 라운드에 LF였던 파일이 커밋을 거치며 CRLF가 됐다). 지금은 뮤테이션마다 **적용 여부를 `grep`으로 먼저 확인**하고 미적용이면 그렇게 표시한다. 이 가드가 없었으면 이번에도 오판했다.
>
> **조치**: 배선 회귀 2종(비-UTC 접속으로 실제 `runJobReaper`·`claimJobs`를 호출. 트랜잭션 안 `SET LOCAL`이 아니라 `options=-c timezone=Asia/Seoul` 접속을 따로 열어야 배선이 잡힌다 — startup 옵션이 `ALTER DATABASE` 기본값을 덮는 것을 실측 확인) + 상수 리터럴 고정 3종(`VERIFY_MAX_ATTEMPTS`=3 · `REAP_BATCH`=200 · `DF3`=8·`DF4`=4). **위 4종을 다시 심어 전부 죽는 것을 확인**했고, 이번 라운드에 새로 붙인 방어 3종(R2·W1·W2)도 같은 방식으로 죽는 것을 확인했다. **W1 테스트는 처음에 뮤테이션이 살아남아서** — 새 잡의 `finishedAt`이 NULL이라 `NULLS FIRST`로 오히려 맨 앞에 정렬돼 기아가 재현되지 않았다 — 테스트를 고치고 다시 확인했다.

**★[실측 발견 · 치명] DB 세션 타임존이 UTC가 아니면 reaper가 정상 잡을 몰살한다.**

시각 컬럼은 전부 `timestamp without time zone`이고 "UTC를 담는다"는 약속(2장)인데, 그 약속을 지키는 주체가 **둘로 갈라져 있었다** — Prisma 모델 API는 항상 진짜 UTC로 쓰고, **raw SQL의 `now()`와 raw 파라미터로 넘긴 JS `Date`는 세션 타임존의 벽시계로** 쓴다. 로컬 DB 세션이 `Asia/Seoul`이라 둘이 정확히 9시간 어긋났다.

```
js now            2026-08-08T13:33:03.859Z
raw now()         2026-08-08T22:23:03.840Z   ← +9h
ORM 저장값        2026-08-08T13:33:03.845Z
ORM 저장값 <= now()  → true                  ← 10분 "뒤"인 시각이 만료로 판정
```

`R1-a`는 `leaseExpiresAt <= now()`로 대상을 고르므로, **막 수령된 잡까지 전부 리스 만료로 걷어 `publishAttemptAt`을 찍고 `UNVERIFIED`로 만든다** — 발행하지도 않은 잡이 "발행됐을지도 모름"이 되고 자리가 소모된다. 기존 코드에서 이 결함이 안 보였던 이유는 `SL2`·`SL4`가 **쓰기도 SQL, 읽기도 SQL**이라 같은 방식으로 틀려 서로 상쇄됐기 때문이다(자기들끼리만 일관). reaper가 처음으로 **ORM이 쓴 값을 SQL로 비교**하면서 드러났다.

- **채택 해법**: 세션 타임존을 UTC로 **강제**하고(접속 URL `options=-c timezone=UTC` + 로컬 DB `ALTER DATABASE ... SET TimeZone='UTC'`), 아니면 **아예 안 돈다**(`DbTimezoneError`). 검사는 `SHOW timezone` 문자열이 아니라 동작(`now()::timestamp = now() AT TIME ZONE 'UTC'`)으로 한다.
- **기각한 대안**: "우리 SQL의 `now()`를 전부 `now() AT TIME ZONE 'UTC'`로 바꾸기" — **반쪽짜리**다. `now()`는 고쳐도 **raw 파라미터로 넘기는 JS `Date`의 변환은 세션 타임존이 결정**하므로 규칙마다 보정 여부가 갈린다. 그건 이 문서가 여섯 라운드 앓았던 병(정의가 두 곳으로 갈라짐)을 시간 축에서 재발시키는 것이다.
- 회귀 `F9-⑪`: ORM이 쓴 값과 raw `now()`의 오차 1분 미만 / 세션을 `Asia/Seoul`로 비틀면 검사기가 실제로 던지는지(트랜잭션 안 `SET LOCAL`로 확인).

**★[문서 정정] 5-3 표의 `job-reaper` 행에서 "지연 흡수 재예약(`DF1`~`DF2`)"을 뺐다.**
3-A-8이 정의하는 방어층은 `L1`~`L4` 넷뿐이고 `DF1`~`DF2`를 부르는 층은 `L2`(잡 생성)와 `L4`(잡 수령)로 못 박혀 있다. reaper에서 또 부르면 ⓐ 3-A에 없는 다섯 번째 판정 지점이 생기고 ⓑ `blog.consecutiveDeferredSlots`가 슬롯 하나에 대해 여러 번 올라가 `DF3` 임계(>8)가 의미를 잃는다. **5-3과 3-A-8이 어긋나 있었고, "정의는 3-A에만 있다"는 이 문서 자체의 규칙에 따라 3-A-8을 따랐다.** 구현에서 조용히 빠뜨린 게 아니라 규범을 맞춘 것이고, 코드 주석에도 같은 근거를 남겼다.

**[해석을 밝힘] 3-C "검증 잡 3회 연속 `INCONCLUSIVE`면 중단"의 구현.**
대상 잡 하나에 붙는 **VERIFY 잡 행 수** 상한 3으로 구현했다. `INCONCLUSIVE`만 세면 PC가 계속 꺼져 있어 검증 잡이 실행조차 못 하고 만료되는 경우 **보충이 무한 재생성**된다(상한이 원리적으로 안 걸린다). 상한에 걸리면 대상 잡은 `UNVERIFIED`로 두고 자리는 **CONSUMED 유지**한다 — 발행됐을 수 있으므로 되살리면 중복 발행 위험이고, 이는 원칙 3("중복 발행은 실패보다 나쁘다")을 따른 것이다.

**[검수 권고 3건 처리 — 2026-08-08 2차]**

| # | 지적 | 처리 |
|---|---|---|
| W1 | 검증 잡 **보충 창에도 같은 기아**가 있다. 상한을 소진해 포기한 잡은 조건을 영원히 만족한 채 오래된 순 정렬의 앞자리를 차지해 `LIMIT` 안을 채운다(재현: 포기 2건 + 새 1건에서 `limit=2`면 새 대상 0건) | 후보 SQL에 **포기 감사기록(`VERIFY_GAVE_UP`)이 있는 잡 제외** 조건 추가. 회귀 `F9-④`. claim의 후보창 기아(`F9-⑩`)와 **같은 모양의 결함이 두 곳에 있었다**는 뜻이라, 앞으로 "정렬 + LIMIT" 후보 조회를 새로 쓸 때는 **영구히 조건을 만족하는 행이 창을 막는가**를 먼저 따진다 |
| W2 | `ensureUtcSession`의 통과 캐시가 **모듈 전역 boolean**이라 클라이언트 하나가 통과하면 다른 접속은 검사를 건너뛴다 | 주석으로 남기는 대신 **클라이언트별 캐시(`WeakSet`)로 교체**했다. 운영은 싱글턴 하나라 실해가 없었지만 그건 "지금 구성에서 우연히 안전한 것"이지 방어가 아니다. 회귀 1종 |
| W3 | `kind` 우선순위가 **절대적**이라 due 검증 잡이 `max` 이상이면 그 폴에서 발행 잡이 안 나간다 | **의도된 트레이드오프**임을 코드 주석에 명시. 영구 기아가 아닌 근거: 검증 잡은 대상 하나당 최대 3건이고 읽기 전용이라 금방 끝나므로 발행은 다음 폴(60초/15초)로 밀릴 뿐이고 슬롯 수명은 3시간이다. 반대로 발행을 앞세우면 구제 잡이 `expiresAt`까지 못 나가고 **되돌릴 수 없다**. 손해가 비대칭이다 |

**[남은 것 · 명시]**
- 알림 **발송 채널**(이메일/웹 푸시)이 없다. `DF4`·`JOB_EXPIRED`·`VERIFY_GAVE_UP`은 `AuditEvent`에 `delivered:false`로 **기록만** 된다.
- `R1-a`의 `publishAttemptAt = claimedAt`은 3-A-5 문언 그대로 구현했다. 다만 `claimedAt`은 실제 발행보다 **이른** 시각이라 12시간 게이트를 그만큼 느슨하게 만든다. 편차 상한은 `LEASE`(15분)이고 `TOLERANCE`(45분) 안이라 규범을 바꾸지 않았다. **의도된 성질임을 여기 적어 둔다.**
- reaper는 한 사이클에 잡 200건(`REAP_BATCH`)까지만 걷는다. 남은 건 다음 사이클이 본다.
- 동시 실행(호출이 겹침)은 전이가 전부 원자적 UPDATE라 중복 처리되지 않지만, **분산 락은 없다.**

### 5-3-2. [페이즈2 구현 현황 2026-08-08] `slot-planner` 완료 (cron 8종 중 2종)

레포 `D:\Develop\nblog-saas`. 엔드포인트 `POST|GET /api/internal/cron/slot-planner`(5분) + `/api/internal/cron/slot-daily`(`SL1`만). 인증·503 규약은 `job-reaper`와 동일(`CRON_SECRET`).

**여기까지 잡은 "이미 있다고 가정"된 존재였다**(5-2-1). 이 구현이 그 공급처를 붙였다 — 자리(`SL1`) → 잡(`L2`) → 수령(`L4`) → 회수(`job-reaper`)로 파이프라인이 처음 이어졌다.

| 단계 | 규칙 | 동작 | 회귀 |
|---|---|---|---|
| ① | `SL1` | `enabled`·`weekdays`가 맞는 `Schedule`마다 그날 자리 1행. `plannedAt` = 블로그 타임존 벽시계(**지터 전**). 멱등 | `F10-①` |
| ② | `J1` | `hash(blogId+slotDate)`로 그날 오프셋 1개를 뽑아 **두 자리에 공통** 적용 → 같은 날 간격이 정확히 12h | `F10-②` |
| ③ | `L2` | `PLAN_LEAD`(35분) 안의 자리에 `PublishJob` 생성 + 글감 바인딩 + 본문 스냅샷. `G1(그 잡의 scheduledAt)` ∧ `G2`, 위반 시 `DF1`→`DF2` | `F10-③⑥` |
| ④ | — | 글감 없음 → 예정시각 전엔 대기, 지나면 `SKIPPED(NO_CONTENT)` **자리당 1건만** + `DF4` +1 | `F10-④` |

**★[문서 불일치 · 정정 대상] `SL1`의 주체가 두 곳에 다르게 적혀 있다.** 3-A-4 `SL1`은 **"`slot-planner`가 매일 00:05"**인데, 5-3 표는 그 일을 **`slot-daily`라는 별도 cron 행**으로 둔다(rev5에서 "5-3에 슬롯 생성 누락"을 고치며 추가된 행이다). **3장이 유일 정의처라는 이 문서 자체 규칙에 따라 3-A-4를 따랐고**(`slot-planner`가 ①②를 다 한다), 5-3 표기도 죽이지 않으려고 `SL1`만 도는 `slot-daily` 라우트를 함께 뒀다. 두 스케줄이 동시에 걸려도 중복은 DB 유니크가 막는다.

**★"블로그 타임존 매일 00:05"를 5분 주기로 구현했다 — 정확성이 아니라 도달 가능성 문제다.** `plannedAt`이 블로그 타임존 기준이라 "매일 00:05"는 블로그마다 다른 UTC 시각이고, 스케줄러는 UTC 한 시각에만 걸린다. **타임존이 여럿이면 어떤 UTC 시각을 골라도 누군가의 00:05를 놓친다.** 그래서 `SL1`을 멱등하게 만들고 5분마다 돌린다(최대 5분 지연, `PLAN_LEAD` 35분 안이라 잡 생성에 영향 없음).

**[해석을 밝힌 것 3가지 — 설계문서가 정하지 않았다]**

| # | 설계가 안 정한 것 | 택한 해석과 근거 |
|---|---|---|
| ㉠ | **`ContentStatus` 전이 규칙**(enum만 있고 전이가 문서 어디에도 없다) | 선점 판정의 주체를 상태 컬럼이 아니라 **"그 글감을 쥔 잡이 있는가"**로 뒀다. 상태를 권위로 삼으면 `ASSIGNED`인 채 잡이 죽는 경로(만료·실패·취소)마다 되돌리는 코드가 필요하고 **그 코드가 지금 result 라우트에도 reaper에도 없다** — 하나만 빠져도 글감이 영구히 잠겨 발행이 멈춘다. 쥔 것으로 보는 상태는 `ACTIVE ∪ RISKY`이며, **`RISKY`를 넣는 것이 핵심**이다(`UNVERIFIED`는 올라갔을 수 있으므로 재배정하면 중복 발행 — 원칙 3). `consumedAt`을 `publishAttemptAt`의 파생값으로 격하한 `INV4`와 같은 처방이다 |
| ㉡ | **글감이 없을 때 `NO_CONTENT`를 언제 남기나**(7장은 "잡 생성 시 바인딩 실패"라고만) | 예정시각 **전**에는 기다리고(시트 동기화 15분 주기가 채울 수 있다), 예정시각이 지나면 **자리당 1건만** 기록한다. 매 패스마다 남기면 `DF4`가 슬롯 하나에 여러 번 올라 **무발행 경보가 거짓으로 울린다**. 글감이 늦게 도착하면 `attemptSeq+1`로 그 자리를 되살린다 |
| ㉢ | **플래너가 어느 자리까지 다시 채우나** | **`NO_CONTENT`로만 끝난 자리에만** 다시 만든다. `SKIPPED(MIN_INTERVAL_12H)` 자리까지 다시 채우면 `G1`에 계속 막혀 5분마다 새 `SKIPPED` 잡이 쌓인다. `SL5`(자리 재사용)는 **재시도·수동 발행**의 몫으로 남겼다 |

**[자체 검증]** 신규 회귀 **31종**(전체 **141** 통과, 실제 Postgres). 뮤테이션 **15종 중 14종 사망**, 각 뮤테이션은 **적용 여부를 먼저 확인**하고 집계했다(지난 라운드에 CRLF 때문에 미적용분이 "살아남음"으로 잘못 집계된 사고의 재발 방지).
- 죽은 것 중 특히: `ensureUtcSession` 호출 삭제(배선) / `G1`에 `scheduledAt` 대신 `now()`(3-B-2 위반) / 지터를 슬롯별로(12h 붕괴) / 후보창 우선순위 뒤집기(기아) / 글감 선점에서 `RISKY` 제외(중복 발행) / `expiresAt` 기준을 `scheduledAt`으로 / 벽시계 변환 2패스 삭제(DST 1시간 오차).
- **살아남은 1종 — 트랜잭션 안 재확인(`blocking.length > 0`) 삭제.** 단일 스레드에서는 바깥 후보창이 이미 걸러서 **이 가드에 도달할 수 없고**, 도달하는 유일한 경로인 동시 실행에서는 **DB 유니크(`(slotId, attemptSeq)` + `INV5` 제약 9)가 같은 것을 막는다**. 제거해도 중복 잡이 남지 않는 것을 `F10-⑦-b`로 확인했다. 즉 **이 가드는 정확성 방어가 아니라 "충돌을 예외 대신 무동작으로 바꾸는" 소음 방어**이며, 그렇게만 주장한다(제약 10의 층별 기여도 측정과 같은 성격).

**[남은 것 · 명시]**
- `ContentItem`을 `PUBLISHED`로 올리는 주체가 **없다**(발행 성공 경로의 몫). 위 ㉠ 때문에 기능적 문제는 없지만 화면 표시는 낡은 값을 보인다.
- 플래너는 한 패스에 자리 200개(`PLAN_BATCH`)까지만 본다. `SL1`은 상한 없이 전 `ACTIVE` 블로그를 돈다.
- ~~스케줄 등록(`vercel.json` 등 배포 설정)은 아직 없다 — 라우트만 있고 **아무도 안 부른다**. `job-reaper`도 같은 상태다.~~ → **해소(5-3-3)**. `vercel.json`에 등록했고, 등록 누락 자체를 회귀(`F11-②`)가 검사한다.
- `Schedule`의 시각을 나중에 바꿔도 **이미 만들어진 그날 자리의 `plannedAt`은 안 따라간다**(`SL1`은 생성만 멱등). 다음 날부터 반영된다.

### 5-3-3. [페이즈2 구현 현황 2026-08-09] cron **스케줄 등록** + `sheet-sync` 완료 (cron 8종 중 4종)

레포 `D:\Develop\nblog-saas`, 커밋 `713f378`(push 완료). 이 라운드가 메운 것은 **파이프라인의 양 끝**이다 — 앞쪽은 글감이 들어오는 입구(`sheet-sync`), 뒤쪽은 그 모든 것을 실제로 굴리는 시계(cron 등록).

#### (1) 스케줄 등록 — 5-3-2의 "[남은 것]" 해소

`vercel.json`의 `crons`에 네 개를 등록했다. Vercel Cron은 **GET + `Authorization: Bearer $CRON_SECRET`**으로 부르므로 기존 `authorizeCron`이 그대로 받는다(라우트 수정 불필요).

| 경로 | 등록 주기 | 설계 5-3 표 |
|---|---|---|
| `job-reaper` | `* * * * *` | 1분 ✓ |
| `slot-planner` | `*/5 * * * *` | 5분 ✓ |
| `sheet-sync` | `*/15 * * * *` | 15분 ✓ |
| `slot-daily` | `5 0 * * *` | "블로그 타임존 매일 00:05" — **정확히는 못 맞춘다**(아래) |

- **`maxDuration = 60`을 네 라우트에 명시했다.** 배치 상한이 200건인데 Vercel 함수 기본 실행 상한은 10~15초다. 타임아웃은 예외를 안 내므로 **앞부분만 처리되고 나머지가 조용히 밀린다** — 이 프로젝트가 반복해서 앓은 "조용히 안 도는" 병의 새 서식지가 될 뻔했다.
- **`slot-daily`의 등록 시각은 어느 블로그의 00:05도 아니다.** `plannedAt`이 블로그 타임존 기준이라 스케줄러의 UTC 한 시각으로는 원리적으로 못 맞춘다(5-3-2에 적은 이유 그대로). 그래서 이 등록은 **5-3 표의 행을 살려 둔 안전망**이고, 자리를 실제로 보장하는 것은 5분마다 도는 `slot-planner`다. cron 개수를 줄여야 하면 **가장 먼저 뺄 항목**이다.

**★[신규 회귀 `F11`] "라우트만 있고 아무도 안 부른다"를 검사 대상으로 올렸다.** 이번 갭의 본질은 로직 결함이 아니라 **배선 부재**였고, 그건 검수 R1이 지적한 "함수만 보고 호출 배선을 안 봤다"와 정확히 같은 사각지대다. 그래서 배선 자체에 회귀 8종을 붙였다:

| # | 검사 | 왜 |
|---|---|---|
| ⓪ | 주기가 5-3 표와 글자까지 일치 | 상수를 import해 비교하면 상수와 함께 따라가 아무것도 안 지킨다(R1의 `VERIFY_MAX_ATTEMPTS`) — **리터럴로 박았다** |
| ① | 등록된 경로가 `GET`을 내보냄 | Vercel Cron은 GET으로만 부른다. POST만 있으면 매분 405를 받는다 |
| ② | ★**디스크 라우트 폴더 / `vercel.json` / 테스트 목록이 같은 집합** | 셋 중 어디에만 있어도 죽는다. **새 cron을 만들고 등록을 잊는 이번 갭의 재발을 여기서 막는다** |
| ③ | `force-dynamic` + `nodejs` | 캐시가 붙으면 **도는 것처럼 보이면서 아무 일도 안 일어난다** |
| ④ | `maxDuration` 명시 | 위 |
| ⑤ | ★**cron 주기 < `PLAN_LEAD`(35분)** | 주기가 길면 리드 창에 잠깐 들어왔다 나가는 슬롯을 통째로 놓쳐 **발행이 조용히 0**이 된다. 둘 중 하나만 바꿔도 죽는다 |
| ⑤-b | 주기 파서 자체의 반례 | ⑤가 "항상 참"인 껍데기가 아님을 확인 |
| ⑥ | 시크릿 없으면 401 / 미설정이면 503 + 누락 항목 | Vercel이 보내는 헤더 형식 그대로 검증 |

> **⚠️ [형 결재 필요 · 신규] Vercel 요금제.** **Hobby는 cron 2개·하루 1회**가 상한인데 지금 등록은 **4개 + 분 단위**라 **Pro가 필요**하다. Hobby로 배포하면 등록이 거부되거나 하루 1회로 낮춰져 **1분 주기 reaper가 사실상 죽는다**(자가복구가 통째로 멈춘다는 뜻이다). 줄여야 한다면 순서는 ① `slot-daily` 제거(중복이라 무해) ② `sheet-sync` 30분. **`job-reaper` 1분과 `slot-planner` 5분은 설계 정확성에 직접 걸려 있어 못 늘린다.**

#### (2) `sheet-sync` — 글감의 유일한 공급원

엔드포인트 `POST|GET /api/internal/cron/sheet-sync`. 인증·503 규약은 다른 cron과 동일하고, 그 위에 **구글 자격증명 미설정 503**이 하나 더 있다(없는 걸 조용히 0건 성공으로 넘기면 "도는데 글감이 안 들어온다"를 원인 없이 보게 된다).

형 결재 3번 **㉠(서비스계정에 시트 공유)** 채택분이라 **사용자별 구글 토큰을 하나도 저장하지 않는다** — 6장 [D9]가 요구하던 `refresh_token` AES-256-GCM 설비가 통째로 사라졌다(㉠을 추천했던 두 번째 이유가 그대로 실현됐다). `googleapis` 의존성도 안 붙였다: 필요한 건 서비스계정 JWT(RS256) 서명 하나이고 `node:crypto`로 충분해서, 그 용도에 공급망을 늘릴 값이 없다.

| 단계 | 동작 |
|---|---|
| ① | 표준 헤더 9열 검사. **앞 6열이 어긋나면 한 행도 반영하지 않고** `SCHEMA_MISMATCH`. 뒤 3열이 없으면 동기화는 하되 write-back만 끈다 |
| ② | 행 파싱(희망일·태그·상태). 6칸이 전부 비면 오류가 아니라 "안 쓴 줄", 제목·본문이 빠지거나 날짜 형식이 틀리면 **사유를 시트로 돌려준다** |
| ③ | `ContentItem` 반영(아래 해석 4가지) — 한 트랜잭션 |
| ④ | 결과 3열 write-back. **달라진 셀만** 쓴다 |
| ⑤ | `lastSyncStatus`·`syncedRowCount` 기록. 실패해도 격리되고 `lastSyncedAt`은 갱신된다 |

**[해석을 밝힌 것 4가지 — 설계문서가 정하지 않았다]**

| # | 설계가 안 정한 것 | 택한 해석과 근거 |
|---|---|---|
| ㉠ | **행을 무엇으로 식별하나** | **`contentHash`가 1순위, 행 번호는 2순위.** 스키마는 `@@unique([blogId, sheetRowNo])`로 행 번호를 키처럼 쓰지만 **행 번호는 사용자가 언제든 흔드는 값**이다. 중간 행 하나를 지우면 아래가 전부 한 칸씩 올라오는데, 행 번호로 덮어쓰면 **5행의 글이 4행 항목에 덮어써지고** 그 항목을 참조하는 발행 이력이 통째로 거짓이 된다. 행 번호는 **write-back 주소**로만 쓰고 정체성은 내용이 갖는다. 해시 매칭은 **모든 행에 대해 먼저 1패스로** 끝낸다(행 단위로 섞으면 아래로 내려간 글의 옛 항목을 윗행이 먼저 덮어쓴다) |
| ㉡ | **잠긴 행의 내용이 바뀌면** | **반영하지 않고 `실패사유` 열로 알린다.** 이미 올라간 글의 오타를 고치는 건 흔한 일이고, 새 글감으로 취급하면 같은 글이 두 번 올라간다(원칙 3). 조용히 무시하면 "고쳤는데 왜 그대로냐"가 되고 조용히 재발행하면 원칙 3 위반이라, **"안 하고 말한다"가 둘 다 피하는 유일한 길**이었다. 잠금 판정은 `content.ts`의 `CONTENT_HOLDING_STATUSES`를 **그대로 재사용**한다(같은 술어를 두 번 적으면 한쪽만 바뀐다) |
| ㉢ | **시트에서 사라진 행** | 삭제가 아니라 **은퇴**(`status=DRAFT` + `statusNote`). 삭제하면 `PublishJob.contentItemId`가 `SetNull`로 끊겨 이력이 상한다. 후보 조건이 `READY`·`ASSIGNED`뿐이라 은퇴만으로 충분하고, 같은 글을 다시 붙여 넣으면 ㉠의 해시 매칭이 되살린다. **발행됐거나 잡이 쥔 항목은 은퇴시키지도 않는다**(연결만 끊는다) |
| ㉣ | **시트 `상태` 열의 권한** | 움직일 수 있는 구간은 **`READY ⇄ DRAFT` 하나뿐**. 시트에 "대기"라고 적힌 낡은 값이 DB의 `ASSIGNED`를 15분마다 되돌리면 **같은 글이 두 번 배정된다**. `PUBLISHED`·`FAILED`·`SKIPPED`도 시트가 못 건드린다 |

**[설계 밖에서 추가로 막은 것]**
- **write-back 멱등**: 스키마에 "써넣음" 표시 컬럼이 없다. 매번 전부 쓰면 15분마다 시트를 덮어써 구글 할당량을 태우고 편집 중인 커서가 튄다. **읽어온 격자와 비교해 달라진 셀만** 쓰는 것으로 컬럼 없이 멱등을 얻었다.
- **후보창 기아**: 후보는 `lastSyncedAt` 오래된 순인데 **실패했다고 갱신을 건너뛰면 계속 실패하는 시트가 앞자리를 영원히 차지해 뒤가 굶는다.** `job-reaper`가 검수 W1에서 지적받은 것과 같은 모양이라, 실패 경로에서도 `lastSyncedAt`을 갱신한다. ("정렬 + LIMIT 후보창을 새로 쓸 때는 영구히 조건을 만족하는 행이 창을 막는가를 먼저 따진다"는 규칙이 이번에 세 번째로 적용됐다.)
- **실패 격리**: 권한 하나 끊긴 고객 때문에 다른 고객의 글감 공급이 멈추면 안 된다. 시트 단위 try/catch + `AuditEvent(SHEET_SYNC_FAILED, delivered:false)`.
- **[D8] 한국어 사유 문장**을 `rules/reasons.ts`에 **유일 정의처**로 뒀다. 지금은 시트 `실패사유` 열이 쓰지만 S9·S9d가 곧 같은 문장을 쓴다 — 화면마다 따로 적으면 같은 상태에 다른 설명이 붙는다. 종결형 `skipReason` 전부에 문장이 있는지 회귀가 검사한다([E5]와 같은 방식).

**[자체 검증]** 신규 회귀 **51종**(전체 **192** 통과, 실제 Postgres). 빌드·`tsc` 통과. 뮤테이션 **27종 전부 사망(27/27)**, 각 뮤테이션은 **적용 여부를 먼저 확인**하고 집계했다. 하네스를 `scripts/mutation-check.mjs`로 **커밋해 재현 가능**하게 했다(지금까지는 매번 임시 스크립트였다).
- 회귀는 **네트워크를 한 번도 타지 않는다.** `SheetsApi` 인터페이스를 가짜로 주입하는 구조라, 실제 구글 시트를 건드리거나 할당량을 태우는 일이 **목킹을 잊는 실수로도 일어날 수 없다**.

> **★[살아남은 뮤테이션 2종 — 둘 다 실제 결함이었다 · 정정]**
> 첫 집계는 **25/27 사망**이었고, 살아남은 둘은 하필 이번 라운드에 내가 "방어"라고 적은 곳이었다.
>
> | 살아남은 것 | 밝혀진 사실 |
> |---|---|
> | `createdAt` 명시 삭제 | **내 전제가 틀렸다.** "한 트랜잭션이면 `CURRENT_TIMESTAMP`라 전부 같은 시각"이라고 주석에 적었는데, **실측하니 Prisma는 `@default(now())`를 행마다 클라이언트에서 박는다**(한 트랜잭션 5행이 1~23ms씩 벌어짐). 그래서 방어를 지워도 순서가 안 무너졌고 테스트는 초록이었다 |
> | 빈 줄 write-back 가드 | **하는 일이 없는 줄이었다.** 안 쓴 줄은 desired가 전부 빈 문자열이라 차등 비교가 어차피 0셀을 돌려준다. 그 가드가 실제로 하는 유일한 일은 "**입력을 지운 줄에 남은 결과 찌꺼기를 영원히 남기는 것**"이었다 |
>
> **조치**: ⓐ 주석의 근거를 실측대로 고치고(값이 같아져서가 아니라 **`TIMESTAMP(3)`에서 같은 밀리초에 들어가면 순서에 명세가 없고, ORM 구현 세부에 순서가 걸리기 때문**), 테스트를 "값이 다르다"가 아니라 **"행 간격이 정확히 행 번호 차이"**를 보도록 바꿨다. ⓑ 하는 일 없는 가드는 지우고, 대신 찌꺼기를 치우는 동작으로 바꿔 회귀를 붙였다. 둘 다 다시 심어 죽는 것을 확인했다(최종 27/27).
>
> 교훈은 이번에도 같은 자리다 — **초록인 테스트가 방어를 지키고 있다는 증거가 아니다.** 뮤테이션을 안 심었으면 "createdAt으로 시트 순서를 보장한다"는 **틀린 문장이 그대로 문서에 남았다.**

> **★★[사고 · 자진 신고] 뮤테이션된 코드를 커밋·push했다 (커밋 `713f378` → `c1a448b`에서 복구)**
>
> 뮤테이션 하네스를 `timeout 300 ... | head -8`로 파이프해 돌렸다가 중간에 죽었고, 원문 복원을 맡은 `finally`가 실행되지 못했다. **뮤테이션 S15가 적용된 소스가 그대로 커밋되고 원격까지 나갔다** — `out.duplicates`에서 `seenBefore ||`가 빠져 "같은 글을 처음 두 줄에 붙여 넣은 경우"(S7 중복경고가 가장 필요한 순간)를 못 잡는 상태였다.
>
> **왜 못 잡았나 — 검증 실패가 둘 겹쳤다.**
> ⓐ 그 파일은 아직 **untracked**라 `git diff`가 아무것도 안 보여줬다. 나는 "diff 대조했다"고 생각했지만 실제로는 **새 파일에 대해 diff는 원리적으로 아무 말도 안 한다.**
> ⓑ 그래서 grep으로 확인했는데 **뮤테이션 지점 27곳 중 3곳만** 봤다. 표본으로 전체를 말한 것이다. 하필 안 본 24곳 중에 오염된 곳이 있었다.
>
> 발견 경로는 커밋 **후** 돌린 최종 전체 테스트(192 중 1 실패)였다 — 게이트가 한 겹 더 있어서 잡혔지, 커밋 직전 검증으로는 못 잡았다.
>
> **조치**: 전수 검사 결과 오염은 S15 한 곳뿐임을 확인하고 복구했다(나머지 26곳 원본). `scripts/mutation-check.mjs`에 **무결성 검사**를 넣어 실행 시작 전·종료 후 자동으로 27개 지점의 원본 여부를 확인하고, 오염이면 exit 1로 멈춘다. `--verify`로 단독 실행도 된다(커밋 전 습관용). **"복원됐겠지"를 사람 눈이 아니라 검사로 바꿨다.**
>
> **일반화할 교훈 둘**: ① **새 파일에는 `git diff`가 침묵한다** — 신규 파일 위주 작업에서 "diff 대조"는 검증이 아니다. ② 파괴적 하네스의 출력을 `| head`로 자르지 말 것(SIGPIPE로 죽으면 복원 코드가 못 돈다). 이건 이전에 기록해 둔 "빌드로그 파이프 SIGPIPE 함정"과 같은 함정이 **더 위험한 형태**로 재발한 것이다.

**[남은 것 · 명시]**
- **실계정 실측은 [미검증]**이다. 구글 서비스계정 키 발급은 형만 할 수 있고(절차는 `.env.example`), 키가 없으면 라우트가 **503 + 누락 항목**을 돌려준다. 실제 시트로 도는 것은 키 주입 후에만 확인 가능하다.
- `ContentItem`을 `PUBLISHED`로 올리는 주체는 여전히 없다(발행 성공 경로의 몫). 5-3-2에 적은 그대로이고, 잠금 판정이 상태가 아니라 잡을 보므로 기능 문제는 없다.
- 한 패스에 시트 50개(`SHEET_SYNC_BATCH`) · 시트당 500행(`SHEET_MAX_ROWS`)까지만 본다.
- **분산 락이 없다.** 두 호출이 겹치면 같은 시트를 두 번 읽을 수 있다(반영은 트랜잭션이라 깨지지 않지만 write-back API 호출이 낭비된다).
- 시트 `상태` 열의 어휘(보류/중지/초안…)는 **내가 정한 것**이다. 설계문서에 정의가 없어 밝혀 두고, 인식 못 하는 값은 전부 "발행 대기"로 본다.

---

## 6. 보안 요약

| 항목 | 처리 |
|---|---|
| 네이버 비번·세션쿠키 | **수집·전송·저장 전부 안 함.** 에이전트→서버 페이로드에 쿠키 필드 자체가 없음 |
| 에이전트 토큰 | 서버는 sha256만 보관 / PC는 OS 자격증명 저장소(Windows DPAPI)에 보관, 평문 파일 금지 |
| 페어링 코드 | sha256 보관, 10분 TTL, 1회용, 5회 실패 폐기, IP 레이트리밋 |
| 멀티테넌시 격리 | 모든 조회는 `userId` 스코프 필수. 에이전트 토큰도 `userId`에 묶여 남의 잡 수령 불가 |
| **[D9] 구글 OAuth 토큰** | 9장 #3에서 ㉡(OAuth)를 택하면 `Account.refresh_token`에 장기 토큰이 들어온다. **DB 평문 저장 금지 — 앱 레벨 AES-256-GCM 암호화 후 저장**, 키는 `.env.local`의 `TOKEN_ENC_KEY`(32바이트)로만 주입하고 코드·vault·git에 넣지 않는다. 복호화는 시트 API 호출 직전 메모리에서만. ㉠(서비스계정)을 택하면 이 항목 자체가 사라지는데, **이것이 ㉠을 추천하는 두 번째 이유**다 |
| **[D5] 운영자 권한** | `User.role = ADMIN` 만 `/admin/*` 접근. 미인가 접근은 404 응답 + `AuditEvent` 기록. 승격은 DB 직접 변경으로만(화면에 승격 기능 없음) |
| 로그 | IP는 해시로만. 본문 스냅샷은 사용자 데이터로 취급해 탈퇴 시 삭제 |
| 에이전트 배포 | 코드서명 필수(미서명이면 SmartScreen 경고로 설치 이탈) — 9장 #4 |

---

## 7. 실패 시나리오와 설계상의 답

| 시나리오 | 처리 | 사용자에게 보이는 것 |
|---|---|---|
| 발행 시각에 PC가 꺼져 있음 | `QUEUED` 유지 → `expiresAt`까지 대기 → `R1-b`(EXPIRED + 자리 해제) | 홈 배너 "에이전트 오프라인 — 오늘 21:00 발행 못 함" + 만료 알림 |
| **직전 발행이 늦어져 12시간 룰에 걸림** | **지연 흡수** `DF1`~`DF2` — 드리프트가 슬롯당 40분씩 줄어 최대 4슬롯 안에 정시 복귀(근거 3-B-4) | "발행이 10:50으로 조정되었습니다" + 며칠 내 원래 시각 복귀 |
| **슬롯이 `EXPIRED`된 뒤 재시도·수동 발행** | `SL4`로 자리가 해제돼 `attemptSeq+1` 잡이 정상 생성(`SL5`). rev2에서 unique violation으로 막히던 경로 | 이력에서 "재시도" 버튼이 실제로 동작 |
| 네이버가 로그아웃됨 | `NAVER_LOGGED_OUT`, 재시도 안 함 | "네이버에 다시 로그인해 주세요" + 재시도 버튼 |
| 발행 눌렀는데 응답이 끊김 | `UNVERIFIED` → `VERIFY_DELAY` 후 **검증 잡**(3-C) | 확인되면 성공 / 아니면 "확인 필요"(자동 재발행 없음) |
| 네이버 에디터 개편 | `EDITOR_DOM_CHANGED` 급증 → 운영자 경보 | 전체 공지 + 에이전트 핫픽스 |
| 글감이 떨어짐 | 잡 생성 시 바인딩 실패 → `skipReason=NO_CONTENT` | "글감 3건 미만" 사전 경고 + 이력에 사유 표시 |
| PC 두 대에 설치 | 리스 방식으로 먼저 가져간 쪽이 처리. 선호 기기 지정 시 그 기기 우선, 15분 오프라인이면 폴백 | 기기 목록에 2대 + 블로그별 선호 기기 |
| 시트 권한이 끊김 | `lastSyncStatus=PERMISSION_DENIED` | 글감 화면에 사유 + 재연결 버튼 |

---

## 8. 페이즈2(개발) 착수 전 준비물

1. 신규 레포 `nblog-saas` (Next.js 16 + Prisma 6 + PostgreSQL/Neon), 개발 포트 **3002** — 3000·3001·8080 회피.
2. 마이그레이션 순서: NextAuth 테이블 → 도메인 테이블 → **2-4의 raw SQL 제약 10개(CHECK 7 + 부분 유니크 인덱스 3) 수동 삽입** → `Plan` 시드.
3. 테스트 우선순위(Vitest) — **하드 룰부터 테스트로 못 박는다**:
   - **[F0 ★구조] 단일 정의 소스 유지 검사** — 이번 반려의 근본원인(로직 중복 서술)이 재발하지 않게 CI로 못 박는다:
     · `G1`·`G2`·`SL2`·`SL4`의 SQL 문자열이 코드베이스에 **각각 1곳에만** 존재하는지(중복 리터럴 검출 시 실패)
     · `L2`와 `L4`가 **같은 함수**를 인자만 바꿔 호출하는지(호출 그래프 검사)
     · 설계 문서에서 3-A **바깥**에 `GATE`·`11h15m`·`12h`·`publishAttemptAt` 같은 판정 리터럴이 새로 등장하면 경고
   - **[E1] L2·L4 임계 일치**: 두 층이 같은 상수(`GATE`)·같은 컬럼을 쓰는지 정적 검사 / **리드타임을 35·60분으로 바꿔도 스킵률이 0인지**(리드타임 의존성이 되살아나면 즉시 실패)
   - **[F6 ★치명 회귀] 슬롯 생명주기 9종**(4~7차 검수 발견) — `R1-a` → `R1-c` 왕복과 예약 소유권:
     · **① 재시도 잡이 실제로 `SL2`를 통과해 claim되는지**(먹통 재시도 버튼 회귀)
     · **② `G2`가 그 자리를 더 이상 세지 않는지**(실제 발행 0건인데 "오늘 2회 다 씀" 회귀)
     · ③ `INV4` 정합성 — 임의 경로 조합 후에도 `consumedAt IS NOT NULL` ⟺ 그 슬롯에 `publishAttemptAt` 있는 잡 존재
     · **④ 예약 소유권 가드**(5차 반려 중대1): 같은 자리에 종료된 잡 A와 **진행 중인 잡 B**를 만든 뒤 `job-reaper`를 A에 대해 반복 실행 → **B의 `reservedByJobId`·`reservedUntil`이 보존되는지** / 그 상태에서 수동 발행 잡 C가 `SL2`에 **막히는지**(같은 자리 동시 발행 회귀)
     · **⑤ `SL3` 세 경로 전부**에서 `consumedAt`이 세팅되는지 — 특히 **ⓙ(이벤트 유실로 `/result`만 도착)** 경로 누락 회귀
     · **⑥ 예약 만료 인터리빙**(6차 반려 중대1): `A claim → 예약 만료 → (reaper 돌기 전) B가 claim 시도` 창에서 **`INV5`가 B를 막는지** / 이어서 `R1-a → R1-c` 후 자리가 완전히 해제되고 `INV4`가 유지되는지. **④는 이 인터리빙을 못 잡는다**(④는 A가 이미 `TERMINAL`인 경우만 본다)
     · **⑦ `SL4-SWEEP` 자가복구**: `consumedAt`은 있는데 `publishAttemptAt` 잡이 0건인 상태를 강제 주입 → 다음 `job-reaper` 주기에 `INV4`가 복구되고 재시도 잡이 claim 가능해지는지
     · **⑧ 트리거 재정의 회귀**: `UNVERIFIED → FAILED`(`TERMINAL` **내부** 이동)에서 `SL4`가 **실행되는지** — rev6의 "정확히 1회" 문언이면 여기서 안 돌아 자리가 영구 소각됐다
     · **⑨ 스윕이 자기가 고칠 상황에서 막히지 않는지**(7차 반려 중대1): stale 상태 + **같은 슬롯에 `QUEUED` 잡이 이미 있는 채로** `SL4-SWEEP`을 돌려 **1분 내 복구되고 그 잡이 곧바로 claim되는지**. **⑦은 이걸 못 잡는다**(⑦은 잡이 없는 깨끗한 상태만 본다). 함께: 살아있는 예약을 쥔 잡이 있을 때는 스윕이 **0행**이어야 한다(보호 회귀)
   - **[F8 ★치명 회귀] 블로그 단위 동시성 2종**(2차 검수 발견 — `G3`):
     · **① `claim(max=2)` 1회 호출**이 같은 블로그 잡을 **1개만** 내주는지
     · **② 에이전트 2개가 동시에 `max=1`**로 요청했을 때 합계 **1개만** 나가는지(TOCTOU — 순차 호출로는 절대 못 잡는다. 반드시 병렬로 호출할 것)
     · 두 테스트 모두 `G3`·원자적 UPDATE 조건을 제거하면 죽어야 한다(뮤테이션으로 확인)
     · **③ 형제 `PUBLISH`가 `CLAIMED`인 상태에서 `VERIFY` 잡이 정상 수령되는지**(3차 검수 발견 — `G3` 적용 범위). 함께: 같은 상황에서 발행 잡끼리는 **여전히 막히는지**(범위를 과하게 좁히지 않았는지 반례)
     · **[커버리지 공백 — 명시]** `Blog` 행 `FOR UPDATE` **잠금만 단독으로 제거하면 현재 테스트는 전부 초록이다**(15시행 확인). 잠금 자체는 이론적으로 필요하지만(READ COMMITTED에서 다른 행을 갱신하는 동시 트랜잭션은 상대의 미커밋 변경을 `NOT EXISTS`로 못 본다), **그 창이 열렸을 때 검출 수단은 DB 제약 10의 `23505`뿐**이다. 잠금 계층에 단독 뮤테이션 커버리지가 없다는 뜻이므로, 향후 잠금을 건드릴 때는 테스트 초록만 믿지 말 것
   - **[F9 ★자가복구 회귀] `job-reaper` 13종 + 상수 고정**(5-3-1) — "어떤 상태도 사람 손 없이 스스로 풀린다"를 못 박는다:
     · **⓪ 상수 리터럴 고정**: `VERIFY_MAX_ATTEMPTS`=3 · `REAP_BATCH`=200 · `DF3`=8 · `DF4`=4. **테스트가 상수를 `import`해 쓰면 상수를 바꿔도 안 죽는다**(2차 검수 R1에서 실제로 통과했다)
     · **②-b★ 리스 무한갱신 반례**(2차 검수 R2): `expiresAt`이 지난 in-flight 잡에 진행 이벤트를 보내면 **`abort:true`·`abortReason=JOB_EXPIRED`가 오고 리스가 한 톨도 안 밀리는지** / 그 뒤 리스 만료 시 `R1-a`가 정리하고 형제 잡이 **실제로 claim되는지** / 반대로 수명이 남은 잡은 정상 갱신되는지(반례 방향)
     · ① `R1-a` 리스만료 → `UNVERIFIED` + `publishAttemptAt=claimedAt` + 자리 CONSUMED + 검증 잡 생성 / 리스가 살아 있으면 무동작 / 이미 발행 흔적이 있으면 덮어쓰지 않음 / `leaseExpiresAt`이 NULL인 이상 상태도 걷힘
     · **①-b TOCTOU**: 후보를 고른 뒤 상황이 바뀐 잡을 **직접** 넘겨도 전이하지 않는지(전이 UPDATE의 WHERE 가드 단독 커버리지)
     · **②★ `INV6` 자가해제**: 멈춘 `CLAIMED` 잡 때문에 `BLOG_BUSY`로 튕기던 형제 잡이 reaper 뒤에 **실제로 claim되는지**. 상태값만 확인하면 "풀린 것처럼 보이는데 안 나가는" 경우를 놓친다. 함께: `QUEUED`인 채 수명이 끝난 잡이 슬롯을 잠그던 것(`INV5`)도 풀리는지
     · ③ `R1-b`: `EXPIRED` + 자리 완전 해제 + `DF4` +1 + 알림 기록 / 수명이 남으면 무동작 / 검증 잡 만료는 자리·`DF4` 무영향
     · ④ 검증 잡 보충: 죽은 검증 잡 뒤에 새로 발급 / 살아있으면 안 만듦(앱 계층 가드는 **직접 호출**로 단독 검증) / 상한 3회에서 중단하고 감사 1건만 / 결정적 `idempotencyKey`로 같은 회차 중복 불가
     · ⑤ `SL4-SWEEP`이 reaper 주기에 실제로 도는지 / 살아있는 예약은 보존되는지
     · ⑥⑦ `DF3`은 **8에서 조용하고 9에서** 발동 + 자동 일시중지 / `DF4`는 **3에서 조용하고 4에서** 발동 + 일시중지 안 함 / 같은 값 유지 중 경보 미중복 / 리셋 후 재도달 시 재경보 / ②단계가 올린 카운터를 같은 사이클 ⑤단계가 평가
     · ⑧ 사이클 **멱등성**: 두 번 돌려도 리포트 전부 0, 이벤트·잡 수 불변
     · ⑨ cron 라우트: 시크릿 미설정 503 + 누락 항목 / 없거나 틀리면 401이고 **아무것도 안 걷힘** / `Bearer`·`x-cron-secret` 둘 다 · GET도 동작
     · ⑩ **구제 경로 기아**: `BLOG_BUSY` 발행잡 6건이 후보창(`max+4=5`)을 다 채워도 `VERIFY` 잡이 수령되는지(창을 넘기지 못하면 재현이 안 되므로 due 발행잡이 6건인 것을 테스트가 먼저 확인)
     · **⑪★ DB 세션 타임존**: ORM이 쓴 값과 raw `now()`가 같은 시계인지 / **비-UTC 접속으로 `runJobReaper`·`claimJobs`를 실제 호출했을 때 던지고 상태가 하나도 안 바뀌는지**(검사 함수만 보면 호출 배선이 지워져도 안 죽는다 — 2차 검수 R1) / 한 클라이언트가 통과해도 다른 클라이언트는 검사를 건너뛰지 않는지(W2)
   - **[F7] 무발행 감지**: 매 슬롯이 `SKIPPED`로만 끝나는 블로그에서 `consecutiveUnpublishedSlots`가 증가해 **정확히 4번째 슬롯에서 경보가 뜨는지**(`>= 4`. 3에서는 안 뜨는 것도 함께 확인 — `DF4`). `DF3`만으로는 안 잡히는 것도 확인
   - **[F2] 자리 소각 금지**: `SKIPPED`로 끝난 잡의 자리가 **해제되는지**(`SL4`) / `SKIPPED` 후 같은 날 재시도가 가능한지
   - **[F3] 재수령 금지**: 리스 만료된 `CLAIMED`/`RUNNING`/`SUBMITTED` 잡이 **다시 claim되지 않고** `UNVERIFIED`로 가는지(`R1-a`) / `QUEUED`였던 잡은 `EXPIRED`+해제인지(`R1-b`)
   - **[F4] DB 보장**: 한 자리에 두 번째 `publishAttemptAt` UPDATE가 **거부되는지**(제약 8) / 하루 3번째 슬롯 INSERT 거부 / 같은 자리에 두 번째 ACTIVE 잡 INSERT 거부(제약 9)
   - **[F5] 감쇠 카운터**: 드리프트 주입 시 `Blog.consecutiveDeferredSlots`가 실제로 증가하고 정시 발행에서 0으로 리셋되는지(rev3의 죽은 카운터 회귀)
   - **[D1] 슬롯 간격**: 슬롯0=09:00 설정 시 슬롯1이 21:00으로 자동 확정되는지 / 지터를 적용해도 같은 날 간격이 정확히 12h인지 / 날짜 경계 최소 간격이 GATE 이상인지 — **20만일 시뮬레이션을 회귀 테스트로 고정**
   - **[E3] 드리프트 감쇠**: 드리프트 3시간을 주입했을 때 4슬롯 이내에 정시 복귀하는지 / 그 과정의 모든 간격이 GATE 이상인지 / `job.deferCount`가 상한 3에 도달하지 않고 `blog.consecutiveDeferredSlots`가 8을 안 넘는지
   - **[E2] 재시도 경로**: 슬롯 `EXPIRED` 후 수동 발행이 **INSERT에 성공**하는지(rev2 회귀) / `publishAttemptAt`이 찍힌 잡은 슬롯이 해제되지 **않는지** / 하루 3번째 슬롯 INSERT가 거부되는지
   - **[D2] 기준 컬럼**: `SUBMITTED`·`UNVERIFIED` 잡이 12시간 검사에 실제로 잡히는지 / 쿼터 쿼리에 `postedAt`이 등장하면 실패하는 정적 검사
   - **[D3] DB 제약**: **10개 존재 확인**(CHECK 7 + 부분 유니크 인덱스 3 — 개수를 상수로 박고 grep)
   - **[D4] 검증 잡**: UNVERIFIED → VERIFY 생성 → FOUND 시 대상 잡 승격 / VERIFY 잡이 슬롯을 소비하지 않는지
   - **[E5] 문서-코드 일치**: `skipReason` enum 값이 2-5 표의 6개와 정확히 일치하는지
   - 멱등성: 같은 `idempotencyKey` 2회 보고 시 부작용 0
   - `SUBMITTED` 이후 재클레임 거부 / `UNVERIFIED` 자동 재시도 미발생
4. 에이전트 프로토타입은 발행 로직보다 **페어링·폴링·하트비트 골격을 먼저** 만든다(가장 많이 깨지는 곳이 발행이 아니라 연결이다).

---

## 9. 형(CEO) 결재 필요 항목

| # | 항목 | 상태 | 선택지 / 내 판단 |
|---|---|---|---|
| 1 | **화면·스키마·인터페이스 승인** | 결재 대기 | 2·4·5장 승인 시 페이즈1 완료 판정 |
| 2 | **요금 금액 확정** | ⚠️ **미이행 — 이월 승인 요청** | 선행 결정문서 3·7장은 "가격 세부안을 **페이즈1에서 확정**"으로 적혀 있는데, 이번 설계에서 **금액을 산출하지 못했다.** 원가(서버비·LLM 배치·고객지원 인건)를 실측 없이 추정하면 7B 모델이 냈던 48만원처럼 근거 없는 숫자가 또 나오기 때문이다. **요청: 금액 확정을 페이즈2 초반(개발 착수 후 2주 내, 인프라 실비가 나오는 시점)으로 이월하는 것을 승인해 주세요.** 스키마는 `Plan.priceKrw` nullable로 설계돼 있어 금액 없이도 개발 진행에 지장 없음 |
| 3 | **구글시트 연결 방식** | ✅ **결재 완료 — ㉠ 서비스계정 공유**(2026-08-08, 선행 plan 문서 기준). 2026-08-09 `sheet-sync`로 구현 완료(5-3-3) | ㉠ 서비스계정에 시트 공유 **(내가 추천)** — OAuth 민감범위 심사로 MVP가 늦고, ㉡을 택하면 refresh_token 암호화 설비까지 추가로 만들어야 한다(6장 D9) / ㉡ 구글 OAuth |
| 6 | **★신규 — Vercel 요금제(Pro)** | 결재 대기 | cron 4개·분 단위라 **Hobby(2개·하루 1회)로는 안 된다.** Hobby면 1분 주기 `job-reaper`가 사실상 죽어 자가복구가 멈춘다. 근거와 축소 순서는 5-3-3 |
| 4 | **에이전트 코드서명** | 결재 대기 | 인증서 구매 **(내가 추천)** — 미서명은 SmartScreen 경고로 설치 단계 이탈이 크다. 단 베타(페이즈3)까지는 미서명 + 안내로 버틸 수 있으므로 구매 시점은 페이즈3 직전으로 미뤄도 됨 |
| 5 | **신규 레포/포트** | 결재 대기 | `nblog-saas` / 3002 |

---

## 10. 잔존 리스크

- **네이버 자동화 탐지**: 사용자 본인 세션·본인 PC라 서버 봇보다 훨씬 안전하지만 0은 아니다. 완화책 = 하루 2회·12시간 고정·±10분 지터·사람 속도 입력. 실계정 실측은 페이즈3 베타에서만 가능 — 선행문서 10장 kill 기준 유지.
- **에디터 개편 리스크**: 네이버가 에디터를 바꾸면 전 고객 동시 장애. `EDITOR_DOM_CHANGED`를 별도 코드로 분리하고 A1의 1순위 지표로 뒀다.
- **설치 지원 부담**: PC 설치형의 최대 비용은 서버비가 아니라 고객지원이다. 온보딩 스텝2 이탈률을 페이즈3 핵심 측정치로.
- **12시간 여유 0 구조**: 하루 2회를 유지하는 한 간격 여유는 구조적으로 0이고, 우리는 45분 허용오차로 이를 흡수하고 있다. 즉 **실제 발행 간격이 11시간대로 내려갈 수 있다**는 뜻이다. 저품질 관점에서 11h15m와 12h가 유의미하게 다른지는 [미검증]. 만약 베타에서 12시간 엄수가 필요하다고 판명되면 **하루 1회 상품으로 내리거나 지터를 0으로 두는 것**이 유일한 해법이다 — 이 트레이드오프를 지금 문서에 남겨 둔다.
- **[E3 권고 반영] 공통 지터의 부작용 — 같은 날 간격이 12시간으로 결정화된다.** 규칙 J1(하루 공통 지터)은 같은 날 두 발행의 간격을 **정확히 12h00m00s로 고정**시킨다. 지터의 원래 목적이 "정각 반복이라는 기계 패턴을 숨기는 것"인데, **간격 자체는 오히려 완벽히 규칙적이 된다** — 목적과 부분적으로 역행한다. 남는 은닉 효과는 "매일의 절대 시각이 ±10분 흔들린다"는 것뿐이고, "두 글의 간격이 항상 정확히 12시간"이라는 패턴은 그대로 노출된다. 네이버가 절대 시각이 아니라 **간격의 규칙성**을 본다면 이 설계는 은닉에 기여하지 못한다. 대안(슬롯별 독립 지터)은 D1 문제를 되살리므로 지금은 이 트레이드오프를 감수하되, 베타에서 저품질이 관측되면 **"간격에도 지터를 주되 GATE를 12h가 아닌 11h로 낮추는" 재설계**가 다음 카드다. [미검증]
- **[미검증]** 폴링 주기·트래픽 추정은 계산치다. D1 시뮬레이션은 실행 검증된 값이지만, 그 입력(실행지연 최대 5분)은 가정이다. 베타에서 실측 필요.

---

## 부록 A. [D1] 근거 시뮬레이션 (재현용)

3-B-3 표의 수치를 뽑은 스크립트 원문. `bun a.js` 또는 `node a.js`로 재현 가능하다.

```js
const H=3600, J=600, D=300;           // 지터 ±600초, 실행지연 0~300초
function run(coupled, tolMin){
  const tol=tolMin*60, N=200000; let viol=0, minGap=1e9;
  let jPrev=(Math.random()*2-1)*J;
  for(let d=0; d<N; d++){
    const jCur=(Math.random()*2-1)*J;
    const j0  = coupled ? jCur  : (Math.random()*2-1)*J;   // 오늘 슬롯0 지터
    const j1  = coupled ? jCur  : (Math.random()*2-1)*J;   // 오늘 슬롯1 지터
    const jP1 = coupled ? jPrev : (Math.random()*2-1)*J;   // 어제 슬롯1 지터
    const gapCross = 12*H + (j0 - jP1) + (Math.random()*D - Math.random()*D); // 어제21시→오늘9시
    const gapIntra = 12*H + (j1 - j0)  + (Math.random()*D - Math.random()*D); // 오늘9시→오늘21시
    for(const g of [gapCross, gapIntra]){ if(g < 12*H - tol) viol++; minGap=Math.min(minGap,g); }
    jPrev=jCur;
  }
  return { viol:(viol/(N*2)*100).toFixed(2)+'%', minGapH:(minGap/H).toFixed(4) };
}
console.log('1차설계(슬롯별 독립지터, 허용오차 0):', run(false, 0));
console.log('공통지터만    (허용오차 0)         :', run(true,  0));
console.log('채택안 공통지터+허용오차 45분      :', run(true,  45));
```

실행 결과(2026-08-08, 20만일 × 2간격 = 40만 표본):
```
1차설계(슬롯별 독립지터, 허용오차 0): { viol: '49.86%', minGapH: '11.5980' }
공통지터만    (허용오차 0)         : { viol: '50.02%', minGapH: '11.6005' }
채택안 공통지터+허용오차 45분      : { viol: '0.00%',  minGapH: '11.5923' }
```

**읽는 법**: 1행이 1차 검수 지적("두 번째 발행의 50%가 SKIPPED")의 재현이다. 2행은 **지터를 공통으로 묶는 것만으로는 해결되지 않음**을 보여준다. 3행이 채택안이며, 최소 실측 간격 11.5923h(=11h35.5m)가 GATE 11h15m보다 20분 위에 있어 위반이 0이다.

**이 시뮬레이션의 한계**: 실행지연 상한 `D=300초`는 가정값이다. 실제 지연이 25분을 넘으면 위반이 다시 생긴다 — 그래서 그 경우를 ④ 지연 흡수가 받아낸다. 지연 분포는 페이즈3 베타에서 실측해 교정해야 한다.

---

## 부록 B. [E1·⑥] L2 포함 재시뮬 + 수치 분해 (재검 시 여기부터)

2차 검수가 지적한 대로 부록 A는 **L4만** 계산했다. 아래가 L2를 포함한 것이다. 프레이밍A는 검수 방식(인접 쌍 독립 평가)을 그대로 구현해 **검수의 100.00%를 재현**한다.

```js
const MIN=60,H=3600,J=600,GATE=11*H+15*MIN,LEAD=35*MIN;
function pairwise(thresh,lead,rule,N=400000){
  let v=0,t=0;
  for(let k=0;k<N;k++){
    const j0=(Math.random()*2-1)*J, j1=(Math.random()*2-1)*J;  // 어제/오늘 공통지터
    const d=Math.random()*300;                                  // 직전 발행 실행지연
    for(const dj of [0, j1-j0]){        // 같은날 쌍 / 교차일 쌍
      t++;
      const byNow     = 12*H + dj - lead - d;   // rev2: L2가 now() 기준
      const byPlanned = 12*H + dj - d;          // rev3: L2가 예정시각 기준
      if((rule==='now'?byNow:byPlanned) < thresh) v++;
    }
  }
  return (v/t*100).toFixed(2)+'%';
}
console.log('rev2 문자그대로 now기준·임계12h    :',pairwise(12*H,LEAD,'now'));
console.log('rev2 관대해석   now기준·임계11h15m :',pairwise(GATE,LEAD,'now'));
console.log('참고 리드30분   now기준·임계11h15m :',pairwise(GATE,30*MIN,'now'));
console.log('★rev3 채택안 예정시각기준·11h15m   :',pairwise(GATE,LEAD,'planned'));
console.log('★rev3 채택안 리드60분(무관 확인)   :',pairwise(GATE,60*MIN,'planned'));
```
```
rev2 문자그대로 now기준·임계12h    : 100.00%      ← 검수 수치 정확히 재현
rev2 관대해석   now기준·임계11h15m : 9.90%        ← 검수 12.46%와의 차이는 아래 분해 참조
참고 리드30분   now기준·임계11h15m : 3.63%
★rev3 채택안 예정시각기준·11h15m   : 0.00%
★rev3 채택안 리드60분(무관 확인)   : 0.00%
```

**[⑥ 정정] 9.90% vs 검수 12.46% — rev3의 설명은 틀렸다.** rev3은 "원인은 분모 하나"라고 썼는데, 그러면 "교차일만 본 값이 12.5%"라면서 자기 교차일 값은 19.9%라고 적는 자기모순이 된다. 실제 원인은 **두 축**이다. 아래 분해 스크립트로 확인했다.

```js
// 조건별 분해 — 분모(어떤 쌍을 세나) × 실행지연(포함/0) 2×2
function frac({pair,withDelay,N=2000000}){
  let v=0,t=0;
  for(let k=0;k<N;k++){
    const j0=(Math.random()*2-1)*J, j1=(Math.random()*2-1)*J;
    const d=withDelay?Math.random()*300:0;
    const djs = pair==='cross'?[j1-j0] : pair==='intra'?[0] : [0,j1-j0];
    for(const dj of djs){ t++; if(12*H+dj-LEAD-d < GATE) v++; }
  }
  return (v/t*100).toFixed(2)+'%';
}
```
```
교차일쌍만 · 실행지연 포함 : 19.74%
교차일쌍만 · 실행지연 0    : 12.53%   ← 검수 12.46%의 정체
같은날쌍만 · 실행지연 포함 : 0.00%
양쪽쌍 평균 · 실행지연 포함: 9.90%    ← 내 9.94%의 정체
양쪽쌍 평균 · 실행지연 0   : 6.26%
검산: 교차일(지연포함)/2   = 9.87%    ← 같은날 쌍이 0%이므로 평균은 정확히 절반
```

즉 차이는 **① 분모에 같은 날 쌍(항상 0%)을 넣느냐 ② 실행지연을 넣느냐** 두 축의 조합이다. rev3이 적은 "12.46 ÷ 2" 식의 산수는 애초에 성립하지 않는다(12.46은 지연 0 조건의 값이므로 지연 포함 평균과 직접 나눌 수 없다). **결론(규칙이 깨져 있음)과 채택안 수치(0.00%)는 네 조건 모두에서 동일하다.**

---

## 부록 C. [E3] 지연 흡수 드리프트 감쇠 검증 (rev3 신규)

```js
const MIN=60,H=3600,GATE=11*H+15*MIN;
function trace(label,buf,D0){
  console.log(`\n[${label}] 흡수목표=직전+${((GATE+buf)/H).toFixed(3)}h, 초기드리프트 ${D0/MIN}분`);
  let last=9*H+D0, base=9*H;
  for(let s=1;s<=6;s++){
    base+=12*H;
    let sched=base, dfr=false;
    if(sched-last<GATE){ sched=last+GATE+buf; dfr=true; }
    const gap=sched-last;
    console.log(`  슬롯${s}: ${dfr?'DEFER':'정시 '} 예정+${((sched-base)/MIN).toFixed(0).padStart(3)}분  실간격 ${(gap/H).toFixed(3)}h  ${gap>=GATE?'OK':'★위반'}`);
    last=sched;
  }
}
trace('rev2 현행 +12h 흡수',   45*MIN, 150*MIN);
trace('rev3 개정 +11h20m 흡수', 5*MIN, 150*MIN);
trace('rev3 개정 최악 드리프트3h', 5*MIN, 180*MIN);
```

출력은 3-B-4의 표와 같다. **rev2는 6슬롯 내내 `예정+150분`으로 고착**(2차 검수 지적 ③ 재현), **rev3은 110→70→30→정시**로 슬롯당 40분씩 감쇠하며, 최악(3시간)에서도 140→100→60→20→정시로 4슬롯 만에 복귀한다. 모든 행의 실간격이 GATE 이상이다.

---

## 부록 D. 슬롯 생명주기 검증 — 실행 결과와 **하네스 변경분 고지**

### D-0. ★먼저: rev7 부록 D의 서술 두 건이 사실과 달랐다

7차 검수에서 **내 "증명"의 신뢰성 문제 2건**이 지적됐다. 둘 다 사실이다.

| rev7이 쓴 문장 | 실제 | 성격 |
|---|---|---|
| "시나리오는 원본 그대로" | **시나리오 4의 본문을 바꿨다.** 트리거 발동을 술어로 판정하던 `if(!before2 && wasTerminal())` 자리를 **무조건 실행**(`sl4Runs++; SL4('A')`)으로 치환했다 | **바꾼 것을 안 바꿨다고 적음 — 정직성 문제** |
| 시나리오 1 "동일(통과 유지)" | 그 시나리오의 초기 상태(같은 슬롯에 `QUEUED` 잡 2건)는 **제약 9 하에서 애초에 구성 불가**다. rev7 출력 1행이 `res=-/-`(A가 자기 예약조차 못 잡음)였는데 그걸 보고도 "동일"이라고 적었다 | **불가능한 상태에서 공허하게 통과한 것을 통과로 보고** |

결론(트리거 2회 발동·해제·`INV4` OK)이 우연히 맞았다는 점은 검수가 독립 재실행으로 확인했지만, **결론이 맞았다는 것과 근거 서술이 정직했다는 것은 별개다.** rev8은 아래 규칙을 지킨다.

> **하네스 고지 규칙(이후 고정)**: 검수자 스크립트를 수정해 제출할 때는 **`diff`를 떠서 변경분을 빠짐없이 열거**한다. "원본 그대로"라는 말은 `diff`가 비어 있을 때만 쓴다.

### D-1. 이번에 쓴 하네스와 변경분 — **`diff`를 먼저 뜨고 그 출력을 보고 적는다**

- **베이스**: `qa7.js`(7차 검수자 원본)
- **파일**: `rev8_check.js` (vault 동봉: `assets_2026-08-08_nblog_rev8_check.js`)
- **`diff --strip-trailing-cr qa7.js rev8_check.js` 헝크 3개** — `1c1,4` / `31c34,38` / `47,82c54,89`

> **[8차 반려 ③ 정정]** rev8은 이 자리에 **"원본 대비 변경분 — 단 1곳"**이라고 적었다. **또 거짓이다.** 실제 diff는 헝크가 3개이고, 그중 세 번째 헝크는 **시나리오 드라이버 전면 재작성**이다. D-0에서 바로 이 실수를 인정하고 고지 규칙까지 세운 **같은 제출물 안에서 그 규칙을 다시 어겼다.** 원인은 동일하다 — `diff`를 뜨지 않고 "내가 바꾸려던 것"을 기억으로 적었다. rev9부터는 **제출 전에 `diff`를 먼저 실행하고, 그 출력을 보고 나서** 이 절을 쓴다.

**변경분 전체 — 엔진 1곳 + 드라이버 4건 + 헤더 주석**

| 헝크 | 구분 | 내용 |
|---|---|---|
| `31c34,38` | **엔진 1곳** | `SL4_SWEEP`의 `c3`: `ACTIVE` 잡 축 → **예약 소유권 축**. 이번 설계 수정의 실체이며, 엔진에서 바꾼 곳은 여기뿐이다 |
| `47,82c54,89` | 드라이버 ① | **검증C**: `t=2m` / `t=60m` / `t=180m` 단계와 `R1-b(EXPIRED)` 경로를 **삭제**(rev8은 `t=1m`에 복구되므로 장기 관찰 구간이 불필요해짐). 원본이 증명하던 "3시간 걸림"을 rev8이 재현하지 않는다는 뜻이므로, **삭제 사실 자체가 결과의 일부** |
| 〃 | 드라이버 ② | **검증D**: 3번째 케이스 **추가** — "살아있는 예약을 쥔 잡 + stale"에서 스윕이 0행인지(가드가 너무 관대해지지 않았는지 확인용) |
| 〃 | 드라이버 ③ | **검증B**: 셋업 교체가 아니라 **통째 대체**. 원본은 "A·B 둘 다 `QUEUED` INSERT가 제약 9에 막히는가"만 봤고, rev8은 "A가 `TERMINAL`이 된 뒤 B 투입 → 5차 지적(예약 보존) + 동시발행 차단"까지 보는 다른 시나리오다 |
| 〃 | 드라이버 ④ | **검증A**: 변수명 `A`→`E`, `TX` 인자 순서 변경, 블록 스코프 `{}` 제거, 출력 헬퍼 `line()` 도입 (동작 동일, 표기만 변경) |
| `1c1,4` | 헤더 주석 | 파일 상단 설명 3줄 교체. **이 주석에도 "단 1곳"이라는 거짓 표기가 있었고 함께 정정했다** |

**바뀌지 않은 것(엔진부)**: `SL2` · `SL3` · `SL4` · `TX` · `INSERT_JOB`(제약 9 강제) · 판정식 `INV4`/`G2`. 8차 검수가 이 부분이 원본과 **바이트 동일**임을 확인했다 — 즉 결과 조작은 없었고, 문제는 **서술**이었다.

### D-1-1. `diff --strip-trailing-cr qa7.js rev8_check.js` 원문

```diff
1c1,4
< // QA 7차 독립 검증 — 문서 rev7 SQL(950-1003행)을 그대로 옮김. 하드코딩된 트리거를 술어로 복원.
---
> // rev8 검증 — 베이스: qa7.js (검수자 원본).
> // ★변경분 3영역: (1) 이 헤더 주석 (2) 엔진 SL4_SWEEP의 c3
> //   (ACTIVE잡 축 -> 예약 소유권 축) (3) 시나리오 드라이버 전면 재작성.
> // ★엔진부 SL2/SL3/SL4/TX/INSERT_JOB/판정식(INV4,G2)은 원본과 바이트 동일.
31c34,38
<   const c3 = !jobs.some(j=>j.slotId==='X'&&ACTIVE.has(j.status));      // ★3번째 NOT EXISTS
---
>   // ★rev8 교체: 가드축 = "살아있는 남의 예약"(소유권). ACTIVE 잡 유무가 아니다.
>   const owner = jobs.find(j=>j.id===slot.reservedByJobId);
>   const c3 = slot.reservedByJobId===null
>           || (slot.reservedUntil!==null && slot.reservedUntil<=now)
>           || !(owner && ACTIVE.has(owner.status));
47,82c54,89
< console.log('\n=== [검증A] 시나리오4를 하드코딩 없이 규범 술어로 재실행 ===');
< { reset(); const A=INSERT_JOB('A','CLAIMED'); now=0; A.claimedAt=0; SL2('A'); let n=0;
<   now=16*M; let r=TX(A,{status:'UNVERIFIED',pubAttempt:A.claimedAt}); if(r.fired)n++;
<   console.log(`  ACTIVE→UNVERIFIED: SL4 발동=${r.fired}(${r.by}) rows=${r.rows}`);
<   now=18*M; r=TX(A,{status:'FAILED',pubAttempt:null}); if(r.fired)n++;
<   console.log(`  UNVERIFIED→FAILED: SL4 발동=${r.fired}(${r.by}) rows=${r.rows}`);
<   console.log(`  => 자리: ${slot.consumedAt!==null?'★영구소각':'해제됨'}  SL4 발동횟수=${n}  INV4=${INV4()?'OK':'★VIOLATED'} G2=${G2()}`);
< }
< 
< console.log('\n=== [검증B] 제약9를 INSERT에 강제하면 부록D 시나리오1의 전제가 성립하는가 ===');
< { reset(); try{ INSERT_JOB('A','QUEUED'); INSERT_JOB('B','QUEUED'); console.log('  A,B 둘 다 QUEUED 생성됨'); }
<   catch(e){ console.log('  '+e.message+'  → 부록D 시나리오1의 초기상태는 제약9 하에서 구성 불가'); } }
< 
< console.log('\n=== [검증C] ★SL4-SWEEP이 ACTIVE 잡 1건에 무기한 차단되는가 (문서 1004행 "1분 안에 자동으로 낫는다") ===');
< { reset();
<   const A=INSERT_JOB('A','FAILED');                       // 이전 잡은 이미 TERMINAL
<   now=0; slot.consumedAt=0; slot.consumedByJobId='A'; slot.reservedByJobId='A'; slot.reservedUntil=15*M; // 미지경로 stale
<   console.log(`  stale 주입: INV4=${INV4()?'OK':'★VIOLATED'} G2=${G2()}`);
<   now=0.5*M; const R=INSERT_JOB('R','QUEUED');            // 제약9 통과: ACTIVE 잡 0건이므로 INSERT 허용
<   console.log('  재시도/스케줄 잡 R을 QUEUED로 INSERT → 제약9 통과(막지 않음)');
<   now=1*M;  console.log(`  t=1m  job-reaper SL4-SWEEP rows=${SL4_SWEEP()}   (R이 ACTIVE라 3번째 NOT EXISTS 실패)`);
<   console.log(`        R claim 시도 SL2 rows=${SL2('R')}   (consumedAt 잔존이라 실패)`);
<   now=2*M;  console.log(`  t=2m  SWEEP rows=${SL4_SWEEP()}  SL2 rows=${SL2('R')}`);
<   now=60*M; console.log(`  t=60m SWEEP rows=${SL4_SWEEP()}  SL2 rows=${SL2('R')}  INV4=${INV4()?'OK':'★VIOLATED'} G2=${G2()}`);
<   now=180*M; const r=TX(R,{status:'EXPIRED'});            // expiresAt(SLOT_TTL 3h) 도달 → R1-b → SL4
<   console.log(`  t=180m R1-b(EXPIRED)로 SL4 발동=${r.fired} rows=${r.rows}  ← 소유권가드가 A/미래예약이라 0행`);
<   console.log(`  t=181m SWEEP rows=${SL4_SWEEP()}  → INV4=${INV4()?'OK':'★VIOLATED'} G2=${G2()}`);
<   console.log('  ==> 실제 복구까지 걸린 시간: 1분이 아니라 R이 TERMINAL 될 때까지(최대 SLOT_TTL 3h)');
< }
< 
< console.log('\n=== [검증D] SWEEP이 진행 중인 정상 잡을 건드리는가 ===');
< { reset(); const B=INSERT_JOB('B','RUNNING'); now=0; B.claimedAt=0; SL2('B'); SL3(B,now); B.status='SUBMITTED';
<   console.log(`  발행중 잡 B(publishAttemptAt 있음) SWEEP rows=${SL4_SWEEP()} (0이어야 정상) INV4=${INV4()?'OK':'★VIOLATED'}`);
<   reset(); const C=INSERT_JOB('C','CLAIMED'); now=0; C.claimedAt=0; SL2('C');
<   console.log(`  예약만 쥔 잡 C(consumedAt 없음)   SWEEP rows=${SL4_SWEEP()} (0이어야 정상) 예약주인=${slot.reservedByJobId}`);
< }
---
> const line=(s)=>console.log(s);
> line('=== [C-재검] SWEEP이 ACTIVE 잡에 막히는가 (rev7 중대1 재발 여부) ===');
> reset(); INSERT_JOB('A','FAILED');
> Object.assign(slot,{consumedAt:0,consumedByJobId:'A',reservedByJobId:'A',reservedUntil:15*M});
> line('  stale 주입: INV4='+(INV4()?'OK':'★VIOLATED')+' G2='+G2());
> INSERT_JOB('R','QUEUED'); line('  재시도 잡 R QUEUED INSERT (제약9 통과)');
> now=1*M; line('  t=1m  SWEEP rows='+SL4_SWEEP()+'  INV4='+(INV4()?'OK':'★VIOLATED')+'  G2='+G2());
> line('  t=1m  R claim SL2 rows='+SL2('R')+'  예약주인='+slot.reservedByJobId);
> line('  ==> 1분 내 복구+claim? '+((INV4()&&slot.reservedByJobId==='R')?'YES':'★NO'));
> line('');
> line('=== [D-재검] SWEEP이 정상 진행 잡을 건드리는가 (회귀) ===');
> reset(); now=0; const B=INSERT_JOB('B','RUNNING'); SL2('B'); SL3(B,now);
> line('  발행중 잡 B(publishAttemptAt 있음)  SWEEP rows='+SL4_SWEEP()+' (0이어야 정상) INV4='+(INV4()?'OK':'★VIOLATED'));
> reset(); now=0; INSERT_JOB('C','CLAIMED'); SL2('C');
> line('  예약 쥔 활성 잡 C (stale 아님)      SWEEP rows='+SL4_SWEEP()+' (0이어야 정상) 예약주인='+slot.reservedByJobId);
> reset(); now=0; INSERT_JOB('D','CLAIMED'); SL2('D'); Object.assign(slot,{consumedAt:0,consumedByJobId:'D'});
> line('  살아있는 예약 쥔 D + stale          SWEEP rows='+SL4_SWEEP()+' (0이어야 정상=보호) 예약주인='+slot.reservedByJobId);
> line('');
> line('=== [A-재검] 시나리오4 — 트리거를 하드코딩 없이 규범 술어(TX)로 ===');
> reset(); now=0; const E=INSERT_JOB('E','CLAIMED'); E.claimedAt=0; SL2('E');
> now=16*M; let r=TX(E,{pubAttempt:E.claimedAt,status:'UNVERIFIED'});
> line('  ACTIVE→UNVERIFIED: 발동='+r.fired+' '+(r.by||'')+' rows='+r.rows);
> now=18*M; r=TX(E,{pubAttempt:null,status:'FAILED'});
> line('  UNVERIFIED→FAILED: 발동='+r.fired+' '+(r.by||'')+' rows='+r.rows);
> line('  => 자리: '+(slot.consumedAt!==null?'★영구소각':'해제됨')+'  INV4='+(INV4()?'OK':'★VIOLATED')+'  G2='+G2());
> line('');
> line('=== [B-재검] 부록D 시나리오1 — 제약9에 맞는 셋업으로 재구성 ===');
> reset(); now=0; const A2=INSERT_JOB('A','CLAIMED'); A2.claimedAt=0; SL2('A');
> line('  A claim: 예약주인='+slot.reservedByJobId+'/'+(slot.reservedUntil/M)+'m');
> now=2*M; let r2=TX(A2,{status:'SKIPPED'}); line('  A→SKIPPED: SL4 발동='+r2.fired+' rows='+r2.rows);
> now=3*M; const B2=INSERT_JOB('B','QUEUED'); B2.status='CLAIMED';
> line('  (A가 TERMINAL 된 뒤에야) B INSERT+claim SL2 rows='+SL2('B')+'  예약주인='+slot.reservedByJobId);
> now=4*M; line('  reaper가 종료된 A로 SL4 재실행 rows='+SL4('A')+' (0이어야 정상)');
> line('  => B 예약 보존? '+(slot.reservedByJobId==='B'?'YES':'★NO'));
> let blocked=false; try{ INSERT_JOB('C','QUEUED'); }catch(e){ blocked=true; line('  수동발행 C INSERT: '+e.message); }
> line('  => C가 제약9로 막힘? '+(blocked?'YES(정상)':'★NO'));
```

### D-2. 실행 결과 (raw)

```
=== [C-재검] SWEEP이 ACTIVE 잡에 막히는가 (rev7 중대1 재발 여부) ===
  stale 주입: INV4=★VIOLATED G2=1
  재시도 잡 R QUEUED INSERT (제약9 통과)
  t=1m  SWEEP rows=1  INV4=OK  G2=0
  t=1m  R claim SL2 rows=1  예약주인=R
  ==> 1분 내 복구+claim? YES

=== [D-재검] SWEEP이 정상 진행 잡을 건드리는가 (회귀) ===
  발행중 잡 B(publishAttemptAt 있음)  SWEEP rows=0 (0이어야 정상) INV4=OK
  예약 쥔 활성 잡 C (stale 아님)      SWEEP rows=0 (0이어야 정상) 예약주인=C
  살아있는 예약 쥔 D + stale          SWEEP rows=0 (0이어야 정상=보호) 예약주인=D

=== [A-재검] 시나리오4 — 트리거를 하드코딩 없이 규범 술어(TX)로 ===
  ACTIVE→UNVERIFIED: 발동=true ⓧⓨ rows=0
  UNVERIFIED→FAILED: 발동=true ⓧⓨ rows=1
  => 자리: 해제됨  INV4=OK  G2=0

=== [B-재검] 부록D 시나리오1 — 제약9에 맞는 셋업으로 재구성 ===
  A claim: 예약주인=A/15m
  A→SKIPPED: SL4 발동=true rows=1
  (A가 TERMINAL 된 뒤에야) B INSERT+claim SL2 rows=1  예약주인=B
  reaper가 종료된 A로 SL4 재실행 rows=0 (0이어야 정상)
  => B 예약 보존? YES
  수동발행 C INSERT: 제약9 위반: C INSERT 거부(이미 ACTIVE 잡 존재)
  => C가 제약9로 막힘? YES(정상)
```

### D-3. 시나리오 B의 셋업을 바꾼 이유

rev7 부록 D의 시나리오 1은 `A`와 `B`를 **둘 다 `QUEUED`로 먼저 만들어** 놓고 시작했다. 제약 9(`INV5`)를 신설한 rev7부터 그 초기 상태는 **INSERT 단계에서 거부**되므로 성립하지 않는다. rev8은 규범에 맞게 **`A`가 `TERMINAL`이 된 뒤에 `B`를 넣는** 순서로 재구성했고, 그 위에서 5차 지적(종료된 A로 `SL4` 재실행 시 B 예약 보존)과 동시발행 차단을 확인했다.

### D-4. 왜 `t=15m` 창이 닫히는가 (6차 중대1, 유지)

```
t=0        A claim.  A.status=CLAIMED(ACTIVE)   slot.res=A/+15m   consumed=-
t=15m10s   A 예약 만료. B가 SL2 시도.
           → rev6: consumedAt IS NULL ✓, 예약 만료 ✓  ⇒ 통과 (구멍)
           → rev8: NOT EXISTS(다른 ACTIVE 잡)에서 A가 여전히 CLAIMED ⇒ 0행. 창이 닫힘
t=15m40s   R1-a: A.publishAttemptAt=claimedAt, A→UNVERIFIED, SL3로 consumed=A (예약 주인은 여전히 A)
t=18m      R1-c: publishAttemptAt=NULL, A→FAILED
           SL4($jobId=A): NOT EXISTS ✓, 가드 reservedByJobId=A=$jobId ✓ ⇒ 1행 해제
```

핵심은 **"예약 만료"와 "잡 종료"를 분리한 것**이다. 예약 만료는 리스 타이머가 끝났다는 뜻일 뿐 잡 A가 끝났다는 뜻이 아니다. `INV5`는 기준을 "잡이 `TERMINAL`이 되어야 자리가 넘어간다"로 바꾼다.

### D-5. 세 가드의 축이 이제 일치한다

| 규칙 | 축 | 지키는 것 |
|---|---|---|
| `SL2` 예약 | **잡 생존**(`ACTIVE` 배타) | 살아있는 잡의 자리를 뺏지 않는다 |
| `SL4` 해제 | **예약 소유권** | 남이 쥔 살아있는 예약을 지우지 않는다 |
| `SL4-SWEEP` | **예약 소유권**(rev8에서 통일) | 〃. rev7은 여기만 `ACTIVE` 축이라 자가복구가 스스로 막혔다 |

> **[잔존 리스크 — 2026-08-08 `INV6` 신설로 재작성]** `job-reaper`가 죽으면 `ACTIVE` 잡이 안 걷힌다. 방향은 여전히 **안전 쪽 실패**(중복 발행이 아니라 미발행)지만, **폭발 반경이 커졌다.**
> - **이전(`INV6` 전)**: 배타가 슬롯 단위(제약 9)라 묶이는 것은 **그 자리 하나**였고 같은 블로그의 다른 슬롯은 살아 있었다.
> - **지금(`INV6` 후)**: 배타가 블로그 단위라 걷히지 않은 `CLAIMED` 잡 하나가 **그 블로그의 모든 후속 발행을 막는다.** 3차 검수 실측: 리스가 24시간 전 만료된 `CLAIMED` 잡 + 다른 슬롯의 정상 `QUEUED` 잡 → `jobs=0`, `skipped=[{"reason":"BLOG_BUSY"}]`.
> - **★`expiresAt`(3h) 상한은 자동으로 발동하지 않는다.** `EXPIRED` 전이를 실행하는 주체가 `job-reaper`인데 그게 죽은 상황이므로, "3시간이면 풀린다"는 이전 서술은 **reaper가 살아 있을 때만 참**이다.
> - **따라서 `job-reaper`는 `INV6`의 전제조건이다.** reaper 없이 `INV6`만 켜면 한 번의 리스 누락이 그 블로그를 무기한 정지시킨다. reaper 생존 감시를 A1 1순위 지표로 두고, reaper 구현 전까지는 이 조합이 **미완 상태**임을 5-2-1에도 적었다.

> 스크립트: `qa7.js`(검수 원본) / `rev8_check.js`(변경분: 엔진 1곳 + 드라이버 4건 + 헤더 주석 — D-1·D-1-1 참조). 페이즈2에서 `F6-①~⑨` Vitest로 이관한다.

---

## 관련
- 선행 결정: [[2026-08-08_naver_blog_saas_plan]]
- 원본 회의: `00_Raw/2026-08-08/run_20260808_105736_naver_blog_saas_네이버블로그자동화SaaS기획/`
- rev1 커밋: `7024ce3` (검수 FAIL) · rev2: 본 문서
