---
date: 2026-06-02
agent: siwoo (강시우)
skill_type: tech_pattern
source: pixel-agents-hq/pixel-agents (MIT)
confidence: high
---

# 픽셀 퍼펙트 + 휴리스틱 상태 머신 — Canvas/Phaser 적용 노트

## 무엇
pixel-agents-hq (7.9k ⭐)가 Canvas 2D로 구현한 두 가지 기법을 우리 Phaser 4 환경에 어떻게 적용할지 정리한 노트.

## 1) 픽셀 퍼펙트 정수 줌 (Pixel-Perfect Integer Zoom)

### 문제
LimeZu 16x16 픽셀 아트를 화면에 키워서 보여줄 때 비정수 스케일(1.5×, 2.7×)이 들어가면 픽셀 블러 발생.

### Canvas 2D 방식 (pixel-agents 채택)
```js
ctx.imageSmoothingEnabled = false;
const zoom = Math.floor(window.innerWidth / mapWidthPx);  // 정수만
ctx.scale(zoom, zoom);
```

### Phaser 4에서 동등한 설정
```ts
new Phaser.Game({
  pixelArt: true,            // smoothing off + nearest
  roundPixels: true,         // 정수 좌표 강제
  scale: {
    mode: Phaser.Scale.NONE,
    zoom: Math.floor(window.innerWidth / 480),  // 480 = 30 tiles × 16px
  },
});
```

### 우리 코드에 도입할 위치
`moa-studio/app/(main)/office/pixel-office.tsx` — 현재 카메라 zoom이 어떻게 잡혀있는지 점검 후 정수 강제로 교체.

## 2) 휴리스틱 상태 머신 (Heuristic Status FSM)

### pixel-agents 방식 (Claude Code JSONL 폴링)
- 입력: JSONL 트랜스크립트 파일을 짧은 주기로 폴링
- idle 타이머: 일정 시간 새 turn 없으면 → Idle
- 새 turn 등장 → Type/Read (휴리스틱으로 어느 쪽인지 추정)
- speech bubble: 사용자 입력 대기 신호 감지

### 약점 (저자 본인이 명시)
- 휴리스틱은 오진 발생
- 빠른 터미널 열기/닫기 시 desync

### 우리에게 주는 시사점 ⭐
**우리는 회의 엔진이 명시적 broadcast를 발사한다 — 휴리스틱 불필요.** 회의 엔진(meeting.py)이 발화/도구호출/완료를 명시 이벤트로 띄우고, Phaser 측은 그 이벤트를 받기만 하면 됨. → **우리 구조가 더 견고.**

### 우리 5단계 상태 (재확인)
| 상태 | emote | 트리거 (명시 이벤트) |
| --- | --- | --- |
| 대기 (Idle) | (없음) | 회의 시작 전 / 발화 차례 아님 |
| 생각 (Thinking) | 💭 | LLM 호출 진행 중 (start ↔ done 사이) |
| 작업 (Working) | ⚙️ | 도구 호출 (search / write_file) 진행 중 |
| 완료 (Done) | ✓ | turn 종료 + 산출물 1개 이상 생성 |
| 이슈 (Error) | ⚠️ | try/except에서 잡힌 예외 |

→ 휴리스틱 없음. **회의 엔진 트리거를 그대로 SSE/WebSocket으로 Phaser에 전달 = 끝.**

## 3) Sub-agent 시각화 (Task tool)
pixel-agents는 Task tool로 spawn된 sub-agent를 별도 캐릭터로 표시.
우리 회의에서도 facilitator가 panelist에게 질문 던지는 순간을 화살표/말풍선으로 시각화 가능 — **공간 자체에 '대화 흐름'이 보이는 것**. v3 회의 추가 안건 후보.

## 4) 음향 피드백
턴 완료 시 chime. Phaser `this.sound.play('chime')`로 즉시 도입 가능. 단, 형 작업환경 고려해 mute 기본값 권장.

## 도입 우선순위
1. ⭐⭐⭐ 픽셀 퍼펙트 정수 줌 — 외주 산출물 통합 직전 무조건 적용
2. ⭐⭐ 5단계 명시 이벤트 흐름 점검 — 회의 엔진 ↔ Phaser SSE 연결 검증
3. ⭐ Sub-agent 화살표 시각화 — v3 회의 안건
4. ⭐ Chime 음향 — 백로그

## 관련
- [[brain_pixel_agents_hq]] — 원본 brain inject
- [[feedback_no_mid_interrupt]] — 회의 중간 중단 금지 (관련 X, 참고)
