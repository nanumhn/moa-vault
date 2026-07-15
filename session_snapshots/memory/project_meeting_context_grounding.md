---
name: project_meeting_context_grounding
description: "Persona meetings drift to stale topics unless each revenue line's identity is injected into the team's pre-meeting context"
metadata: 
  node_type: memory
  type: project
  originSessionId: ee8b467e-df9e-45b7-958b-13a0479d9823
---

clo_studio 페르소나 회의는 팀 사전 컨텍스트에 **각 프로젝트/라인의 정체성**이 명시돼 있지 않으면 stale 토픽으로 드리프트한다.

**증거 (2026-06-13):** `saas_us_10m` 팀으로 "월 1000만원 구체화" 회의 실행 시, 페르소나가 saju-studio(글로벌 사주=astrology 서비스)를 **"로파이 시티팝 음악 서비스"로 오인**했다. 원인은 모델 성능(qwen2.5-7b)이 아니라, 팀 정의에 saju-studio 정체성이 없고 엔진 기본 토픽이 음악 플레이리스트("주말 새벽 카페 무드 플리")라 거기에 끌려간 것.

**Why:** 7B 로컬 모델은 약어/제품명만으로 도메인을 추론 못 함. 비어있는 컨텍스트는 가장 최근/기본 토픽으로 채워진다.

**How to apply:** 팀 json에 `"briefing"` 필드를 넣으면 `meeting.py:run_meeting()`이 모든 참석자 system_prompt에 '회의 사실 근거'로 자동 주입한다(2026-06-13 엔진에 추가·검증 완료). 여기에 각 라인 정체성을 박을 것 — 예: "saju-studio = 동양식 사주(four pillars) 글로벌 점성술 서비스, 음악 아님". 주의: 회의 주제(topic) 문자열만으로는 주입 안 됨. 검증: briefing 주입 후 재실행 시 사주 컨셉이 점성술(Co-Star/Sanctuary 경쟁)로 정상 교정됨(분위기 묘사 한 줄에 음악 잔재만 미미하게 남음). 관련: [[project_3_saju_global]] · [[reference_local_hardware_spec]]
