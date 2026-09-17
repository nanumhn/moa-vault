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

---

## 2026-09-17 14:5x 재확인 (클로, 직접 조회)

**16일째 그대로다.** `git fetch` 후 `origin/main` 최신 기준 전수 스캔 — content/posts 67편 중 3행이 `frontmatter` 인 파일이 **정확히 위 6편**. 하나도 안 고쳐졌다.

**숫자 정정** — 09-17 오전 스냅샷의 *"라이브 64 vs 레포 .mdx 71 = 7편 차"* 는 **두 군데가 틀렸다**:
- 로컬 클론이 **origin/main보다 10커밋 뒤처져** 있었다 ([[feedback_git_fetch_before_declaring_repo_idle_2026-09-17]]와 같은 함정, 같은 레포에서 이틀 연속)
- 71에 발행 대상이 아닌 `tools/_drafts` 7편 + `tools/fixtures` 7편이 섞였다 (`content/posts` 만 세야 한다)

**실측**: origin/main `content/posts` **67편** vs 라이브 **61편** = **6편 차**. 라이브 수는 `https://blog.k-saju.me/sitemap.xml` 직접 조회(총 70 URL − 페이지네이션 5 − 고정페이지 4). **반대 방향(라이브에만 있는 글) 0편.**

**대조군 확인**: 라이브에 살아 있는 글 3편은 전부 `---` 다음 줄이 바로 `title:` 이었다.

**결재**: `REQ-20260917-KSB-01`(제나에게 복구 배분) 올림 — 신규 발견이 아니라 **미완 건 재상정**이다.

**★이날 클로가 틀린 것**: 이 원인을 "오늘 찾았다"고 형께 보고했다. **이 파일에 09-01자로 이미 적혀 있었다.** 보고 전에 관련 기록을 안 펴봤다. 같은 실수를 같은 세션에서 아투 건까지 두 번 했다 → [[feedback_read_own_records_before_reporting_as_new_2026-09-17]]
