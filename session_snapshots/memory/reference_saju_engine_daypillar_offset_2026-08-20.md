---
name: reference_saju_engine_daypillar_offset_2026-08-20
description: "사주 일진(지지) 2칸 오차 — 같은 상수가 두 파일에 복사됨, 데일리카드 경로는 아직 미수정"
metadata: 
  node_type: memory
  type: reference
  originSessionId: cd1b24e6-a596-4af8-aacf-4a999574e1ec
  modified: 2026-08-20T05:31:12.146Z
---

`saju-studio`의 60갑자 기준점 상수가 10일 어긋나 **일진의 지지가 2칸씩 밀린다.** 2026-08-17에 발견했으나 **문서에만 적고 코드는 안 고친 채 방치**됐고, 2026-08-20 형 질문("사주 컨텐츠는 확인 되었니?")으로 다시 드러났다.

**실행해서 검증한 값**
```
1900-01-01  코드 甲子 / 정답 甲戌
2000-01-01  코드 戊申 / 정답 戊午
2026-08-20  코드 丙辰 / 정답 丙寅
```

**왜 두 달간 안 걸렸나** — 기준점이 정확히 10일 어긋나서 **천간(10주기)은 항상 맞고 지지(12주기)만 틀린다.** 오행 콘텐츠는 천간만 쓰므로 정상으로 보였다. → **파생값 하나가 맞다고 원본이 맞다고 보지 말 것.**

**★같은 상수가 두 파일에 복사돼 있다 (한쪽만 고치는 사고 주의)**
1. `src/lib/saju/engine.ts` — `sexagenaryFromJDN()`
2. `src/app/api/og/daily-card/route.tsx` — 엔진을 안 쓰고 **자체 `dayPillar()`/`julianDay()`를 가짐**. ★**이쪽이 매일 데일리카드로 공개 발행되는 경로**(`pillarHanja`로 렌더)

**고칠 값**: `base = 2451491` (1999-11-08 = 甲子일). 위 두 기준일로 교차검증함.

**2026-08-20 14:30 시점 상태**
- 엔진(①): 덱스가 수정 완료, 회귀 기준일 2개 추가, 테스트 115개 통과 — **단 커밋 안 됨(작업트리에만)**
- 데일리카드(②): **미수정.** 덱스가 OS 쓰기 차단으로 보류 → 클로가 잠금 해제 확인 후 재개 요청함
- ★그 파일엔 8/17 인스타 JPEG 작업분 **미커밋 36줄**이 있다. checkout/되돌리기 금지

**How to apply**: 다음 세션은 덱스 회신을 확인하고 **재조회로** 커밋 여부와 상수 값을 검증할 것(`grep -n "base = 24" src/lib/saju/engine.ts src/app/api/og/daily-card/route.tsx`). 오늘 날짜 카드를 뽑아 **丙寅**이 나와야 완료다. 운세·궁합·타로 메뉴화는 이것이 끝난 뒤에 얹는다 — 안 그러면 매일 틀린 띠를 성실히 반복 발행한다.

관련: [[feedback_verify_measurement_before_declaring_failure]] [[feedback_no_falsehood_double_check]] [[project_open_threads_2026-08-20_afternoon_snapshot]]
