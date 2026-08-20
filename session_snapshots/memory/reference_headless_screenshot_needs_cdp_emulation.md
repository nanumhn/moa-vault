---
name: reference_headless_screenshot_needs_cdp_emulation
description: 헤드리스 --window-size 로는 모바일 뷰포트가 안 나온다 — 멀쩡한 화면이 잘린 것처럼 보여 오진을 부른다
metadata: 
  node_type: memory
  type: reference
  originSessionId: 66b3be13-7e74-4820-96bf-fbb885c9a130
  modified: 2026-08-20T10:03:45.049Z
---

`msedge/chrome --headless=new --window-size=390,800 --screenshot=...` 로 모바일 화면을 찍으면 **레이아웃은 창 최소 폭(~500px)으로 잡히고 이미지만 390으로 크롭된다.** 결과적으로 멀쩡한 페이지가 오른쪽이 잘린 것처럼 보인다. 2026-08-20에 이걸로 "모바일에서 가로 넘침" 오진을 할 뻔했다(라이브 사이트도 똑같이 잘려 보인 게 단서였다).

**진짜 모바일 뷰포트로 찍으려면 CDP 디바이스 에뮬레이션을 써야 한다:**
1. `--headless=new --remote-debugging-port=9222 --user-data-dir=<매번 다른 경로>` 로 띄운다
   (★프로필 경로를 재사용하면 두 번째 실행부터 스크린샷이 조용히 안 만들어진다)
2. `http://127.0.0.1:9222/json/list` 에서 page 타깃의 webSocketDebuggerUrl 획득
3. `Emulation.setDeviceMetricsOverride {width, height, deviceScaleFactor:2, mobile:true}`
4. `Page.navigate` → `Page.loadEventFired` 대기 → `Page.captureScreenshot {captureBeyondViewport:true}`

**판정 근거를 같이 찍을 것:** `Runtime.evaluate` 로 `innerWidth`/`document.documentElement.scrollWidth` 를 읽어 둔다. 둘이 같으면 가로 넘침이 없는 것이고, 이미지가 잘려 보여도 그건 촬영 아티팩트다.

응답을 가짜로 만들어 특정 UI 상태만 보고 싶으면 `Fetch.enable` + `Fetch.fulfillRequest` 로 브라우저 단에서 가로챈다(제품 코드에 테스트용 분기를 넣지 말 것).

Chrome 은 이 환경에서 `--version` 조차 실패한다(세션 제약). **Edge(`/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`)를 쓸 것.**

관련: [[feedback_visual_output_needs_eyeball_check]], [[feedback_verify_measurement_before_declaring_failure]], [[reference_ksaju_live_verification_method]]
