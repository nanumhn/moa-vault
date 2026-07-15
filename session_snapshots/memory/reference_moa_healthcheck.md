---
name: reference_moa_healthcheck
description: 모아 정기검사 - Windows 작업 스케줄러 영구 헬스체크 스크립트 위치/구조
metadata: 
  node_type: memory
  type: reference
  originSessionId: d4d85045-9965-4381-b668-83a704d3aa7a
---

모아 스튜디오 **영구 정기검사**(형 요청, 2026-06-18 구축). Claude/n8n 독립으로 매일 서비스 현황+콘텐츠 개수를 점검해 Discord로 보고.

- 스크립트: `C:\Users\user\.moa\moa_healthcheck.ps1` (PowerShell. ⚠️ PS5.1이 UTF-8 BOM 없으면 한글/이모지 깨짐 → **파일 UTF-8 BOM 필수**. Bash로 `printf '\xEF\xBB\xBF'` 프리펜드해 해결함)
- 설정: `C:\Users\user\.moa\healthcheck.config.json` — 감시 대상(localServices/liveSites/contentPaths)·discordWebhook. **사이트 추가는 이 파일에 한 줄만, 스크립트 수정 불필요.** 웹후크 URL은 여기에만(vault/git 금지).
- 작업: 윈도우 작업 스케줄러 `MoaHealthCheck`, **매일 3회 09:00/13:00/17:00 KST**, Interactive/RunLevel Limited(로그인 세션에서 docker 접근). 결과코드 0 검증됨. 보고용 Discord 웹후크는 config에 설정 완료(형 전용 status 채널, 실제 전송 확인). 웹후크 URL 자체는 메모리에 안 적음(로컬 config에만).
- 산출: `last_report.txt`(최근 표), `healthcheck.log`(이력), **`delivery_YYYY-MM.log`(날짜별 발송 로그, 형 요청 6/20)** — 새 발송 감지 시 1줄 "YYYY-MM-DD HH:mm ✅ keyword (한자)" 추가, `delivery_state.json`으로 중복방지. n8n 로그회전과 무관한 깔끔한 날짜순 기록. 디스코드는 config 웹후크 있으면 전송.
- ⚠️ PS5.1 Invoke-RestMethod는 응답을 UTF-8로 안 읽어 한자 깨짐(ä¹å¯) → `Invoke-WebRequest -UseBasicParsing` 후 `[Text.Encoding]::UTF8.GetString($wr.RawContentStream.ToArray())`로 디코드해야 함.
- 감시 정책: alwaysOn=true(n8n·k-saju·nanumn.com·toastdm.com)만 DOWN시 🔴알림, dev서버(moa/saju/clo studio·ComfyUI·LM Studio)는 ⚪상태표시만.
- **데일리 카드 발송 감시(2026-06-19 추가, 6/20 보강)**: config `n8nDailyCard`(workflowName/workflowId tarotDaily00001/maxAgeHours 26). 활성여부=`docker logs n8n`에서 `Activated workflow "..."` 매칭, 마지막발송=**`n8nEventLog*.log`(회전 로그 전부)** 의 `workflow.success`+workflowId ts 모두 파싱해 최신값. 🔴비활성/지연(>26h)·🟡첫발송대기·🟢정상. ⚠️ n8n 재시작하면 이벤트로그가 회전(현재파일 비고 -1.log로 이동)하니 반드시 `*.log` 전부 봐야 함(안 그러면 false-alarm).
- **감시 대상**: 로컬 6서비스 + 라이브 3사이트(k-saju.me·nanumn.com·toastdm.com) + 게시판 2개(jassga `board.php?bo_table=dart_fss_moa`/`stock_news_moa` — HTML에서 `Total N` 정규식으로 글수 파싱, `healthcheck.state.json`에 누적해 증감(+N) 표시). 보고 포맷은 형의 기존 정기점검 보고서 양식 차용.
- 영구성: Windows 작업 스케줄러 + 디스크 파일(.moa\)이라 **세션 재생성·재부팅 무관하게 유지**. state 파일이 증감 누적. 형 강조사항.
- **★통합 watchdog v2 확장(2026-07-03, 형 "스케줄러로 도는 것 전부 감시" 지시)**: 검수관 서지안 운영. 백업 `.bak` 있음. 추가된 것:
  - `-DryRun` 스위치(디스코드 전송·상태쓰기 건너뛰고 last_report.txt만 — 개발/테스트용), `-ConfigPath`.
  - config `n8nDailyCard`(단일) → **`n8nWorkflows`(배열)**로 일반화: 각 워크플로우 active(=`docker exec n8n n8n export:workflow --all` JSON id→active 맵)·최근 `workflow.success`/`workflow.failed` ts 비교(최신 실패>성공이면 error)·maxAge 지연. 대상 tarotDaily00001(08:00,28h)+blogAutoPost001(08:10,28h).
  - **블로그 라이브반영 감시**: `blog.k-saju.me/sitemap.xml`의 `<loc>` 수를 `blog_state.json`에 baseline, blogAutoPost001 성공했는데 sitemap 안 늘고 grace 3h 초과면 🔴"생성됐으나 라이브 미반영(빌드/배포 실패)". ★이번 06-27/07-03 빌드크래시 유형 자동감지.
  - **Windows 작업 스케줄러 감시**: config `scheduledTasks`(현 MoaHealthCheck) `Get-ScheduledTaskInfo` LastTaskResult(0=정상)·LastRunTime 누락.
  - 리포트에 `[스케줄러 잡]` 섹션 + 심각이상 🚨 상단배너. 첫 통합리포트 실제 상태채널 전송 확인.
  - 튜닝: 데일리카드 28h→26h면 더 빨리 잡힘(config 한 줄). 블로그가 교체형(수량 유지)이면 sitemap 증감 대신 오늘날짜 글 URL 200 보조판정 추가 필요(현재는 일1건 추가 가정).
- **★색인 추이 라인 추가(2026-07-14, 서진)**: 헬스체크 디스코드 메시지에 `[색인 추이]` 섹션(`📑 색인: k-saju N→M(▲X) · blog N→M(▲X)`). 주1회만 재측정(구글 과폴링 방지), 나머지는 캐시. 상태=`index_state.json`, config=`indexTracking` 블록(대상 추가 `targets` 한 줄). ⚠️1단계 한계=keyless 실색인수 취득 3곳 다 막힘(Google JS필수·Bing캡차·DDG없음)→**sitemap URL수 근사**로 시작("sitemap근사" 태그 표시). 측정함수 `Get-SitemapLocCount`/`Measure-IndexCount`는 GSC 실색인 우선·없으면 sitemap 폴백=교체가능 구조. 파일 UTF-8 BOM 보존.
- **★GSC 검색 리포트 잡 활성화(2026-07-14, 지원)**: 별도 잡 `MoaSearchConsole`(매일 09:05 KST) — `search_console_report.mjs`가 GSC API로 k-saju.me·blog.k-saju.me 색인·노출·클릭·순위를 디스코드로 발송. 형이 서비스계정 연동 완료(`.moa\gsc_service_account.json`, client_email `moa-sc@moa-search-console.iam.gserviceaccount.com`, 두 속성 Restricted 권한). ⚠️핵심교훈=**PS5.1이 저장한 config는 UTF-8 BOM 때문에 mjs `JSON.parse`가 조용히 실패**(웹훅 미인식 원인이었음)→BOM제거 폴백 필수. 인스타 `sc-creator-profile:` 소셜속성=Search Analytics API 400 미지원→선제 스킵(실지표는 Meta Graph API 영역). 이 잡이 켜지면 위 `[색인 추이]`의 sitemap근사가 GSC 실색인으로 정밀화 가능(measure 함수 소스 교체). 상세 [[project_blog_ksaju]] 2026-07-14 항목.
- TODO: ①인스타 게시물 수는 IG API(Meta Graph) 연동 후 추가. 관련 [[project_n8n_viral_marketing]] [[project_blog_ksaju]] [[reference_daily_card_image_date_bug]].
