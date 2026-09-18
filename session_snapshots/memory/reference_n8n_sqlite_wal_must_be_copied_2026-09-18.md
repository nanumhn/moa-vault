---
name: reference_n8n_sqlite_wal_must_be_copied_2026-09-18
description: "n8n DB를 docker cp로 볼 때 database.sqlite만 복사하면 최근 실행이 status=new로 보인다 — WAL에 있는 쓰기를 못 읽어서. -wal·-shm까지 같이 복사할 것"
metadata:
  node_type: memory
  type: reference
---

**한 줄**: `docker cp n8n:/home/node/.n8n/database.sqlite` **한 개만** 복사해 읽으면, **방금 끝난 실행이 `status=new` · `startedAt=None`(시작도 안 한 것)처럼 보인다.** 고장이 아니라 **조회 방법이 틀린 것**이다.

## 실측 (2026-09-18 08:5x)
인스타 확인 예약 중에 같은 DB에서 `blogAutoPost001` 실행 431이 `status=new`, `startedAt=None`, `createdAt 23:10:00Z` 로 보였다. 41분째 미시작 = **"오늘 k-saju 블로그 안 나갔다"고 보고하기 직전**이었다.

**틀렸다.** [확인: `gh api repos/nanumhn/k-saju-blog/commits` 직접 조회] 오늘 글은 정상 발행됐다 — `461404a feat: add blog post your-saju-in-your-20s-and-40s (2026-09-18)`, 커밋 `2026-09-17T23:11:17Z` = **08:11:17 KST**.

[확인: `docker exec n8n ls -la /home/node/.n8n/database.sqlite*`] 컨테이너에는 세 파일이 있다:
- `database.sqlite` 13.2MB (08:10)
- `database.sqlite-wal` **4.4MB (08:11)**
- `database.sqlite-shm` 32KB (08:12)

sqlite는 WAL 모드에서 최근 쓰기를 `-wal` 에 먼저 담는다. 본체만 복사하면 **체크포인트 이전의 모든 쓰기가 빠진다.**

## How to apply
- n8n 실행기록을 볼 때 **`database.sqlite` · `-wal` · `-shm` 셋을 다 `docker cp`** 하고 같은 폴더에 두고 읽는다. 셋이 같이 있어야 sqlite가 WAL을 반영해 읽는다.
- 또는 컨테이너 안에서 읽는다(단 컨테이너에 `sqlite3`·`better-sqlite3` 모듈이 **없다** — 2026-09-18 실측).
- ★**status=new / startedAt=None 을 "미실행"으로 읽지 말 것.** 반드시 **산출물 쪽에서 교차확인**한다 — 블로그는 `gh api` 원격 커밋, 인스타는 Graph API 재조회. [[feedback_absence_of_record_is_not_absence_of_problem_2026-09-06]] 의 반대 방향 사례다: **기록이 없다고 안 된 것도 아니다.**
- 참고: n8n 오늘 실행 모양은 ksajuCarouselV5 **성공1 + 실패2** 가 정상이다 → [[reference_ksaju_ig_daily_two_failed_execs_2026-09-10]]

관련: [[feedback_check_tool_can_false_pass]] · [[reference_runs_but_not_counted_pattern_2026-09-06]] · [[feedback_git_fetch_before_declaring_repo_idle_2026-09-17]](같은 계열 — 낡은/부분 사본으로 "안 돌았다"고 단정)
