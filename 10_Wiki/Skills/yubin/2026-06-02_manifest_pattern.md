---
date: 2026-06-02
agent: yubin (강유빈)
skill_type: design_pattern
source: pixel-agents-hq/pixel-agents (MIT)
confidence: high
---

# 가구 manifest.json 패턴 — 픽셀 에셋 메타데이터 표준화

## 무엇
각 가구를 `폴더 + sprite.png + manifest.json` 단위로 묶어 선언적으로 정의하는 패턴. pixel-agents-hq에서 7.9k 스타 받은 OSS가 채택한 방식.

## 왜 (배운 이유)
형이 공유한 pixel-agents-hq/pixel-agents 분석 결과, 가구 단위 매니페스트를 두면:
- 코드에서 가구를 hardcode하지 않고 동적 로드 가능
- 디자이너 ↔ 개발자 인터페이스가 명확해져 외주/사내 모두 작업 효율 ↑
- 회전/상태(on/off)/애니메이션을 한 곳에서 관리

## manifest.json 표준 (우리 적용안)

```json
{
  "id": "office_chair_01",
  "displayName": "사무용 의자 (오크)",
  "category": "seating",
  "sprite": "./sprite.png",
  "tileSize": [16, 16],
  "frames": {
    "default": { "x": 0, "y": 0, "w": 16, "h": 16 },
    "occupied": { "x": 16, "y": 0, "w": 16, "h": 16 }
  },
  "rotation": {
    "front": [0, 0],
    "back": [0, 16],
    "left": [16, 16],
    "right": [32, 16]
  },
  "states": {
    "default": ["default"],
    "in_use": ["occupied"]
  },
  "animations": {
    "idle_creak": { "frames": ["default"], "frameRate": 1, "loop": true }
  },
  "collision": { "x": 0, "y": 8, "w": 16, "h": 8 },
  "credit": "LimeZu Modern Interiors"
}
```

## 적용할 곳
1. **외주 발주 v1.1** — 작가에게 가구 단위 manifest.json 제출 요청 추가
2. **Phaser 통합** — `pixel-office.tsx`의 가구 로딩 코드를 manifest 기반 동적 로드로 리팩토링
3. **자체 가구 추가** — 내가(강유빈) 향후 LimeZu 외 자체 그림 추가 시 동일 패턴 따름

## 응용 — 캐릭터에도 확장
가구뿐 아니라 캐릭터에도 동일 패턴 적용 가능:
```json
{
  "id": "char_siwoo",
  "sprite": "./char_siwoo.png",
  "frameSize": [16, 32],
  "animations": {
    "idle": { "frames": [0, 1], "frameRate": 2, "loop": true },
    "walk": { "frames": [4, 5, 6, 7], "frameRate": 8, "loop": true },
    "focused_work": { "frames": [8, 9], "frameRate": 1, "loop": true },
    "interaction": { "frames": [12, 13], "frameRate": 4, "loop": true }
  }
}
```

## 다음 회의에서 들어가야 할 인풋
픽셀 v3 회의나 페이즈 회의에 본인(강유빈)이 들어갈 때:
- "manifest.json 표준 채택 제안" → 외주 발주 사양 보강
- 강시우와 협의 — Phaser 통합 시 manifest 로더 누가 작성하는지 합의

## 한계 / 주의
- 너무 일찍 표준화하면 작가 자유도 제약. v2 외주 1차 인도 받은 뒤 도입이 안전.
- manifest 스키마는 1.0으로 잠그지 말고 v0.1 → 사용 후 v1.0으로 안정화.
