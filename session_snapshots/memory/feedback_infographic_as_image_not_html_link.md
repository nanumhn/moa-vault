---
name: feedback_infographic_as_image_not_html_link
description: 형이 "인포그래픽"을 요청하면 HTML 아티팩트 링크가 아니라 실제 이미지 파일(PNG)로 캡처해서 Discord에 첨부할 것
metadata:
  type: feedback
  originSessionId: bf3fbb37-1ff7-4b12-a3c5-e0715af4a86e
  modified: 2026-08-16T04:10:48.061Z
---

형이 "인포그래픽으로 보여줘"라고 하면 지금까지 계속 HTML 아티팩트(웹페이지 링크)로 만들어 보냈는데, 형은 매번 링크를 눌러 들어가야 했다. 2026-08-16에 명시 지적: "인포그래픽으로 요청을 하면 넌 항상 웹페이지 하나짜리로 보여줘서... 이미지로 달라고 했는데 HTML 웹페이지로 준다?"

**Why:** 이미지 요청은 Discord에서 바로 열리는 첨부파일을 기대하는 것이지, 링크 클릭→로그인→로딩을 거치는 웹페이지를 기대하는 게 아니다. 특히 모바일에서 차이가 크다.

**How to apply:**
- 형이 "인포그래픽/이미지/한 장으로" 요청하면: ①artifact-design + frontend-design(필요시) 스킬로 HTML 만들기까지는 그대로 하되 ②`file://` 로컬 경로로 chrome-devtools 열어서 `take_screenshot(fullPage: true, filePath: ...)`로 PNG 캡처 ③그 PNG를 `mcp__plugin_discord_discord__reply`의 `files` 파라미터로 직접 첨부해서 보낸다. 아티팩트 링크도 곁들여도 되지만(나중에 다시 보고 싶을 때 유용), **이미지 첨부가 항상 기본**이어야 한다.
- 캡처 전에 반드시 스크린샷을 직접 확인(Read)해서 레이아웃 깨짐(요소 겹침 등)이 없는지 검증할 것 — 이번에 화살표 라벨이 negative margin 때문에 가려지는 버그를 캡처 검증 단계에서 잡았다.
- claude.ai 아티팩트 URL은 이 세션의 크롬(chrome-devtools attach)이 로그인 안 돼있어서 열리지 않는다(Page not found) — 캡처는 항상 로컬 HTML 파일을 `file://`로 직접 열어서 뜬다.

관련: [[reference_image_tool_by_korean_text]]
