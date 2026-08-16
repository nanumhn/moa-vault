---
name: project_growth_head_rename_yoonseul_2026-08-16
description: "그로스마케팅본부장 표시이름 강나라→강윤슬 개명 확정(형, 2026-08-16). 마케팅에 어울리는 이름으로 바꿔달라는 형 요청, 3안(해윤/윤슬/다온) 중 윤슬 선택"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9003f52c-6c15-4df6-bbfa-1e4f406d8940
  modified: 2026-08-16T18:42:36.495Z
---

**그로스마케팅본부장 표시이름 = 강윤슬** (형 확정, 2026-08-16 18:39 KST)

형이 "나라 이름 대신 마케팅에 어울리는 이름으로 변경해줘"라고 요청 → 클로가 3안(강해윤/강윤슬/강다온) 제시 → 형이 "윤슬로 하자" → 이어서 "강윤슬. 그로스마케팅본부장." 으로 재확인.

**반영 완료한 곳** (기술적 agent slug `growth-head-narae`는 SendMessage 라우팅 깨짐 방지 위해 유지, 표시이름 텍스트만 교체):
- `.claude/agents/growth-head-narae.md` (description + 본문 제목)
- `clo_studio/dashboard/org/org.json`, `clo_studio/dashboard/org-app/data/org.json` (조직도 대시보드 표시명)
- `.scratch/render_org.py`

**반영 안 한 곳(의도적)**:
- `clo_studio/characters/narae.yaml` — 이건 동명이인 "박나래"(운영본부 인사이트 분석가, 회의용 15페르소나 중 하나)라 무관. 건드리지 않음.
- `clo_studio/teams/*.json`, `clo_studio/output/run_*/*.json`, `Obsidian/.../70 Record/*.md` — 과거 회의/작업 기록(로그)이라 그 시점엔 "강나라"였던 게 맞음. 역사 기록이므로 리네임 안 함.

**Why:** 형이 마케팅본부장 캐릭터에 더 어울리는 이름을 원함(기존 "나라"는 평범/불명확하다고 판단한 듯). [[reference_media_stack_2026-07]] 참고 — 이게 이 캐릭터의 **두 번째** 개명(강나래→강나라→강윤슬).

**How to apply:** 앞으로 이 본부장을 부를 때 "강윤슬"(또는 "윤슬") 사용. "나라"는 이제 옛 이름이니 형과의 대화에서 헷갈리지 않게 주의. agent 호출 시 기술 슬러그는 여전히 `growth-head-narae`.

관련: [[reference_media_stack_2026-07]] [[feedback_naming_glossary_as_we_go]]
