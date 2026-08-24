---
name: reference_ga4_excludes_headless_ua_2026-08-24
description: GA4는 헤드리스 UA 히트를 204로 받아놓고 리포트에서 제외한다 — 전송 성공인데 판독 영원히 실패
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5fba1c85-e880-4953-a8f0-3246cdd5fb47
  modified: 2026-08-24T00:25:08.143Z
---

GA4는 기본 봇 제외(IAB 목록)를 적용하고 그 목록에 `HeadlessChrome`이 들어 있다. **히트를 `204`로 정상 수신해 놓고 리포트에는 안 넣는다.**

→ **"요청이 나갔다"(1단계)는 통과인데 "리포트에 잡힌다"(2단계)는 영원히 실패**하는 조합이 만들어진다. 전송 로그만 보면 초록불이라 아무도 안 본다 — [[feedback_check_tool_can_false_pass]]의 교과서적 사례.

**가르는 법(2026-08-24 data-finance 실측):** 같은 이벤트를 **UA만 바꿔 두 번** 쏜다. 일반 UA → 실시간 보고서에 잡힘 / 헤드리스 UA → 안 잡힘.

★**유입·전환을 GA4로 검증할 땐 반드시 일반 UA로 잰다.** 카나리·QA·배포 후 확인 전부 해당. 헤드리스로 재고 "유입 0"이라고 보고하면 그건 유입이 아니라 UA 문제다.

같은 날 나온 자매 함정: 라이브 k-saju가 GA4로 아무것도 안 보내던 원인은 `lib/analytics.ts`가 `dataLayer`에 **배열**을 push한 것 — gtag.js는 `arguments` 객체만 소비한다(`gtm.uniqueEventId`가 찍힌 항목만 처리됨으로 판별). `send_page_view:false`와 겹쳐 자동 page_view까지 0이었다.

관련: [[feedback_verify_measurement_before_declaring_failure]] · [[reference_headless_screenshot_needs_cdp_emulation]]
