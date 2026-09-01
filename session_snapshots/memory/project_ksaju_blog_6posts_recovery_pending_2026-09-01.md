---
name: project_ksaju_blog_6posts_recovery_pending_2026-09-01
description: "k-saju-blog 이중 --- frontmatter 버그 — 재발방지는 완료, 이미 숨겨진 과거 글 6건 복구는 아직 미완"
metadata:
  type: project
---

**2026-09-01 확정.** k-saju-blog의 "글이 조용히 사라지는" 버그(`---\n---\nfrontmatter\n...` 이중 opening fence → gray-matter가 frontmatter를 빈 값으로 읽음) 원인 확정 및 재발방지는 완료됐다.

## 완료된 것
- `tools/build-mdx.js`에 이중 opening fence 보정 로직 추가(커밋 전, 워킹트리에 있음 — git commit은 안 함)
- `tools/build-mdx.spec.mjs` 신규 작성, 실제 malformed 6건 전부 fixture로 재현해 36개 테스트 전부 통과 확인
- `bun tools/inject.mjs`로 패치 JSON 생성 → `docker exec n8n n8n import:workflow`(CLI, UI import는 노드를 복제하는 버그가 있어서 못 씀)로 `blogAutoPost001`에 반영
- CLI import가 워크플로를 자동 비활성화시켜서 `n8n update:workflow --active=true`로 재활성화 → 실행 중 프로세스 갱신을 위해 `docker restart n8n` 실행(형 승인 REQ-20260901-KBLOG-02 받고 진행)
- 재시작 후 `blogAutoPost001` active 상태 재확인 완료 — 내일부터 정기실행에 이 fix가 적용됨

## 미완 — 다음 세션이 이어받을 것
**이미 사이트에서 사라진 과거 글 6건 자체는 아직 복구 안 됐다.** 원래 덱스 결재요청(2026-08-31, 메시지 1543780396037177395) 범위엔 "재발방지 코드수정" + "malformed 6건 메타데이터 보존 후 별도 커밋으로 복구" 둘 다 있었는데, 형이 2026-09-01 "상태값 완료로 변경하자"고 하셔서 재발방지만으로 이슈를 닫았다 — 6건 복구는 **별도 건으로 남겨진 것**이지, 끝난 게 아니다.

6건 파일 위치(전부 `D:\Develop\k-saju-blog\content\posts\`, 로컬엔 이미 원본이 있음 — GitHub 원격에 이중 `---` 상태로 커밋돼 있어서 사이트 빌드에서만 빠짐):
- `reading-saju-without-a-birth-time.mdx`
- `saju-zodiac-animal-year-may-be-wrong.mdx`
- `saju-work-compatibility-boss-colleague.mdx`
- `yongsin-useful-element-saju.mdx`
- `spouse-palace-day-branch-saju.mdx`
- `why-koreans-check-saju-before-big-decisions.mdx`

복구 방법: 로컬 원본을 `build-mdx.js`의 수정된 보정 로직에 통과시켜 정상 frontmatter로 만든 뒤(제목·날짜·slug 등 메타데이터는 그대로 보존), 별도 커밋으로 GitHub에 재푸시하면 사이트에 다시 노출될 것 — 단 이 작업은 아직 시작 안 했다.

이슈 스레드: 1543776714197565491 (`🟡 [실전 이슈 002] 케이사주 블로그 최근 발행 중단·Vercel 배포 경로 조사`)
