---
name: project_dex_git_lock_root_cause_2026-08-06
description: 덱스(코덱스)가 git commit 못 하는 진짜 원인 — ACL 아니라 코덱스가 의도적으로 매 세션 .git에 DENY 심음. 형 결정 대기 중
metadata: 
  node_type: memory
  type: project
  originSessionId: d2a722cb-f20a-4853-9f06-cb9e30b71104
  modified: 2026-08-06T06:06:33.058Z
---

2026-08-06, cto-seojin이 실측으로 확인: 덱스가 `moa-studio`에서 git commit 시 `.git/index.lock` 권한거부가 나는 건 어제(08-05) 고친 ACL 상속 문제와 무관하다.

**진짜 원인**: 코덱스 CLI가 **의도적으로** 매 세션 시작 시 워크스페이스의 `.git` 폴더에 `(DENY)(W,D,Rc,DC)` ACE를 심는다(제한 토큰 샌드박스의 보안장치). 수동으로 DENY를 지워도 다음 세션이 다시 심는다 — ACL 수리로는 원리적으로 못 고침. `writable_roots`에 `.git` 추가해도 효과 없음(실측 확인).

**Why 이게 중요한가**: ACL 상속 수리(어제 19개 폴더)가 이 문제를 고쳤을 거라 기대했는데 아니었다 — 증상이 같아 보이는 별개 원인이 또 있었던 케이스([[reference_media_stack_2026-07]] 류의 "증상 같고 원인 다름" 패턴 반복).

**형 결정 대기 (3개 옵션, cto-seojin 추천 ②)**:
1. `~/.codex/config.toml`의 `sandbox = "elevated"` → `"none"` — git은 되지만 샌드박스 보안장치 자체가 사라짐
2. **(추천)** 브리지(제약 없음, `user`로 동작)가 커밋 대행 — 덱스가 `[[커밋: 메시지]]` 마커를 쓰면 브리지가 지정 경로만 `git add`+commit. 무관한 변경분 안 쓸어담게 경로 명시 강제
3. 현행 유지 — 덱스는 diff까지만, 커밋은 사람/다른 워커가

**How to apply**: 다음 세션에서 형이 답 주면 cto-seojin에게 ②(또는 선택한 옵션) 구현 위임. 급한 문제 아님 — 형이 "천천히 정해도 된다"고 판단.

관련: [[project_dex_jena_multiagent_2026-08-06]] [[project_obsidian_brain_overhaul_2026-08-06]]
