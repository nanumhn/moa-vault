---
name: project_obsidian_brain_overhaul_2026-08-06
description: "옵시디언을 \"쓰기전용\"에서 팀 지식베이스로 개편 — MOC 6개+dataview 대시보드 완료, 덱스·제나 첫 실전 회의 테스트"
metadata: 
  node_type: memory
  type: project
  originSessionId: d2a722cb-f20a-4853-9f06-cb9e30b71104
  modified: 2026-08-12T04:01:53.961Z
---

2026-08-06 오후, 형이 옵시디언 스크린샷 2장(빈 칸반보드·고립된 그래프뷰)을 보내며 "기능은 있는데 활용을 하나도 못 하고 있다"고 지적. 회의채널(1531838653066645654)에서 덱스·제나 첫 실전 투입 테스트 겸 회의 진행.

## 결정된 것 (최종, 실행 완료)
- **칸반 카드 수동/자동 이동 방식 폐기 → dataview 자동집계 채택.** 이유: 프로젝트 노트 프론트매터 `status:` 필드만 바뀌면 표가 자동 갱신되어, 동시편집 충돌·권한 문제 자체가 사라짐. 덱스가 시도한 직접 파일쓰기 CLI(`scripts/obsidian-kanban-task.mjs`)는 그래서 폐기.
- **형 개인 볼트 경로**: `D:\Develop\Claude_Channels\Obsidian\owenlab` (moa-vault 아님 — 제나가 처음에 moa-vault를 잘못 대상으로 삼아서 정정한 적 있음)
- 산출물: `02 Projects\20 모아 스튜디오\` MOC 6개(모아전체·k-saju·아투·쇼츠·덱스제나·하네스) + 상태 프론트매터, `01 Dashboard\모아 프로젝트 현황.md`(dataview 대시보드, 형 개인 TODO.Kanban.md는 안 건드림), 일일 템플릿에 `projects::`/`decisions::` 연결 강제
- **형이 옵시디언 열어서 대시보드가 실제로 렌더링되는지 확인 필요 — 에이전트는 GUI를 못 봄.** → **확인됨(2026-08-12): 형이 "그거 봤어, 대시보드"라고 직접 확인.** 렌더링 품질(표가 제대로 나왔는지)은 후속 확인 중.

## 프로세스 교훈
- 내부 페르소나 회의(coo-dohyun, LM Studio 7B)를 백업으로 동시에 돌렸는데, 실제로 더 나은 설계(dataview 방식)를 찾아냈다 — 라이브 워커 회의보다 늦게 끝났지만 유용했음. 단, 산출물에 7B 모델 특유 오류 6개(파일명 대소문자 충돌 위험, 권한배정 오류, dataview 문법 오류 등)가 있어서 그대로 못 쓰고 haru가 교정.
- [[feedback_mention_on_meeting_start]] — 회의 시작 메시지에 멘션 빠뜨려서 형이 지적.

## 부수 발견 (별개 이슈, 여기서 처리)
- [[project_dex_git_lock_root_cause_2026-08-06]] — 덱스 git lock 근본원인 발견, 형 결정 대기
- 제나 mp3 버그: agy가 오디오 print-mode 미지원 → 내부 STT 시도하다 타임아웃(5분)이 브리지 대기(15분)보다 먼저 터짐. 타임아웃 정렬+안내문 추가로 수정 완료(dex-jena-bridge 커밋 `e8c7969`, 로컬만 — 이 저장소는 남의 오픈소스 포크라 푸시 안 함). 진짜 STT 지원은 별도 작업, 미착수.

관련: [[project_dex_jena_multiagent_2026-08-06]] [[feedback_mention_on_meeting_start]]
