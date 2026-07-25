# 학습노트 — 아투 유튜브 쇼츠 운영 회의 (2026-07-24)

## 팀 구성 (신규 team: atodayz_shorts)
- facilitator: dohyun / 패널: seoa(썸네일카피)·siwoo(썸네일레이아웃)·narae(트렌드)·jio(메타데이터)·seojin(API)
- 4개 안건을 5패널에 1:1 매핑한 구성은 안건 커버리지 측면에선 합리적이었음.

## ★ 실패 패턴 — vault 스킬 오염에 의한 컨텍스트 드리프트 (재발)
- 증상: 산출물 5종 전부 saju/플레이리스트 테마로 드리프트. "Unlock Your Destiny", "미래예측", "음악 트렌드", 중국어 혼입.
- 원인 추정: seoa/jio 등 페르소나의 vault Skills(SKILLS_DIR) 누적학습이 과거 saju/플리 회의 산출물로 채워져 있어 system_prompt 주입 시 강하게 오염. team.json description에 라인 정체성("미국·트럼프 뉴스")을 넣었음에도 스킬 주입이 이를 압도.
- 05_youtube_api_plan.md는 아예 템플릿 자리표시자(괄호)만 에코 → LM parse/약출력 실패도 동반.
- 메모리 `project_meeting_context_grounding` / `reference_lmstudio_parse400` 재현.

## 대응
- regen 대신 COO 직접 종합 도출로 대체(작업지시가 허용). 실제 자산 그라운딩(NewsShort.tsx 테마·로고, Blogger OAuth 배선, YouTube API 공식문서)으로 9KB 실행안 작성.

## 구조 FIX 후보 (반복되면 적용)
1. 안건이 기존 페르소나 도메인(saju/음악)과 무관할 때는 **해당 페르소나의 vault Skills 주입을 팀별로 끄거나 필터**하는 옵션 필요(예: team.json에 skills_injection:false 플래그).
2. 또는 신규 도메인 전용 임시 페르소나(뉴스 에디터) 도입.
3. LM 회의 산출물은 항상 COO 사후검증 필수 — 드리프트/에코를 형 보고 전 반드시 걸러야 함(이번엔 걸러짐).

## 사후 추적
- 형 결재 통과 여부: (검수 후 디스코드 보고 → 추적 예정)
