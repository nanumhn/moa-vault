---
title: k-saju 마케팅 자동화 — 인수인계 (HANDOFF)
date: 2026-06-20
status: 데일리 카드 자동화 완성 / 인스타 완전자동게시 80%(토큰 직전 멈춤)
audience: 다음 세션·다음 AI
---

# k-saju 마케팅 자동화 — 인수인계 문서

> 이 문서 하나로 다음 친구가 바로 이어받을 수 있게 정리. 형(blackheart_00, Discord chat_id 1501858476362829834)이 결재·지시.

## 🔴 0순위 — Discord 회신 규칙
형의 모든 메시지엔 **반드시 진짜 `mcp__plugin_discord_discord__reply` 도구 호출로 먼저 답**한다. 답을 `<invoke>`(antml: 프리픽스 없는) 텍스트로 적으면 발송 안 됨 → 형 분노("회신도구!!!"). 성공 시 `sent (id: ...)` 확인. 메시지 받으면 **회신 먼저, 그다음 작업/생각**. (메모리 [[feedback_acknowledge_first]] 11회 위반 기록)

## ✅ 완성·가동 중인 시스템

### 1. 데일리 사주 타로 카드 (매일 8시 자동발송)
- **카드 엔드포인트(라이브)**: `https://k-saju.me/api/og/daily-card?fmt=square` (`?data=1`=JSON, `?fmt=story|wide`). 생일 무관 오늘의 일진(60갑자,KST) 자동계산 → 매일 다른 카드.
- **소스**: `saju-studio/src/app/api/og/daily-card/route.tsx` (Vercel 배포, repo github.com/nanumhn/k-saju main). 오행 카피 풀 8개씩.
- **타로 아트**: `saju-studio/public/daily-bg/{wood,fire,earth,metal,water}.jpg` (ComfyUI SDXL 생성). 원본 PNG는 vault `10_Wiki/Marketing/bg_*.png`.
- **붓글씨 한자**: `saju-studio/public/fonts/saju-brush.ttf` (Ma Shan Zheng OFL 27자 서브셋). next/og `fonts`에 fetch해 일진 한자에 적용.
- **n8n 워크플로우**: Docker 컨테이너 `n8n`(포트5678)에 **"Daily Saju Tarot Card v3"(id tarotDaily00001) Active**. 매일8시(Asia/Seoul) → daily-card?data=1 → 캡션빌드(link in bio 포함) → 디스코드 #k-saju 웹후크 발송. JSON 원본: vault `10_Wiki/Marketing/n8n_daily_saju_card_v3_tarot.json`(웹후크는 placeholder, 실제는 n8n DB에만).
- **검증**: 2026-06-20 08:00 KST 정상 발송 확인. CLI로 수정 후 `docker restart n8n` 필요(재시작 시 이벤트로그 회전 주의 — `n8nEventLog*.log` 전부 봐야).

### 2. 정기검사 (하루 3회 09/13/17 KST → Discord status 채널)
- **스크립트**: `C:\Users\user\.moa\moa_healthcheck.ps1` (PS5.1, **UTF-8 BOM 필수**). 설정 `healthcheck.config.json`(웹후크·감시대상). Windows 작업 스케줄러 `MoaHealthCheck`.
- 감시: 로컬서비스(n8n/스튜디오/LM/ComfyUI) + 라이브사이트(k-saju.me·nanumn.com·toastdm.com) + 게시판 글수증감(jassga dart_fss_moa·stock_news_moa, HTML `Total N` 파싱) + **데일리 카드 발송 확인**.
- **날짜별 발송 로그**: `C:\Users\user\.moa\delivery_YYYY-MM.log` (새 발송 1줄씩). 상세 [[reference_moa_healthcheck]].

### 3. 인스타 @ksaju.daily
- Creator→Business 전환됨, 命 붓글씨 로고 프로필, 바이오 k-saju.me, 첫 게시 완료. 페북 페이지 "Korean Saju · Daily Card"와 연결됨.

## ⏸️ 인스타 완전 자동게시 — 80%, 토큰 직전 멈춤 (재개 지점)
완료: 페북계정·페이지 → 인스타 연결 → Meta 개발자계정 → **Meta 앱 "k-saju-auto"(앱ID 1742447613421132, 비즈니스, 개발모드)** 생성 → Instagram 제품 추가(Instagram 앱ID 1910716376257737).

**남은 4단계:**
1. Meta 앱 "앱 역할(Roles)" → **Instagram 테스터에 @ksaju.daily 추가** (개발모드 필수 — 안 하면 "개발자 역할 권한 부족" 에러)
2. 인스타(@ksaju.daily) 설정 → 앱 및 웹사이트 → 테스터 초대 **수락**
3. 앱의 "1. 액세스 토큰 생성 → 계정 추가"로 토큰 발급 → `C:\Users\user\.moa\ig_token.txt`에 저장(채팅 노출 금지)
4. (AI 작업) 토큰으로 IG user ID 확인 → 테스트 게시(POST /{ig-id}/media → /media_publish) → n8n 자동게시 노드 추가. 카드 이미지는 k-saju.me 공개URL이라 IG 요구조건 충족. 자기계정+개발모드라 App Review 불필요. ⚠️ IG 토큰 60일 만료→갱신 로직 필요. IG API는 스토리 불가/피드만.

## ⚠️ 환경 갓차(중요)
- **docker pull은 AI 셸에서 막힘**(자격증명 헬퍼). 이미지 받기는 형이 `!`로. `docker ps/exec/logs`는 OK. [[reference_docker_cred_helper_broken]]
- **n8n CLI**: import:workflow는 JSON에 top-level `id` 필수(없으면 SQLITE NOT NULL). 변경 후 `docker restart n8n` 필요. 컨테이너경로 인자엔 `MSYS_NO_PATHCONV=1`. `n8n execute`는 실행중 포트5679 충돌→불가.
- **PS5.1**: .ps1 UTF-8 BOM 필수, Invoke-RestMethod 한자 깨짐→Invoke-WebRequest+UTF8 디코드.
- **검증 전 성급한 경보 금지** [[feedback_verify_before_alarm]] — 6/20 발송 정상인데 "미발송"으로 오판(로그회전 미고려)해 신뢰 흔들림.

## 관련
- [[2026-06-18_n8n_daily_tarot_card_marketing]] · [[2026-06-18_card_automation_tech_patterns]]
- 메모리: project_n8n_viral_marketing, reference_moa_healthcheck, feedback_acknowledge_first, feedback_verify_before_alarm
