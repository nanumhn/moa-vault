---
name: reference_image_tool_by_korean_text
description: "한글 텍스트 중요도로 이미지 도구 선택 — 한글많으면 HTML렌더(최고)/GPT, Flux는 그림전용"
metadata: 
  node_type: memory
  type: reference
  originSessionId: fdbadc66-c231-46ec-91be-2b3150f85ac4
  modified: 2026-07-25T05:09:21.307Z
---

이미지 산출물 도구 선택 기준 (2026-07-25 형 확정, 아투/모임 이미지 작업에서 도출).

**핵심: "로컬"에 두 방식이 있고 한글 대응이 정반대다.**
- 🖼️ **로컬 이미지 생성 (Flux/ComfyUI)** — 한글 텍스트 거의 못 씀(글자 깨짐). 그림/사진 감성(지브리·일러스트·아트 썸네일)엔 최고, $0. [[reference_flux_image_pipeline_2026-07]]
- 📐 **로컬 HTML/CSS 디자인 → chrome 스크린샷 렌더** — 한글 100% 완벽(전부 실제 웹텍스트라 안 깨짐), $0, 부분수정 쉬움(HTML만 고쳐 재렌더). Jua/Pretendard/Gaegu 웹폰트.
- 🌟 **GPT 이미지(크롬 조종 ChatGPT)** — 한글이 어느정도 되지만 라벨 빽빽한 인포그래픽은 여전히 깨질 수 있음. 그림 감성은 진한 편(지브리 수채 등). [[reference_gpt_image_chrome_system]]

**용도별 1순위:**
- 📊 한글 많은 것(인포그래픽·카드뉴스·자막·포스터·교육자료) → **HTML 디자인 렌더**(로컬·무료·한글완벽). 형이 "AI 뚝딱 바이브코딩 인포그래픽"에서 이 방식 채택, 4450×2948 깔끔 산출.
- 🎨 그림/사진 감성(지브리·일러스트·아트) → GPT(감성 진함) 또는 로컬 Flux($0).

**형 표현(정정 포함):** 형이 "로컬은 한글 못한다→한글 중요하면 GPT"라 했는데, 정확히는 로컬 **이미지생성(Flux)**만 그렇고 로컬 **HTML렌더**는 한글 최고다. → "한글 핵심 = HTML렌더(최고) 또는 GPT / Flux는 그림 전용"으로 확정.

**Why:** 한글 텍스트 자산을 Flux로 뽑아 글자 깨져 낭비하는 실수 방지. HTML 렌더가 무료+정확이라 텍스트물 기본값.
**How to apply:** 이미지 요청 받으면 먼저 "글자(특히 한글)가 핵심인가?" 판단 → 예: HTML렌더 우선(안되면 GPT) / 아니오(그림 감성): Flux·GPT. 미디어=한시우(media-head) 위임.

관련: [[reference_media_stack_2026-07]] [[project_moa_open_threads_2026-07-24]]
