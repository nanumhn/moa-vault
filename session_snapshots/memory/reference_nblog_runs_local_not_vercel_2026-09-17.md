---
name: reference_nblog_runs_local_not_vercel_2026-09-17
description: "nblog-saas는 Vercel 배포본이 아니라 로컬 서비스다 — 운영 기준선은 워크트리 nblog-saas-dex-ops-baseline + 127.0.0.1:3002. GitHub 브랜치 상태를 배포 상태로 읽으면 틀린다"
metadata:
  type: reference
---

**2026-09-17 실측** (`C:\Users\user\.moa\nblog_stack_up.ps1` · `nblog_cron_tick.ps1` 직접 열람, 3002 직접 조회).

## 실제로 돌아가는 것
| 항목 | 값 |
|---|---|
| 운영 기준선 폴더 | `D:\Develop\nblog-saas-dex-ops-baseline` (스크립트에 하드코딩, 2026-09-09 지정) |
| 웹 | `bun run dev` → **`http://127.0.0.1:3002`** |
| DB | 포터블 Postgres **5433** (`D:\Develop\pg-portable\pg16`) — docker도 Windows 서비스도 아니다 |
| 스케줄러 | `nblog_cron_tick.ps1` 1분 주기. **`vercel.json`의 crons는 안 돈다**(Vercel 배포본에서만 동작하는데 그게 없다) |

## ★여기서 틀리기 쉬운 것
- **`prod` 브랜치는 실제 서비스와 무관하다.** GitHub에 `origin/prod`가 있어서 "배포 브랜치"로 보이지만, 거기 병합됐다는 것이 **돌고 있다는 뜻이 아니다.** 2026-09-17에 클로가 이렇게 오보했다.
- 배포 여부를 확정하려면 ①**그 워크트리의 체크아웃 커밋**(`git -C <워크트리> rev-parse HEAD`)과 ②**3002 응답**을 본다. 브랜치 그래프만 보면 안 된다 → [[feedback_git_fetch_before_declaring_repo_idle_2026-09-17]]
- `D:\Develop`에 `nblog-saas-*` 클론·워크트리가 **17개** 있다. 그중 **이 하나만** 운영본이다.

## 2026-09-17 시점 상태
체크아웃 `dex/ops-baseline` / HEAD **`a6878bf`** / 3002 **HTTP 200**.
→ 09-01~09-09 사이 그 6커밋은 **돌고 있다**.
→ 다만 이 체크아웃이 **`origin/main`보다 6커밋 뒤**(반대 방향 0). **main에 병합된 최신 작업 6건은 안 돌고 있다.** 기준선 폴더가 main을 안 따라간다.

**안 확인한 것**: dev 서버가 그 커밋을 서빙 중인지는 체크아웃 상태로 **추론**했다. 빌드에 박힌 커밋 표식으로는 확인 안 했다(bun dev가 워킹트리를 직접 읽으므로 가능성은 높다).
