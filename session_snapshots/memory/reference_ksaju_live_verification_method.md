---
name: reference_ksaju_live_verification_method
description: "k-saju 라이브 반영 여부를 판정하는 방법 — 목적별로 봐야 할 신호가 다르고, 영어 원문 문자열 검색은 못 쓴다"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 66b3be13-7e74-4820-96bf-fbb885c9a130
  modified: 2026-08-20T10:03:25.492Z
---

k-saju(Next.js + next-intl + Vercel)에서 "내 변경이 라이브에 나갔나"를 판정할 때:

| 알고 싶은 것 | 보는 것 |
|---|---|
| 배포가 반영됐나 | **i18n 메시지 키 존재 여부**(예: `tomorrowTeaser`) — 로케일과 무관 |
| 실제로 렌더됐나 | **보간된 문자열**(`내일은 다른 날입니다: 丁卯`) 또는 브라우저 렌더 화면 |

함정 두 가지 (2026-08-20 실측):
- **영어 원문 문자열 검색은 못 쓴다.** 서버 geo가 KR이라 `/en/...`을 불러도 한국어로 서빙된다. 영어 문자열로 세면 0이 나온다.
- **next-intl은 메시지 번들 전체를 RSC 페이로드에 싣는다.** 그래서 원문 템플릿(`{pillar}` 그대로)과 보간 결과가 **둘 다** 검색에 걸린다. 템플릿만 보고 "렌더됐다"고 판정하면 오진.

배포 지연 기준선: **60초~수 분, 때로 10분 이상**. 미반영이 사실이어도 그게 곧 자동배포 미트리거는 아니다 — 재트리거(빈 커밋)를 거론하기 전에 배포 이력에서 평소 소요시간부터 확인할 것.

캐시인지 아닌지는 응답 헤더로 가른다: `x-vercel-cache: MISS` + `age: 0`이면 원본이 새로 생성한 것이므로, 그래도 없으면 **배포된 빌드에 정말 없는 것**이다.

**★ 유료 게이트 뒤에 있는 문자열은 배포 판정에 못 쓴다** (2026-08-20 실측):
익명 요청으로는 원리적으로 안 보인다. 그리고 i18n 번들이 아니라 **데이터 모듈**에
있는 값(예: 타로 카드의 `traditionKo`)은 RSC 페이로드에도 안 실린다. 배포 반영을
잴 때는 반드시 **공개 구간에 렌더되는 고유 키**로 재라. 어떤 키가 공개인지는
`git show <커밋> -- messages/*.json` 으로 확인.

**프로덕션 배포 브랜치는 `main` 이다.** 작업 브랜치 배포는 Vercel Preview 라 손님에게 안 보인다. 2026-08-20 에 `daily-card-jpeg`·`zodiac-grid` 가 라이브에 있는 걸 보고 "작업 브랜치가 프로덕션"이라고 오판했는데, 실제로는 그 커밋들이 **이미 main 에 머지돼 있었던** 것이었다. 라우트 존재 여부로 배포 브랜치를 추론하지 말고 `git log origin/main` 을 볼 것.

관련: [[reference_headless_screenshot_needs_cdp_emulation]], [[feedback_verify_measurement_before_declaring_failure]], [[feedback_running_screen_is_not_commit_state]]
