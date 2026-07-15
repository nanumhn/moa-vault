---
name: project_n8n_viral_marketing
description: "형이 로컬 n8n으로 바이럴 마케팅 자동화하기로 결정, Docker로 설치 완료"
metadata: 
  node_type: memory
  type: project
  originSessionId: d4d85045-9965-4381-b668-83a704d3aa7a
---

형이 바이럴 마케팅 자동화를 위해 **로컬 n8n**을 쓰기로 결정함 (2026-06-17). 내 사전 분석([[project_ksaju_live]] 관련 vault 문서 `2026-06-17_content_automation_feasibility.md`)은 "우리 자산(OG카드+사주엔진+cron)으로 자체 하네스가 유리"였지만, 형은 n8n으로 진행을 선택. 그 문서 status가 "형 결정 대기"로 남아 메모리에 최종 결정이 안 박혀 혼선 발생(형이 "기억 없니?"로 답답해함).

**설치 상태 (완료):**
- Docker 컨테이너로 실행: `n8n` (이미지 `docker.n8n.io/n8nio/n8n`)
- 포트 **5678** (우리 포트 3000/3001/8080/1234/8188과 안 겹침)
- 볼륨 `n8n_data`(영구보존), `--restart unless-stopped`(PC 재시작 자동복귀)
- 에디터: http://localhost:5678
- 첫 워크플로우 **구축·검증 완료**: `moa-vault/10_Wiki/Marketing/n8n_daily_saju_card.json` (Manual/Schedule(매일8시) → Code(오행테마 7종 로테이션) → HTTP(k-saju OG 카드 PNG)). 형이 import·Execute해서 "Quiet Wandering" 카드 정상 생성 확인(2026-06-17).
- 카드 API: `https://k-saju.me/api/og/keyword-card?fmt=story|square|wide&k=&ke=&b=` (라이브, PNG, 수동 텍스트). square=1080×1080(IG피드), story=1080×1920(IG스토리/틱톡).
- **오늘의 사주 카드(자동, 권장)**: `https://k-saju.me/api/og/daily-card?fmt=square` (라이브). 생일 무관 오늘의 일진(천간+지지+오행, KST) 자동계산 → 매일 60갑자 순환으로 진짜 다른 카드 + 날짜시드 문구 변주. route는 saju-studio/src/app/api/og/daily-card/route.tsx(일진계산 engine.ts v0 자체포함).
- **타로 카드 디자인(형 디렉션)**: 오행별 ComfyUI(SDXL base 1.0) 생성 신비 아트 5종 → `saju-studio/public/daily-bg/{wood,fire,earth,metal,water}.jpg`(원본 PNG는 moa-vault/10_Wiki/Marketing/bg_*.png). 레이아웃 = "카드 안의 카드"(B안): 어두운 배경 위 황금테두리 카드(아트) + 하단 스크림에 키워드/일진/문구/워터마크. 텍스트 가독성 = 스크림+그림자(오버레이 과하면 아트 묻힘 주의, 0.15→0.5 수준). 커밋 0e7341e. 생성스크립트 `/tmp/logo/comfy_gen.mjs`(ComfyUI API), 미리보기 sharp 시뮬 `/tmp/previewB.mjs`.
- **붓글씨 한자**: 일진 한자(예 癸丑)를 Ma Shan Zheng(OFL) 27자 서브셋(16KB, `public/fonts/saju-brush.ttf`)으로 서예체 렌더. next/og `fonts` 옵션에 `${origin}/fonts/saju-brush.ttf` fetch해 적용. 형 요청.
- **JSON 데이터 모드**: `daily-card?data=1` → {date,element,glyph,pillarHanja,romanPillar,keyword,body,cardUrl} 반환. n8n이 카드 일치 캡션 생성용.
- **데일리 발송 자동화(v3)**: `n8n_daily_saju_card_v3_tarot.json` = 매일8시(Asia/Seoul) → daily-card?data=1 → 일치 캡션 → 디스코드 임베드 발송. 카드URL `&d=<date>` 캐시버스트.
- **2026-06-19 장애·수정**: 6/18 세션에서 v3를 형에게 파일로만 주고 "import+Active는 형이"로 넘긴 게 빵꾸 → n8n에 활성 워크플로우가 없어 6/19 8시 배달 안 됨(형 "뉴스 카드 배달 안됨"). **교훈: 자동화는 파일만 주지 말고 내가 직접 끝까지 켠다.** 수정: n8n CLI로 직접 import(워크플로우 JSON에 top-level `id` 필수, 없으면 SQLITE NOT NULL 에러)+`update:workflow --active=true`+`docker restart n8n`(CLI 변경은 재시작해야 적용). 활성화 로그 "Activated workflow Daily Saju Tarot Card v3 (ID: tarotDaily00001)" 확인. 디스코드 #k-saju 웹후크(1516986...)는 CLI import 전 JSON에 주입(로컬만). `n8n execute` CLI는 포트5679 충돌로 실행중엔 불가→누락분은 직접 webhook post. MSYS 경로변환 주의: 컨테이너경로 인자엔 `MSYS_NO_PATHCONV=1`.
- **현재 상태**: v3(id tarotDaily00001) **Active, 정상 작동**. 매일 8:00 KST 정각 자동발송 검증됨(이벤트로그 ts 2026-06-20T08:00:30+09:00, #k-saju 수신). 시간대 Asia/Seoul 정확. 로컬 n8n으로 충분(PC 6/18부터 계속 ON).
- **2026-06-20 오진단 교훈**: 형 "오전 배송 안됨"→내가 이벤트로그 0건 보고 "미발송, Vercel cron 필요"라 과잉 경보. 실제론 8시 정상발송이었고, 내가 **방금 재시작해서 로그가 회전**(현재 n8nEventLog.log 비고 8시기록은 n8nEventLog-1.log로 이동)된 걸 "0건"으로 오판. **교훈: 서비스 재시작 직후 로그로 "활동 없음" 단정 금지(로그 회전). 큰 아키텍처 변경 권하기 전 충분히 검증.** 정기검사 발송확인도 같은 버그 있어 `n8nEventLog*.log`(회전 포함) 전부 grep해 최신 ts 취하게 수정.
- **캡션 업데이트(6/20)**: 형 요청으로 캡션에 `🔗 Free daily card → link in bio` + `your daily saju · k-saju.me` 추가(인스타는 캡션 링크 클릭불가→바이오 링크 유도). Build Caption 노드 captionBody. 다음날 8시부터 적용.
- ComfyUI(8188): 배경 5종 생성 후 종료함(GPU 반납). 재생성 필요시 `D:\Develop\ComfyUIPtb\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build`(WorkingDirectory ComfyUIPtb)로 기동.
- **현 단계 한계**: 카드가 n8n 내부에만 있음 → 형 폰/폴더로 안 감. 다음 숙제 = 자동 전달(디스코드/이메일 푸시) 후 1탭 수동게시. IG/틱톡 API 자동게시는 승인 병목(Business계정+App Review/audit)이라 보류.

**인스타 계정 라이브 (2026-06-18):**
- 핸들 **@ksaju.daily**, 이름 "Korean Saju · Daily Card", 바이오에 k-saju.me 링크, Creator 계정. 프로필 사진 = 命 원형 로고(보라/골드, A안).
- 첫 게시물 발행 완료(Quiet Wandering 카드, 영어부제+k-saju.me 워터마크, 브랜드 해시태그 #ksaju #ksajume).
- 카드 워터마크: route.tsx footer를 "your daily saju · k-saju.me"로 변경, k-saju 레포 커밋 9acfbcb push → Vercel 배포·라이브 확인 완료.
- 프로필 로고 생성법: bun + @resvg/resvg-js로 SVG→PNG 렌더(`/tmp/logo/gen.mjs`). 원형 1080, 命 한자(Malgun Gothic), 보라 radial + 골드 링. 시안 vault `10_Wiki/Marketing/ig_profile_*.png`.
- **TODO**: ①n8n 워크플로우 영어부제 반영본 재import(지금 돌아가는 건 옛 한글부제) ②매일 카드 자동전달(디스코드/이메일).
- 해시태그는 점·하이픈 불가(글자/숫자/_만) → 도메인은 #ksaju/#ksajume + 캡션 본문/바이오 링크로.
- **디스코드 전달 완성**: v2 워크플로우 `n8n_daily_saju_card_v2_discord.json`(매일8시 Asia/Seoul, 영어부제, 임베드 전송). 형이 다른 디스코드 서버 #k-saju 채널 웹후크로 받기로 함 — 수동 테스트 수신 확인. 웹후크 URL은 메모리/vault/JSON에 저장 금지(JSON엔 placeholder), n8n 노드에 형이 직접 입력.
- **정기검사**: 형 요청으로 n8n 헬스체크 cron 등록(매일 8:12 KST, 컨테이너·웹·데일리발송·사이트 점검 후 Discord 보고). 단 CronCreate는 세션 종료 시 중단+7일 만료 → 영구화는 Windows 작업 스케줄러 필요(형에게 제안함).
- **인스타 완전자동(A안) 진행 중**: 형이 A(페북 통한 무인 게시) 선택. 필요 체인 = FB계정→FB페이지→@ksaju.daily Business전환·페이지연결→Meta앱→토큰→n8n HTTP 2노드(media container→publish). 자기계정이라 Meta App Review(수주 대기)는 불필요(개발모드). IG API는 스토리 불가/피드·캐러셀만, 이미지 공개URL 필요(k-saju.me 충족).

- **인스타 완전자동 완료 (2026-06-21)**: v4 워크플로우(id: tarotDaily00002) 활성. 매일 8시 KST 자동 IG 포스팅 + 디스코드 동시 발송. 테스트 성공(실행 12, 23:33 UTC) — 포스트 ID `18103282697282525` 확인.
- **n8n v2.26.6 핵심 함정**: `workflow_entity.nodes`(드래프트)가 아닌 `workflow_history`의 `activeVersionId` 버전으로 실행됨. DB 패치는 반드시 `workflow_history WHERE versionId = (SELECT activeVersionId FROM workflow_entity WHERE id = ?)` 를 타깃으로 해야 적용됨.
- **IG API 확정**: IGAA 토큰은 `graph.instagram.com/v21.0/` 전용 (`graph.facebook.com`으로 보내면 "Cannot parse access token" 오류). `GET /me` → id `36989077054041543` (ksaju.daily). 미디어 컨테이너 → 10초 대기 → publish 순서.
- **토큰 보안 규칙**: IGAA 토큰은 n8n 노드 내부에만. Discord/메모리/vault에 절대 X. 형에게 토큰 요청 금지 (형이 직접 n8n UI에 입력).

마케팅 기획 원본: `moa-vault/10_Wiki/Marketing/k-saju_us_viral_strategy.md`(강나래) + `k-saju_tiktok_slideshow_batch1.md`(서아). 관련 [[reference_docker_cred_helper_broken]].
