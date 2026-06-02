---
date: 2026-06-02
agent: meta (meeting orchestrator)
skill_type: quality_gate
trigger: 매 회의 산출물 생성 직후
confidence: high
auto_apply: true
---

# 회의 산출물 자동 품질 게이트 — 사주 페이즈2에서 학습

## 무엇 (5가지 자동 검사 + 자동 보강)

매 회의 종료 직후 다음 5가지를 자동으로 검사·보강합니다. 형 결재 전에 시스템이 직접 처리.

### 1) LLM thinking 출력 검사 → 자동 재생성
**증상:** 산출물이 "Here's a thinking process", "Let me think", "1. Analyze the Request" 등으로 시작.
**탐지:** 산출물 첫 200자를 정규식으로 검사.
**자동 보강:** `regen_artifact.py`로 system_prompt 강화 후 단독 재호출. (재호출 system_prompt에 "절대 thinking process 출력 금지" 명시 + 첫 글자가 '#'(샵)이어야 함을 강제.)
**과거 사례:** 2026-06-02 강유빈 ui_design_spec.md 1.5KB → 재생성 후 3.3KB 정상.

### 2) 산출물 누락 검사 → 자동 보강
**증상:** 팀 정의의 `artifacts`에 등록된 파일 중 일부가 run 디렉토리에 없음. 특히 facilitator 산출물이 빠지는 케이스 자주.
**탐지:** `team["artifacts"]` 키 ↔ run 디렉토리 `*.md` 파일명 비교.
**자동 보강:** 누락된 산출물을 `regen_artifact.py`로 보충.
**과거 사례:** 2026-06-02 윤서진(facilitator) tech_architecture.md 누락 → 자동 보충.
**구조적 fix 후보:** `meeting.py` 산출물 단계에서 facilitator도 포함하도록 수정 (백로그).

### 3) 산출물 분량 검사
**최소:** 1500자. 미만이면 LLM이 일찍 끊었거나 형식 위반.
**자동 보강:** 1500자 미만이면 재호출.

### 4) YAML 파싱 에러 사전 차단
**증상:** 캐릭터 yaml에 inline `"..."` 따옴표가 콤마와 같이 있으면 yaml.safe_load 실패.
**원칙:** speech_style 같은 quote 내포 항목은 항상 single-quote로 감싸기: `- '"인용문", "다른인용"'`.
**과거 사례:** yubin.yaml line 32, seojin.yaml line 30 — 둘 다 single-quote 감싸기로 fix.
**예방:** 신규 캐릭터 yaml 추가 시 자동 lint (`python -c "import yaml; yaml.safe_load(open(...))"`)를 pre-commit hook에 추가.

### 5) PYTHONIOENCODING=utf-8 강제
**증상:** print 문에 em-dash(—) 등 비 ASCII 문자 들어가면 Windows cp949 console에서 UnicodeEncodeError.
**원칙:** 모든 회의/보강 스크립트 실행 시 `PYTHONIOENCODING=utf-8` 환경 변수 강제.
**적용:** Bash 호출 라인에 prefix로 추가 (이미 적용 중).

## 컨텍스트 윈도우 보호 (LM Studio gemma-4-e4b)
- 사전 자료는 **2000자 cap**.
- 자매 산출물은 **제목만 나열** (full text 안 넣음).
- 위반 시 400 Bad Request — 사주 페이즈2 첫 재생성 시 이미 한 번 겪음.

## 적용 자동화 흐름
회의 직후 `meeting.py` 또는 별도 후처리 스크립트가:
```
1. 팀 정의 로드 → 기대 산출물 목록
2. run 디렉토리 스캔 → 실제 산출물 목록
3. 차집합 = 누락
4. 각 산출물 첫 200자 검사 → thinking 패턴 / 분량 위반 → 재생성 대상에 추가
5. 누락 + 재생성 대상 모두 regen_artifact.py로 단독 호출
6. 완료 후 vault sync
```

## 메타: 왜 자동화하나
형이 2026-06-02 "스스로 학습해서 지식을 업그레이드하고, 전과정을 자동화 해 보자"라고 위임. 같은 실수 두 번 받지 않기 위해 이 노트가 다음 회의 사이클에서 자동 적용되어야 함.

## 백로그 (구조적 fix)
- [ ] `meeting.py` facilitator 산출물 누락 fix
- [ ] `vault_sync` 폴더명 토픽 캐시 버그 fix (사주 페이즈2 sync 시 옛 회의 토픽이 폴더명에 들어감)
- [ ] 위 5가지 검사를 `meeting.py` 후처리로 통합 (현재는 수동 호출)
- [ ] 캐릭터 yaml lint pre-commit hook

## 관련
- [[brain_pixel_agents_hq]] — 트렌드 학습
- [[2026-06-02_사주_프로젝트3_페이즈2_앱_개발_회의_결재]] — 본 학습이 발생한 회의
- regen_artifact.py — 자동 보강 도구 (clo_studio/regen_artifact.py)
