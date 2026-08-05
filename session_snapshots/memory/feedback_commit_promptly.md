---
name: feedback_commit_promptly
description: 코드 수정이 끝나면 커밋을 미루지 말고 바로바로 할 것
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 05eeca17-d953-4fd5-9b1a-332286749eca
  modified: 2026-08-05T00:55:48.571Z
---

형 지시(2026-08-05): "커밋은 바로바로 해야지." 아투 파이프라인에서 ~1,500줄(실제로는 7,845줄, 새 파일 포함)이 몇 주째 미커밋 상태로 쌓여있다가 발견된 직후 나온 말.

**Why**: 미커밋 상태로 오래 두면 디스크 문제 발생 시 운영 중인 실제 코드가 통째로 유실될 수 있다. 로컬 커밋만으로도 안전망이 되고, 별개로 원격 push는 상황에 따라(배포 트리거·심사 중 여부) 형 결재를 받으면 됨 — 하지만 **로컬 커밋 자체는 결재 없이 바로 하는 것이 기본**.

**How to apply**: 코드 수정 작업(직접 하든 본부장에게 위임하든)이 끝나면, 완료 보고 전에 먼저 커밋부터 한다. 관련 없는 잡동사니(백업 `.bak` 파일, 로그 json, Windows 리다이렉트 실수 파일 같은 것)는 커밋에서 제외하되 발견하면 형에게 존재를 알려준다. push는 여전히 상황 판단(라이브 배포 트리거인지, 심사/동결 중인지)해서 필요시 여쭤본다 — 커밋과 push는 다른 결정.

관련: [[reference_owenlab_git_push_gh_credential]] [[project_atz_image_mismatch_after_regen_2026-08-05]]
