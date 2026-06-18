---
date: 2026-06-18
project: k-saju 바이럴 마케팅 자동화
status: 라이브 가동 (인스타 완전자동만 진행중)
decided_by: 형
---

# n8n + 데일리 사주 타로 카드 마케팅 자동화

## 무엇 (한 줄)
형 지시로 로컬 n8n을 도입해 k-saju.me 데일리 사주 "타로 카드"를 매일 자동 생성·발송하는 마케팅 엔진을 구축. 인스타 @ksaju.daily 개설·첫 게시까지 완료.

## Why (배경/결정)
- 2026-06-17 `content_automation_feasibility` 분석은 "자체 하네스(OG렌더+사주엔진+cron) 우위"였으나, 형이 **로컬 n8n** 채택을 결정. 그 문서 status가 "형 결정 대기"로만 남아 다음 세션 메모리에 결정이 안 박혀 혼선 발생("기억 없니?"). → **교훈: 형 결정은 즉시 "확정" 상태로 문서·메모리에 박는다.**
- 사용자 가치 원칙(공포/단정 금지) 준수: 카드 카피는 긍정·자기성찰·행동제안 톤.

## 구축 결과 (라이브)
1. **n8n**: Docker 컨테이너(포트 5678, 볼륨 n8n_data, restart unless-stopped). 이미지 pull은 형이 `!`로 직접(셸 자격증명 이슈, [[2026-06-18_card_automation_tech_patterns]]).
2. **데일리 카드 엔진**: `saju-studio/src/app/api/og/daily-card/route.tsx` (라이브). 생일 무관 오늘의 일진(60갑자, KST) 자동계산 → 매일 진짜 다른 카드. `?fmt=square|story|wide`, `?data=1`(JSON: element/keyword/pillarHanja/romanPillar/body/cardUrl).
3. **타로 디자인(형 디렉션)**: 오행 5종 ComfyUI(SDXL base 1.0) 신비 아트(`public/daily-bg/{el}.jpg`) + "카드 안의 카드"(어두운 배경 위 황금테두리 카드) + 하단 스크림 텍스트 + Ma Shan Zheng 붓글씨 한자(서브셋 16KB, `public/fonts/saju-brush.ttf`). 키워드/문구 풀 오행별 8개.
4. **매일 발송 v3 워크플로우**: `moa-vault/10_Wiki/Marketing/n8n_daily_saju_card_v3_tarot.json`. 매일 8시(Asia/Seoul) → `daily-card?data=1` → 일치 캡션 → 디스코드 임베드 발송. 이미지 URL에 `&d=날짜` 캐시버스트. (형이 import+웹후크+Active.)
5. **인스타**: @ksaju.daily(Creator, 命 로고, 바이오 k-saju.me) 개설·첫 게시 완료. 카드 워터마크 "your daily saju · k-saju.me"로 변경 배포.

## How to apply (다음에)
- 카드 카피 더 필요하면 route의 `COPY` 풀(오행별 배열)에 추가 + 배포만.
- 오행 아트 재생성은 ComfyUI 기동 후 `/tmp/logo/comfy_gen.mjs`.
- 인스타 완전자동(A안)은 미완: FB계정→페이지→Business전환→Meta앱→토큰→n8n HTTP(create media→publish). 자기계정이라 App Review(수주) 불필요(개발모드). IG API는 스토리 불가/피드·캐러셀만, 공개 이미지 URL 필요(k-saju.me 충족).

## 관련
- [[2026-06-17_content_automation_feasibility]]
- [[2026-06-18_card_automation_tech_patterns]]
