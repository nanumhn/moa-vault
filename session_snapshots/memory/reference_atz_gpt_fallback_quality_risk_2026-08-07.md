---
name: reference_atz_gpt_fallback_quality_risk_2026-08-07
description: "아투는 평소 GPT가 작성하지만 GPT 호출 실패 시 로컬 qwen2.5-7b로 폴백한다 — 이번 폴백 회차에서 용어오염+논조역전+창작이 몰려 나옴, 폴백 여부를 사고 원인 진단 1순위 체크로 삼을 것"
metadata: 
  node_type: memory
  type: reference
  originSessionId: e191fe26-93b0-4a73-b1fb-b967f371511a
  modified: 2026-08-07T13:39:33.950Z
---

형 질문("아투는 GPT가 쓰는거 아니냐")에 답하며 확인: 평소엔 맞다. 다만 2026-08-07 pm 슬롯은 **GPT 호출이 실패해서 로컬 qwen2.5-7b로 자동 폴백**된 회차였고, 이 회차에서 유독 결함이 몰렸다 — "폴리실리콘"→"폴리실린" 용어 오염(기사 전체 12곳+), 각계 반응 논조 정반대 창작(원문엔 한화큐셀이 "환영"인데 "업계 우려+정부 대응 논의"로 지어냄), 인용 출처 오귀속, 한국 관련 구체 수치 누락. cto-seojin이 발행 직전 스스로 멈추고 qa-lead-jian 독립검수를 거쳐서야 잡혔다([[project_atz_reversed_quote_incident_2026-08-06]]과 같은 유형의 사고를 이번엔 발행 전에 막음).

**Why:** 7B 로컬 모델은 GPT보다 낯선 외래어 표기·논조 보존·수치 대상 정확도가 떨어진다. 폴백은 "글이 안 나오는 것보다 낫다"는 가용성 우선 설계라, 폴백이 발생한 회차는 **구조적으로 창작·오염 위험이 평소보다 높다.**

**이번 폴백의 정확한 원인 [확인, `.moa/atz_pipeline.log` 10:30:32]**: GPT는 API가 아니라 **브라우저(크롬) 조종 방식**(`gpt-writer.mjs`, 형 지시 2026-07-31 "아투 등 블로그 집필은 gpt가 담당"). 이번엔 `Promise was collected` 에러로 실패 — 브라우저 자동화가 페이지 응답을 못 받거나 컨텍스트가 예기치 않게 닫힐 때 나는 전형적 오류(크롬 미기동·로그인 만료·UI 변경 계열, `run.mjs` 주석에 이미 알려진 위험으로 명시돼 있음). `run.mjs`가 GPT 실패를 잡아 자동으로 qwen 폴백하고 로그에 `writer = 'qwen(폴백)'`으로 남기도록 설계돼 있다(조용한 폴백 방지가 설계 의도).

**How to apply:**
- 보류 기사를 진단할 때 **어느 모델이 썼는지(GPT 정상 vs 폴백)를 가장 먼저 확인**할 것 — 폴백 회차면 QA를 더 꼼꼼히(원문 문장 단위 전수 대조) 볼 것.
- 폴백 발생 자체를 로그/원장에서 추적 가능한지 확인 필요(아직 미확인) — 가능하면 폴백 회차는 발행 전 검수를 상시 강제하는 정책도 고려할 만하다(cto-seojin·qa-lead-jian에 위임 검토).

관련: [[project_atz_hallucination_fix_2026-07-27]] [[project_atz_reversed_quote_incident_2026-08-06]] [[reference_atz_gate_anchor_hangul_gap_2026-08-04]]
