---
name: reference_lmstudio_parse400
description: "LM Studio qwen returns HTTP 400 \"Failed to parse input at pos 0\" on some artifact generations even though the model output is fine — tooling bug, workaround inside"
metadata: 
  node_type: memory
  type: reference
  originSessionId: ee8b467e-df9e-45b7-958b-13a0479d9823
---

LM Studio(qwen2.5-7b-instruct)가 일부 산출물 생성에서 **HTTP 400 "Failed to parse input at pos 0"**를 반환한다. 핵심: **모델은 정상 생성**한다 — 400 에러 본문 안에 완성된 마크다운 문서가 들어있다. 즉 LM Studio가 모델 *출력*을 파싱하는 단계에서 실패하는 LM Studio 내부 버그(컨텍스트 초과 아님, 프롬프트 문제 아님).

**증거 (2026-06-13):** marketing_saju 회의에서 이서아(seoa) `creative_messaging.md` 산출물이 회의·regen 모두 이 400으로 실패. 같은 회의의 다른 3개 산출물은 정상. 지침 198자(의심 문자 없음)인데도 발생. 단순 지침으로 바꾸면 통과 → 특정 출력 내용이 트리거.

**오진 주의:** 처음엔 컨텍스트 8192 초과로 의심해 16384로 키웠으나(그 자체는 유의미한 개선) 400의 원인은 아니었다. 단순 생성·긴 마크다운(8000토큰) 테스트는 다 200.

**Why:** qwen 출력의 tool-call/구조화 파싱 단계로 추정. 콘텐츠 의존적·비결정적.

**How to apply (워크어라운드):**
1. 해당 산출물만 `regen_artifact.py`로 재시도 — 샘플링 달라지면 통과하기도 함.
2. 계속 실패하면 단순 지침으로 regen(품질↓·근거 잃음) 하지 말고, **briefing + 자매 산출물 맥락에 맞춰 직접 작성**(후처리)하고 파일 상단에 후처리 사유 명시.
관련: [[reference_local_hardware_spec]] · [[project_meeting_context_grounding]]

**부수 개선(2026-06-13):** regen_artifact.py를 strict PyYAML → meeting.py의 관용 파서(load_yaml_simple)로 교체(캐릭터 yaml 12개가 strict에서 깨졌음). regen 타임아웃 300→900s. qwen 컨텍스트 8192→16384.
