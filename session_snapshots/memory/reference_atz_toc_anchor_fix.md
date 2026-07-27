---
name: reference_atz_toc_anchor_fix
description: 아투 목차(Contents) 링크가 한글 제목에서 죽는 원인과 해결 — 소제목에 sec-N id 부착. 2026-07-27 181편 복구 완료
metadata: 
  node_type: memory
  type: reference
  originSessionId: 771e9b4c-1ade-4980-828c-f82c0b7d539a
  modified: 2026-07-27T07:15:38.185Z
---

**아투 테마의 목차는 한글 소제목에서 원리적으로 작동할 수 없다.** 2026-07-27 형 지적 → 원인 규명 → 181편 복구 완료.

## 원인 (테마 `base.js`, ndabas/toc의 VIETRICK 포크)
목차 라이브러리가 제목 텍스트에서 id를 자동 생성하는데, 그 로직이 `.replace(/([^\w]+|\s+)/g, '-')`를 쓴다. **`\w` = `[A-Za-z0-9_]`라 한글이 전부 걸러진다.**
```
"📌 무슨 일이 있었나"       → id = ""     ← href="#"가 되어 클릭해도 안 움직임
"1. 사건 개요 – 판사가…"    → id = "1"    ← 숫자만 살아남아 우연히 작동
```
- 빈 문자열이면 라이브러리의 중복회피 루프(`document.getElementById(n+e)`)도 안 돈다 — `getElementById("")`는 항상 null.
- 설정은 `$("#tocify").toc({content:"#post-body", headings:"h2,h3"})` → **h2·h3 둘 다 목차에 잡힌다.** 그래서 "목록엔 뜨는데 링크만 죽는" 증상이 된다.

## 해결 = A안 (채택). 라이브러리가 `return e || <자동생성>`이라 **기존 id를 존중한다**
`style.mjs`의 `decorateHeadings()`가 `id="sec-N"`을 부착한다. 제목 텍스트는 안 건드리고, 목차 번호는 테마가 매긴 것 하나만 남는다. 테마(외부 CDN, 우리 소유 아님)를 수정하지 않아 안전.

## ★버린 대안과 그 이유 — 실물을 봐야 드러난 것들
- **B안(제목에 번호 붙이기)**: 링크는 살아나지만 **목차에 번호가 두 번 찍힌다**(`1. 1. 무슨 일이…`). 목차 `<ol>`이 자체 번호를 매기기 때문. **코드로는 안 보이고 스크린샷에서 드러났다.**
- **번호 끄는 CSS `list-style:none`**: 안 먹힌다. 번호는 list-style이 아니라 **CSS counter**로 그려진다 — `#tocify li::before{content:counters(ify,".") "."}`. `getComputedStyle`은 `listStyleType:"none"`을 반환해 **성공으로 오판하기 딱 좋다.** 화면을 열어보고서야 잡혔다.

## 재발 방지 / 재실행
- 도구: `D:\Develop\moa-studio\tools\blogger-publish\toc-bulk.mjs`
  - 인자 없음 = 스캔만 / `--pilot` = 1건 / `--apply` = 전체
  - **테마 id 로직을 복제해 "빈 id가 나오는 글"만 대상**으로 삼는다(형 지시: 안 먹히는 곳에만). 번호로 이미 작동하는 글은 안 건드림.
  - 안전장치: 글별 백업, 기존 id 존중, **태그 뺀 본문 텍스트가 달라지면 즉시 중단**.
- 2026-07-27 실적: 181편 중 138편 깨짐 → 137편 수정(1편은 파일럿) → 재검사 0편 → 무작위 3편 브라우저 실측 통과.

## 함정 — 검증 시 오판 2가지
1. **lazy 이미지**: 클릭 직후 스크롤 위치로 판정하면 이미지 로드로 레이아웃이 밀려 "실패"로 나온다. **끝까지 스크롤해 전부 로드시킨 뒤** 대상의 `getBoundingClientRect().top`(뷰포트 기준)으로 판정하라.
2. **템플릿 리터럴 안의 `\s`**: `` `[\s\S]` ``는 `[sS]`로 축약돼 매치가 0이 된다. 정규식은 리터럴(`/…/`)로 써라. dry-run 검사줄이 없었으면 CSS 잔재가 남은 채 반영됐다.

관련: [[project_atz_hallucination_fix_2026-07-27]] [[feedback_verified_facts_only]] [[reference_google_accounts_by_purpose]]
