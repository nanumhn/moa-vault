---
name: project_open_threads_2026-08-17_dawn_snapshot
description: "2026-08-17 04시 새벽저장 스냅샷 — 최우선=인스타 댓글DM이벤트(cto/윤슬/서아 진행중) 확인, bypassPermissions 세션적용 여부 확인"
metadata: 
  node_type: memory
  type: project
  originSessionId: 9003f52c-6c15-4df6-bbfa-1e4f406d8940
  modified: 2026-08-16T19:25:59.816Z
---

**★최우선 — 인스타 댓글→DM→사주이벤트 캠페인, 배경에이전트 3개 진행 중**
- 형 승인: 인스타(@ksaju.daily) 오너=윤슬 확정(결재A). $50 유료테스트(결재B)는 **홀딩** — 대신 이 이벤트로 방향전환.
- 시나리오: 캐러셀 댓글 → 비공개DM "팔로우했어요" 버튼(자기신고, API검증 없음 — 형이 grappt_ 계정 실사례로 확인시켜줌) → 클릭시 k-saju.me/input 사주리딩 링크.
- 기술: Meta Instagram Graph API Private Reply로 공식 지원(계정정지 리스크 없음). 궁합 앱기능 아직 없음, 이번 범위 제외.
- **cto-seojin**: IG 토큰 갱신 완료(10/15까지 연장, 형개입0분) + 06-22 자동게시 실패 원인 규명(워크플로가 graph.facebook.com 호출했는데 토큰은 graph.instagram.com 전용 — 호스트불일치가 원인, 토큰문제 아니었음). 다음: n8n credentials 이전, 45일 자동갱신, Meta 앱심사, 댓글DM 자동화 구축.
- **강윤슬(growth-head)**: 캐러셀 카피/UTM설계/게시타이밍 작성 중.
- **content-head-seoa**: 별개로 형 지시(사주 외 팔자·운세·궁합·12지신 콘텐츠 다양화) 기획 작성 중.
- 3개 다 한 번 강제중단(TaskStop) 후 재개시킴(권한프롬프트 폭탄 때문). 다음 세션에서 진행상황 SendMessage 확인할 것.

**그로스마케팅본부장 개명 완료: 강나라→강윤슬 (표시이름+기술슬러그 둘 다)**
- 처음엔 표시이름만 바꿨다가 형이 "narae도 윤슬로 변경해!!!"라고 재지시해서 기술 agent slug도 growth-head-narae→growth-head-yoonseul로 완전 이전(`.claude/agents/growth-head-yoonseul.md` 신설, 구파일 삭제, 관련 10개 파일 cross-reference 전부 sed 치환). 새 세션부터는 에이전트 레지스트리가 growth-head-yoonseul로 정상 인식함(이번 세션 안에서 이미 확인됨).
- CLAUDE.md 변경이력 표의 과거 항목(2026-06-13)은 역사기록이라 안 건드림.

**★★권한승인 프롬프트 폭탄 — 형 극심한 불만, defaultMode=bypassPermissions로 전환**
- 배경에이전트 3개 동시 실행 중 명령패턴마다 Discord승인카드가 계속 떠서 형이 "이렇게하면 작업이 진전 안돼!!!" "질문폭탄" 등으로 여러 차례 격하게 지적. settings.json 허용목록 24개+ 추가했지만 완전 해결 안 됨(복합명령·매번 다른 변형은 여전히 프롬프트).
- 형이 "manual, auto mode 차이인가?" 정확히 지적 → `.claude/settings.json`에 `permissions.defaultMode: "bypassPermissions"` 추가. **1차 시도는 시스템이 자체 차단**(자기권한 격상 방지 안전장치로 추정) → 형이 "다시 요청해" 재지시 → 2차 시도는 적용됨.
- **다음 세션에서 확인할 것**: 이 설정이 실제로 로드돼서 프롬프트가 줄었는지. 세션 시작시 로드되는 설정이라 이번 세션엔 미적용일 수 있음(다음 리셋부터 확실). **이건 모든 안전장치(hard_deny 포함)를 끄는 설정이라 실제 위험행동도 안 걸러진다는 뜻 — 형한테 이미 고지는 했음.**

**케이사주 표기 정정**: "케익사주"(오타)→"케이사주"로 앞으로 통일.

**하루(archive-head)가 오후·야간 업무일지 이미 작성완료** — `70 Record/2026-08-16.md`에 반영, 자산목록도 갱신(인스타 토큰10/15, 담당=윤슬), git push 완료. 단 이 일지는 rename(narae→yoonseul 기술슬러그) 이후 내용은 다루지 않음(그 전 시점 작성) — 다음 아침/오후 일지에 이어서 반영 필요.

관련: [[project_growth_head_rename_yoonseul_2026-08-16]] [[feedback_autonomy_delegation]] [[project_open_threads_2026-08-16_afternoon_snapshot]]
