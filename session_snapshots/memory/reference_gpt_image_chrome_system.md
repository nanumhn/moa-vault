---
name: reference_gpt_image_chrome_system
description: GPT 이미지 생성 크롬 자동조종 시스템 — chrome-devtools로 ChatGPT Projects 조종해 이미지 양산. 셀렉터·저장방식·config·차단회피
metadata: 
  node_type: memory
  type: reference
  originSessionId: fdbadc66-c231-46ec-91be-2b3150f85ac4
  modified: 2026-07-25T11:47:14.363Z
---

GPT 유료구독을 이미지 생성에 활용하는 **크롬 자동조종 시스템**. 2026-07-23 구축·라이브 테스트 성공. Flux(로컬 무료)와 **병렬 2트랙** — Flux는 대량·$0, GPT는 고품질. 담당 = [[media-head-siwoo]]. 설계 원안 = cto-seojin.

**폴더:** `D:\Develop\moa-studio\tools\gpt-image\`
- `config.json` — 셀렉터 + 형 확정값
- `browser_ops.js` — 검증된 조종 함수 4종(checkLogin/submitPrompt/pollForImage/fetchImageB64)
- `save_image.py` — base64→날짜폴더 저장
- `gen_image.ps1` — 실행 흐름

**★ 구조 = ChatGPT Projects.** 형이 매달 '이미지박스 YYYYMM' 프로젝트를 만들고 **프로젝트 지침(custom instructions)에 스타일을 넣어둠** → 주문은 '무엇을 그릴지' 개념만 적으면 스타일 자동적용(귀여운 3D 등). 지침 세팅·프로젝트 생성은 형 계정이라 형만.

**★★ 생성 위치 = 기본 '이미지박스 프로젝트 폴더' (2026-07-25 형 명시 정정).** GPT 이미지 생성(사진 지브리 변환 등 포함)은 **반드시 이미지박스 프로젝트 폴더에서** 한다. 일반 대화(general chat)에서 하는 건 **예외: 로고 등 텍스트가 프로젝트 스타일지침과 충돌할 때만**. 사진·일반 이미지는 프로젝트 폴더가 기본. (이 세션에서 사진 변환을 일반 대화로 돌렸다가 형이 "gpt 프로젝트 폴더에서 생성해줘야지" 정정 — media-head에 반드시 프로젝트 폴더 사용 지시할 것.)

**★ 형 확정 config (2026-07-23):** dailyCap 20 / batchMax 4(한 주문 최대 4장) / batchGapSec 180(배치 사이 3분, 추후조정 단일변수) / outDir=output + dateSubfolder(output\YYYYMMDD\).

**크롬 attach:** 디버그 크롬(포트 9222) + 프로필 `C:\chrome-debug-profile` ([[reference_chrome_debug_setup]]). ★이 프로필은 형 일반 크롬과 별개라 **GPT 로그인 세션이 따로 필요** — 없으면 로그인 페이지 띄우고 형에게 "그 창에서 로그인 1회" 요청(계정·비번은 형만, 구글은 팝업 [[feedback_google_login_popup]]). 로그인 후 세션 유지됨.

**측정된 셀렉터 (이 UI버전, 변할 수 있음):**
- 컴포저: `#prompt-textarea` (contenteditable DIV)
- 전송: `[data-testid="send-button"]` — ★텍스트 입력 후에만 DOM 생성(빈 상태엔 없음)
- 이미지 감지: `img[src*="backend-api/estuary/content"]` (naturalWidth>200, 아바타 제외). 설계의 `[data-message-author-role=assistant]`는 이 버전에 없어 정정
- 프로젝트 진입: **URL 직접 네비가 최안정** (`.../g/g-p-<id>-imijibagseu-202607/project`)

**★ 저장 방식 (중요):** estuary 이미지 URL은 세션쿠키 인증 필요 → 외부 다운로드 불가. **페이지 컨텍스트에서 `fetch(src,{credentials:'include'})` → base64 → save_image.py로 디코드 저장.** 재현 검증됨.

**★ 이미지 업로드→스타일변환 (2026-07-23 추가, 사진 픽사풍 변환 성공):**
- 플러스 버튼 `[data-testid="composer-plus-btn"]`(aria "파일 등 추가") → 팝업 → "컴퓨터에서 업로드" 메뉴항목 클릭 → 네이티브 파일선택창.
- 파일 세팅 = chrome-devtools `upload_file` 도구로 그 메뉴항목 uid 타겟(파일선택창 인터셉트). ★숨은 file input(`#upload-photos` 등)은 sr-only라 a11y 스냅샷에 안 나옴 → input 직접 타겟 불가, 반드시 "컴퓨터에서 업로드" 메뉴 경유.
- ★★ `upload_file`은 **워크스페이스 루트(`D:\Develop\Claude_Channels`, %TEMP%)로 제한** — 디스코드 inbox 등 외부경로 거부됨. **외부 파일은 먼저 허용 루트(스크래치패드)로 cp 복사 후 업로드.**
- 업로드 확인 = `form img[src^="blob:"]` 썸네일 등장. 이후 프롬프트→전송→pollForImage→fetchImageB64는 텍스트경로와 동일.
- browser_ops.js에 openUploadMenu()/confirmUpload() 반영됨.

**차단회피:** 형 실세션 고정 / type_text 사람속도 / 선전송 랜덤정지 0.8~2.5s / evaluate_script 내 alert·confirm·prompt 미사용(모달 먹통 방지 — 브라우저 자동화 공통주의) / rate_limit·policy 감지 시 즉시 중단·재시도 금지.

**남은 TODO(치명 아님):** 신규 프로젝트 자동생성·지침 자동세팅 셀렉터 미측정(이번엔 프로젝트가 이미 존재). 월 롤오버/신규 프로젝트 시 실측.

관련: [[reference_flux_image_pipeline_2026-07]] [[reference_chrome_debug_setup]] [[reference_media_stack_2026-07]] [[feedback_background_long_tasks]]
