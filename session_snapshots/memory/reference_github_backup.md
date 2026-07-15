---
name: github-backup
description: moa-studio와 clo_studio의 GitHub 원격 백업 위치. 2026-05-29 백업 체계 구축.
metadata: 
  node_type: memory
  type: reference
  originSessionId: 21440e58-c87b-4bf1-8a4a-156f697ad594
---

2026-05-29 백업 체계 구축. 그 전엔 백업 전무(moa-studio 마지막 커밋 5/12, 원격 0 / clo_studio git 없음)였음.

**원격:**
- moa-studio → `https://github.com/nanumhn/moa-studio` (private, `main` 브랜치)
- clo_studio → `https://github.com/nanumhn/clo_studio` (private, `main` 브랜치)

**git author:** name=`nanumhn`, email=`ssky.park@gmail.com` (전역 config 미설정 — 커밋 시 `git -c user.email=... -c user.name=...` 일회성 지정으로 했음. instructions상 전역 config는 안 건드림).

**제외(.gitignore):** moa-studio는 `.env.local`(키15개), 대용량 미디어 `public/{videos,mastered,stems}`(403M). clo_studio는 `logs/`, `.tmp_*`, `__pycache__`. → 대용량 미디어는 git 밖이라 **외장/클라우드 별도 백업 필요**.

**How to apply:** 작업 후 백업하려면 해당 repo에서 커밋 + `git push`(인증은 형이 한 번 해둬서 credential 저장됨). 앞으로 자율 OS 직원 지식베이스(Obsidian vault)도 이 백업 체계에 포함 예정. "백업 어디?" 물으면 여기. 단 현재 상태는 `git remote -v` / GitHub에서 직접 확인이 authoritative.
