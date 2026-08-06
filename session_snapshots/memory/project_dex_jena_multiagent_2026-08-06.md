---
name: project_dex_jena_multiagent_2026-08-06
description: "덱스(코덱스)·제나(제미나이) 디스코드 봇 워커 신설 — 클로가 지휘, 윈도우 네이티브로 하루만에 구축"
metadata: 
  node_type: memory
  type: project
  originSessionId: f20c02b9-e2eb-42d4-96c3-cade5d5e53c0
  modified: 2026-08-06T02:10:27.004Z
---

형이 유튜브(AI 치트키)에서 본 "디스코드 하네스 멀티 에이전트" 매뉴얼(macOS+tmux 전용)을 계기로, 클로(지휘자)가 OpenAI Codex("덱스")·Google Gemini/Antigravity("제나")를 디스코드 봇 워커로 직접 지휘하는 시스템을 하루 만에 구축·실전투입했다.

**왜:** 클로 혼자 감당하는 토큰/세션 부담을 다른 모델로 분산 + 모델별 강점 활용(제나=리서치, 덱스=코딩+교차검수).

**기술 핵심:** 매뉴얼은 macOS+tmux 전제였지만 WSL·tmux 없이 윈도우 네이티브로 구현 가능함을 확인. 오픈소스 브리지(`netwaif/codex-discord`)를 윈도우용으로 패치해서 씀. 최대 리스크(코덱스 workspace-write 샌드박스가 윈도우 무인실행 되는가)는 config.toml `[windows] sandbox = "unelevated"` + PATH 보정으로 해결.

**채널 구조:** 형-클로 대화(기존, 1501858476362829834) / 그들만의업무(작업, ID **1534714627383099493**) / 그들만의회의(1531838653066645654) / 그들만의대화(수다, ID **1531912848433741825**). ★2026-08-06 저녁: 클로가 업무·대화 채널ID를 처음에 서로 바꿔 기록해서, 초반 실제 업무지시(제나 리서치·덱스 코딩)가 전부 "대화" 채널로 갔었음(형이 화면 보고 발견해 정정). 기능상 문제는 없었음(3채널 다 CHANNEL_IDS/allowlist에 포함). 클로도 이 채널들 접근 허용 추가함(`/discord:access group add`), 멘션 또는 "클로" 텍스트로 호출.

**겪은 버그와 교훈:**
- 코덱스 윈도우 샌드박스: elevated 모드는 `CreateProcessWithLogonW` 오류로 실패 → unelevated로 우회. 패키징 버그(`codex-windows-sandbox-setup.exe`가 PATH에 없음)도 발견해 우회
- 봇 자식프로세스가 콘솔창을 계속 띄움(형이 목격) → `windowsHide: true` 추가로 해결, 손자 프로세스까지 전파 확인
- 덱스가 답변에 `[나이]` 라벨을 붙이던 버그 → `templates/AGENTS.md`(라벨 금지 규칙)가 워크스페이스에 안 복사돼 있던 게 원인
- **가장 중요한 발견**: 클로가 덱스·제나를 디스코드 메시지로 직접 못 부르는 구조였음 — `classifyMessage()`가 봇발신 메시지를 무조건 context-only 처리(무한루프 방지 안전장치). `TRUSTED_BOT_IDS` 환경변수로 클로 봇ID만 예외 인정하도록 좁게 수정해서 해결(다른 봇은 여전히 무시 = 안전장치 유지)
- Stop-ScheduledTask가 자식 node 프로세스를 안 죽여 좀비가 락파일을 쥐고 재시작을 막는 함정도 발견+수리

**설계 결정:** RunLevel은 Highest 아니라 **Limited**(검증한 환경이 비관리자 셸이었으므로). 승인 게이트 없이 클로가 판단해서 위임하고 결과만 형 보고(기존 위임규칙 그대로 확장).

**형 지시로 이름 변경:** "나이"→"제나"(사람 나이(age)와 혼동돼서). 문서·코드·봇 계정 전부 반영 완료.

**문서:** 설계 `10_Wiki/Projects/2026-08-06-dex-nai-multiagent-design.md`, 실행계획 `...-PLAN.md`(파일명은 위키링크 안정성 때문에 나이 표기 유지, 내용만 제나로 갱신), 상세 진행로그 `C:\Users\user\.moa\dex_jena_setup_progress.md`(가장 최신/정확).

**실전 첫 과제(진행 중):** 아투(american-todayz) 뉴스소스를 국내매체→해외매체(NPR·가디언US·BBC·CNBC RSS)로 전환. 제나가 리서치 완료, 덱스가 구현 중(dry-run까지, 라이브 반영은 형 승인 후). 도중에 덱스가 `D:\Develop\moa-studio`(실제 대형 저장소)에 코덱스 unelevated 샌드박스로 쓰기가 막히는 신규 버그 발견 — `dex-jena-bridge`(빈 신규 클론)에서는 됐는데 moa-studio에서는 안 됨, ACL은 동일해 원인 불명, cto-seojin에게 조사 위임(2026-08-06 저녁 기준 진행중).

**형 확정 규칙(2026-08-06):** 워커(덱스·제나)한테 업무 지시는 항상 "그들만의업무" 채널(ID **1534714627383099493** — 위 채널ID 정정 참고, 헷갈리지 말 것)에서 한다.

**형 지시로 신설된 규칙:** 단위 작업 완료마다 세션일지와 별도로 "전문 완료보고서"를 archive-head-haru가 작성 (참고: [[feedback_clo_orchestrates_agents_execute]]).

관련: [[feedback_clo_orchestrates_agents_execute]] [[project_harness_revenue_layer]] [[project_atz_hallucination_fix_2026-07-27]]
