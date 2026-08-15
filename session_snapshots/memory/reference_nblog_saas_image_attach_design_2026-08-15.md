---
name: reference_nblog_saas_image_attach_design_2026-08-15
description: nBlog 사용자 이미지 첨부 기능 — 독립 기술검토 결론(cto). 드라이브링크+서버재호스팅+K열분리가 정답, 시트셀 이미지객체는 API로 불가능함 확인
metadata:
  type: reference
  originSessionId: 9aec50e3-ec92-4e7b-a0d6-3a64b520a762
  modified: 2026-08-15T03:59:35.323Z
---

nBlog "A서비스"(AI본문자동화) 부가서비스에 사용자 본인 이미지를 첨부하게 하는 기능을 설계하며, 첫 검토(같은 세션의 fork)와 독립 재검토(cto-seojin) 두 라운드를 거쳤다. 첫 검토는 "드라이브 공유링크를 텍스트로"만 추천했는데, 독립 재검토가 그 안의 구체적 함정 두 개를 잡아냈다.

## 결론
- **(a) 구글드라이브 링크 — 채택, 단 그대로 쓰면 안 됨.** 사용자가 붙여넣은 링크를 **서버가 초안 생성 시점에 다운로드·검증한 뒤 자체 서버(`/api/media/ai/<hex>.jpg`)로 재호스팅**해서, 본문에는 항상 우리 URL만 들어가게 한다.
- **(b) 시트 셀에 이미지 객체 직접 삽입 — 불가능 [확인].** Sheets API v4 discovery doc 전체에 `image` 필드 자체가 없다(차트 전용 `EmbeddedObjectPosition`만 있음). `values.get`은 문자열만 준다. `=IMAGE("url")` 수식도 결국 공개 URL이 필요해서 (a)로 회귀.
- **(c) 대시보드 업로드 신설 — 비추천.** 입력 경로가 시트 하나(J열 중심)인 설계와 어긋나고(2도구 왕복), 검토화면이 지금 읽기전용이라 업로드 UI까지 새로 지어야 함(+3일 이상).

## (a)를 그대로 쓰면 안 되는 이유 — 함정 두 개
1. `agent/src/main/content.ts:62`의 `IMAGE_URL_RE`가 **확장자로 끝나는 URL만** 이미지 줄로 인식한다. `uc?export=download&id=...` 형식엔 확장자가 없어서 이미지가 아니라 평문으로 취급돼 주소 그대로 발행된다.
2. `agent/src/main/publish.ts:171-186`의 `downloadImage()`가 **content-type·매직바이트를 안 본다**(res.ok만 확인). 드라이브 링크가 공유 비공개면 구글이 로그인 HTML을 200으로 주는데, 그게 그대로 ".jpg"로 저장돼 네이버 업로드 단계에서 몇 시간 뒤(발행 시점, 남의 PC) 엉뚱한 에러로 죽는다.

→ 서버가 미리 받아서 재호스팅하면 두 함정 다 사라진다(우리 URL은 항상 `.jpg`로 끝나고, content-type 검증도 서버 쪽에서 미리 함).

## 열 배치 — J열에 섞으면 안 됨, K열로 분리
- J열은 `AI_KEYWORD_MAX=200`자 제한이 있고(`schema.ts:72`), `promptHash = contentHashOf(title, keyword)`(`schema.ts:422`) 계산에 쓰인다. 이미지 URL(장당 70~100자)을 J에 같이 넣으면 글자수 예산도 부족하고, **동일성 키가 흔들려서 같은 글이 무한 증식하는 R9류 사고**를 유발할 수 있다.
- `SHEET_EXT_HEADERS`(`schema.ts:37`)가 이미 "있으면 읽고 없으면 무시" 확장 열 구조라, K열 "첨부 이미지"를 배열에 추가하면 `SHEET_READ_COLS`가 자동 확장되고 헤더검증(9열 고정)은 그대로라 **기존 고객 시트 무회귀**.

## 같이 처리해야 할 부수 이슈
- `sanitizeParagraph`(`draft-body.ts:45`)가 본문 속 이미지 URL을 걷어내므로, 사용자 이미지는 반드시 `PlacedImage` 경로(`source: "USER"` enum값 추가)로 넣어야 한다.
- `AI_MEDIA_DIR`에 사용자 이미지가 쌓이는데 **retention 크론이 아직 미구현**(README에 명시) — 블로그당 용량 상한 + 30일 미검토 만료 삭제를 같이 구현해야 디스크가 무한정 안 늘어난다.

## 견적
(a)+서버 재호스팅 ≈ 1.5~2일. (c)는 +3일 이상.

관련: [[project_nblog_saas_manual_retry_button_backlog_2026-08-15]] [[reference_nblog_saas_sheet_edit_ignored_after_collection_2026-08-15]]
