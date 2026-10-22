---
name: feedback_owenlab_v2_sync_workflow_2026-10-22
description: "랩실 V2 쓸 때 작업 전·후 기존 Sync-OwenLabV2.py로 동기화, 중복 실행·중복 등록 금지, 새 파일은 승인 후, 로컬저장/GitHub반영 구분 보고 (형 지시 10-22 15:46)"
metadata:
  node_type: memory
  type: feedback
  originSessionId: ce6bdb97-9b86-497d-a5e0-6927192eac4f
  modified: 2026-10-22T06:47:11.362Z
---

클로PC에서 랩실 V2(`D:\Develop\Claude_Channels\Obsidian\OwenLab_V2`)를 쓸 때 (형 지시 2026-10-22 15:46 디스코드):
- `99 운영/동기화/동기화 사용법.md`·`다른 PC 동기화 설치 가이드.md`를 따르고 **기존 `Sync-OwenLabV2.py`만** 쓴다. 다른 동기화 수단(Obsidian Git 등) 금지.
- 기존 5분 예약 `OwenLab V2 Git Sync`가 정상인지 먼저 보고, **중복 등록 금지**.
- **작업 시작 전·종료 후** 스크립트를 수동 실행해 결과(OK/STOP/SKIP)를 확인. `.git\v2-sync.lock`이 있으면(=실행 중) 중복 실행하지 않는다.
- 계정 nanumhn, PC 별칭 `owenlabv2.pcLabel=클로PC`.
- 충돌·안전검사 STOP이면 강제 진행(force push·reset·clean·검사 해제) 금지, 원인 보고.
- (16:45 갱신) 8개 공유 폴더 안 새 `.md`는 새 스크립트가 자동 추가한다. 그 밖의 파일·보류 36개는 여전히 제외 — 보고 때 "로컬 저장"과 "GitHub 반영(파일 해시 대조)"을 구분.

**Why:** 여러 PC·워커가 같은 볼트를 쓰므로 덮어쓰기·안전장치 우회를 막고, 형이 "올라갔다"를 오해하지 않게.
**How to apply:** V2 파일을 읽거나 쓰는 작업마다 앞뒤로 `python "...\99 운영\동기화\Sync-OwenLabV2.py"` (lock 확인 먼저). 관련: [[reference_owenlab_v2_sync_setup_2026-10-22]]
