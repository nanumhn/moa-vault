---
name: reference_moc_staleness_evidence_contract_2026-08-22
description: MOC 방치 검사가 손으로 적은 updated 날짜 대신 커밋·파일 근거로 대조한다 — 새 MOC엔 evidence_git을 반드시 적을 것
metadata: 
  node_type: memory
  type: reference
  originSessionId: 89a3f818-94be-41ca-9b73-e70966618f5f
  modified: 2026-08-22T05:45:52.633Z
---

`C:\Users\user\.moa\moa_moc_staleness.ps1` (2026-08-22 개정, 백업 `.bak-20260822`).

**바뀐 이유**: 옛 검사는 frontmatter `updated:` 한 줄만 봤다. 그 날짜는 **우리가 손으로 적는다** — 안 적으면 안 낡은 게 되고, 날짜만 올리면 통과한다. `-Days 3` 창 안(이틀 전)이면 무슨 일이 있었어도 통과했다. 그래서 08-20·08-21 이틀 연속 "이상 없음" 오진. [[feedback_check_tool_can_false_pass]]

**검사 4종**: [A]날짜 창 · [B]**근거 대조** · [C]**날짜 근거**(`updated` 날짜에 해당하는 `[[날짜]]` 타임라인 줄이 본문에 있나) · [D]frontmatter 깨짐.

**★새 MOC를 만들면 frontmatter에 근거원을 꼭 적어라** — 안 적으면 NOSOURCE로 보고되고 그 MOC는 사실상 검사가 안 돈다:
- `evidence_git: D:/Develop/moa-studio:tools/atz-pipeline` — 저장소[:하위경로], 쉼표로 여러 개. **경로는 역슬래시 말고 슬래시**(sed·YAML에서 역슬래시가 먹힌다). 한 저장소를 여러 프로젝트가 쓰면 하위경로를 꼭 적어야 서로 오탐 안 난다
- `evidence_files: C:/Users/user/.moa/*.ps1` — git 아닌 폴더용
- `evidence_ignore: session-reset snapshot` — 매일 자동으로 찍히는 미러 커밋 제외(안 하면 매일 BEHIND로 떠서 사람이 검사를 무시하게 된다)

**기준 시각은 MOC의 마지막 커밋 시각**이다(파일 수정시각 X — 일괄 편집 한 번에 전부 바뀐다 / `updated` 날짜 X — 하루 단위라 "아침에 MOC 쓰고 오후에 일한 것"을 영원히 못 잡는다). **즉 커밋해야 반영된다** — 고쳐놓고 커밋 안 하면 계속 BEHIND로 뜬다(정상 동작).

**헛짚은 길 2개(다시 시도하지 말 것)**: ①"일지에 프로젝트 이름이 몇 번 나오나"로 세기 → 첫 실행에서 바로 오탐, *"아투 보류큐 07:15 점검 **0건**"* 같은 **아무 일도 없었다는 정기 문구**를 일한 증거로 셌다 ②앞선 일지와 같은 줄을 빼는 novelty 필터 → 일지 형식이 하루만 바뀌어도 무력. **커밋·파일 변경만 근거로 쓴다.**

관련: [[feedback_verified_facts_only]] · [[reference_owenlab_git_push_gh_credential]](랩실 push는 `-c "credential.helper=!gh auth git-credential"` 필요)
