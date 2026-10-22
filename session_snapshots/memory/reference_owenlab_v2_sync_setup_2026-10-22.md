---
name: reference_owenlab_v2_sync_setup_2026-10-22
description: "OwenLab V2 서버 경로·동기화 설정(10-22) — D:\\Develop\\Claude_Channels\\Obsidian\\OwenLab_V2, 예약작업 'OwenLab V2 Git Sync' 5분, gh 자격증명 로컬"
metadata:
  node_type: memory
  type: reference
  originSessionId: ce6bdb97-9b86-497d-a5e0-6927192eac4f
  modified: 2026-10-22T06:11:24.568Z
---

2026-10-22 14:4x 형 지시로 설정 완료.
- 서버 V2 경로: `D:\Develop\Claude_Channels\Obsidian\OwenLab_V2` (저장소 nanumhn/owenlab-notes-v2, main). 형이 앞서 준 `D:\SMD\...`는 개발PC1 경로.
- 동기화: `99 운영/동기화/Sync-OwenLabV2.py`(추적 158개+.gitignore 해시 검사, 새 파일은 자동추가 안 함). 예약작업 `OwenLab V2 Git Sync` 5분·pythonw. 로그 `.git\v2-sync.log`.
- PC 별칭 `owenlabv2.pcLabel=클로PC`(로컬 git config, 10-22 15:00 형 지시). 자동커밋 제목 `[sync][클로PC] 시각`.
- 이 PC는 GCM(wincredman)이 비대화형 인증 실패 → 로컬 `credential.helper = !gh auth git-credential`(gh=nanumhn). 작성자 로컬 kihyo.park.
- 15:0x 형 지시로 폴더 교체 완료: OwenLab_V2=새 복제본(원격주소 반드시 `.git` 붙은 형식 — 없으면 STOP unexpected origin), 이전 폴더=`Obsidian\OwenLab_V2.bak-20261022`(삭제는 형 답 대기). 첫 rename 실패는 내 셸 cwd가 그 폴더였던 탓으로 보임[추측]. 협업 가이드 위치=`99 운영\AI 워커 협업 가이드.md`(읽음), 일지=`05 일지/YYYY/MM/` 일일기록 양식.
- ★V2에 새 노트(일지 등)를 만들면 승인목록 밖이라 자동 동기화 안 됨 + 추적 수 바뀌면 STOP. 새 파일 승인 방식·그 전 일지 위치·요약 편집 담당자 형 답 대기(10-22 15:13). 일지 cron ③ 경로는 아직 owenlab.
- 10-22 15:34 인수인계서 작성 완료: `03 AI 작업\2026-10-22-CLO-001_클로PC_재설정_인수인계.md`(gitignore로 미추적). 형 지시로 조사·보고만, 변경은 승인 대기(§8 결정 9항목: suno-helper 토큰 평문·권한수준·옛 덱스위임 폐기·새 지침 배치·백업 위치 등).
- 15:28 이 PC에서 Obsidian이 켜진 뒤 V2 파일 줄바꿈이 바뀌고 예약 동기화가 15:30 줄바꿈뿐인 커밋 3fbe491을 [sync][클로PC]로 푸시함(내용 차이 0). Obsidian이 V2를 열고 있으면 이런 커밋이 생길 수 있다[추측].
- ★10-22 16:45 동기화 정책 개선 적용(40527e9): 이제 8개 공유 폴더 안 새 `.md`는 자동 추가(보류 36개는 경로·내용해시로 제외). 인수인계서 d0fd9b0으로 GitHub 반영. 예약작업 재가동 16:50 OK.
- 옛→새 스크립트 전환 시 merge --ff-only가 Obsidian이 줄바꿈만 바꾼 파일 때문에 막혔음 → 형 승인 받고 V2 밖 백업(`_backup\OwenLab_V2-eol-20261022`) 후 해당 파일만 checkout 복원. 다음에도 같은 증상이면 CR 제거 해시 비교로 줄바꿈뿐인지 먼저 확인하고 형께 보고.
