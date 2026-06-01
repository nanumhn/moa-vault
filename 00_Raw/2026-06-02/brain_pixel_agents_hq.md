---
date: 2026-06-02
type: brain_inject
kind: github_repo
source_url: https://github.com/pixel-agents-hq/pixel-agents
title: Pixel Agents — Claude Code 전용 픽셀 오피스 VS Code 확장
license: MIT
stars: 7900
status: active (v1.3.0, 2026-04)
absorbed_by: 형 → 클로 → vault
---

# Pixel Agents (pixel-agents-hq/pixel-agents) 흡수 노트

## 한 줄
> "The game interface where AI agents build real things."
> 멀티 에이전트 AI 시스템을 픽셀 아트 오피스로 시각화하는 **VS Code 확장**. Claude Code 터미널 각각이 캐릭터로 나타나 코딩·파일읽기·명령실행을 실시간 애니메이션으로 보여줌.

## 우리 프로젝트와의 직접 비교 (가장 중요)

| 축 | 우리 (Moa Studio) | Pixel Agents |
| --- | --- | --- |
| 배포 형태 | Next.js 웹앱 | **VS Code 확장 (Marketplace + Open VSX)** |
| 렌더러 | **Phaser 4** | **Canvas 2D** (픽셀 퍼펙트 정수 줌) |
| 캐릭터 ↔ AI 매핑 | 13명 페르소나 ↔ 회의 발화 | **Claude Code 터미널 1:1 ↔ JSONL 폴링** |
| 상태 감지 | 회의 단계 명시적 broadcast | **휴리스틱 (idle 타이머 + JSONL 턴 지속시간)** |
| 상태 종류 | 💭/⚙️/✓/⚠️ (5단계) | Idle / Walk / Type / Read / Speech bubble |
| 픽셀 에셋 | **LimeZu Modern Interiors** ($3 구매) | **JIK-A-4 Metro City** (오픈소스 동봉) |
| 에이전트 정의 | YAML 페르소나 (예: yubin.yaml) | 별도 정의 X, Claude Code 터미널이 곧 에이전트 |
| 맵/오피스 | Tiled 외주 발주 예정 | **내장 그리드 에디터 (최대 64×64, 50-step Undo/Redo)** |
| 가구 메타 | 외주 명세서 안에 산문 | **각 가구 폴더당 `manifest.json`** (sprite, rotation group, state group, anim frames) |
| 라이선스 | 우리 코드 사적 / LimeZu 라이선스 표기 | **MIT** |
| 스타 | — | **7.9k ⭐ / 1.2k fork** |

## 핵심 인사이트 (우리에게 학습 가치 있는 것)

### 1) manifest.json 패턴 — **가구 메타데이터 표준화** ⭐⭐⭐
각 가구가 폴더 하나 + manifest.json. sprite 경로, 회전 그룹, 상태 그룹(on/off), 애니메이션 프레임을 선언적으로 기술. **우리 외주 발주 패키지에도 즉시 도입 가능한 패턴**. Phaser 통합 시 가구 한 종류씩 코드에 hardcode하는 대신 manifest를 읽어 동적 로드 가능.

### 2) 휴리스틱 상태 감지 — JSONL 폴링 방식
저자 본인이 "휴리스틱 기반 / 오진 가능"임을 인정. 우리는 회의 엔진이 명시적 broadcast하므로 이 약점이 없음. **우리 강점**.

### 3) "Agent-agnostic" vs "Claude Code 전용"
저자는 미래 로드맵으로만 "agent-agnostic"을 언급. 현재는 Claude Code 전용. **반대로 우리는 처음부터 페르소나 + 회의 엔진 구조라 LLM 백엔드 swap이 자유로움**. (LM Studio gemma-4-e4b → OpenAI/Anthropic 교체 시 페르소나·회의 구조 그대로 사용.)

### 4) 내장 그리드 에디터 (64×64, 50-step Undo/Redo)
우리는 외주 작가에게 Tiled로 받음 (작가-친화적). pixel-agents는 사용자가 직접 편집 (사용자-친화적). **두 방향 모두 정당하나, 우리 자율 OS 컨셉에는 외주/디자이너 채널이 맞음.** 향후 강유빈이 직접 편집할 수 있는 in-app 에디터는 백로그(Phase) 후보로 적합.

### 5) Sub-agent 시각화
Task tool에서 spawn된 sub-agent도 캐릭터로 표현. **우리 회의 facilitator/panelist 관계와 유사한 구조** — 회의 안에서 한 직원이 다른 직원에게 요청할 때 시각적 분기 표시 아이디어로 차용 가능.

### 6) 음향 피드백
턴 완료 시 chime (선택). 우리 5단계 emote에 사운드 한 줄 추가로 동급 효과 가능. 작은 디테일이지만 "살아있다"는 느낌 ↑.

## 즉시 차용 가능한 액션

1. **외주 발주 패키지 v1.1** — `05_dev_integration/integration_spec.md`에 **가구 manifest.json 권고** 항목 추가. 작가가 제출 시 가구 단위로 PNG + manifest.json 묶음으로 받기.
2. **강유빈 skill 학습** — manifest 패턴 익혀서 향후 자체 가구 추가 시 표준 절차 보유.
3. **강시우 skill 학습** — Canvas 2D 정수 줌 픽셀 퍼펙트 기법. Phaser에서도 `roundPixels: true` + 카메라 줌 정수 강제 동일 효과.
4. **벤치마크 기록** — 7.9k ⭐는 시장 검증. 우리 픽셀 오피스도 외주 인도 후 OSS 부분 공개(맵/캐릭터 시드만) → 인지도 확보 카드 고려.

## 차용 안 할 것
- **Claude Code 전용 모델** — 우리는 회의 엔진/자율 OS가 핵심이라 Claude Code 종속은 반대 방향.
- **JIK-A-4 Metro City 에셋** — 우리는 LimeZu 비용 이미 지출 + 무드(아련함/dusk glow)와 결이 다름. 무드보드만 참고.
- **VS Code 확장 배포** — 우리 사용자는 형 + 향후 외부 사용자. IDE 확장 아닌 웹앱이 맞음.

## 자율 OS 비전과의 관계
pixel-agents는 **"개발자가 Claude Code로 일하는 모습을 게임화"**. 우리는 **"AI 직원들이 자율로 회사를 운영"**. 둘은 다른 층위 — pixel-agents는 도구 UX, 우리는 조직 시뮬레이션. **두 컨셉이 충돌하지 않고 보완**. 우리가 내부 직원 개발 보조 도구로 pixel-agents를 동시 사용하는 그림도 가능 (강시우/박진형 같은 개발 페르소나가 Claude Code를 돌릴 때 우리 자체 UI 위에 pixel-agents 추가).

## 관련 메모
- [[reference_agent_town]] — 트렌드 레퍼런스 (단순 ChatGPT town)
- [[2026-06-02_픽셀_오피스_1차_피드백_재설계_지시]] — 1차 거절
- [[2026-06-02_픽셀_오피스_외주_발주_패키지화_완료]] — 외주 발주 패키지
- [[project_autonomous_org_vision]] — 자율 OS 장기 방향
