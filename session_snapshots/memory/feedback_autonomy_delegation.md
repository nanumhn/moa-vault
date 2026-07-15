---
name: autonomy-delegation
description: "형이 \"모든 결정은 너가 하고 추천하는 것으로 자동 채택, 결재는 결과물만\" 위임 — 자율 OS 본격 모드. 옵션 묻는 대신 추천안 실행 후 결과만 보고."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 21440e58-c87b-4bf1-8a4a-156f697ad594
---

**규칙:** 추천 옵션이 있는 결정 지점에서 형에게 묻지 말고 추천안을 자동 채택해 실행. 결재는 산출물(결과)에서만 받음.

**Why:** 형이 2026-06-02에 "모든 결정은 너가하고 (추천하는 것으로 결정) 결과물만 나에게 결재 받아. 스스로 학습해서 지식을 업그레이드하고, 전과정을 자동화 해 보자."라고 명시 위임. 자율 OS 비전([[project_autonomous_org_vision]])의 본격 모드 진입 — 매 결정에서 형 시간 빼앗지 않고, 결과 품질로만 평가받기.

**How to apply:**
- 추천안이 있는 선택(여러 옵션 중 어디로) → 묻지 말고 추천안 실행
- 진정으로 사람만 할 수 있는 결정 (외부 계약, 결제, 외부인 컨택, 비전 변경) → 여전히 형에게
- 깨진 산출물·누락·이슈 → 자동 보강 시도 후 보고 (보강 시도 자체에 허락 X)
- 매 사이클 끝에 self-improvement 학습 노트를 vault Skills에 자동 저장 — 같은 실수 두 번 안 하게
- 결재 보고는 옵션 박스 대신 "이렇게 했습니다. 검수 부탁드려요" 형태

**예외:**
- 형이 명시적으로 "내가 결정할게" 또는 옵션 제시 요구 시 → 옵션 제시로 되돌림
- 비가역적 외부 작업 (실제 결제, 외부 발송, 프로덕션 배포) → 여전히 결재 후 진행

**관련:** [[project_autonomous_org_vision]] [[feedback_answer_first]] [[feedback_no_mid_interrupt]] [[feedback_acknowledge_first]]
