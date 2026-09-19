---
name: reference_comfyui_needs_4min_after_boot_2026-09-19
description: 재부팅 직후 ComfyUI(8188)는 기동에 약 4분 걸린다 — 부팅 5분 안의 단발 측정으로 "죽었다"고 판정하지 말 것
metadata:
  type: reference
---

재부팅 직후 `moa-ai-servers-up`이 ComfyUI를 띄우는 데 **약 4분**이 걸린다.
실측(2026-09-19): `ai_servers_up.log` `[04:19:25] ComfyUI down → 기동` → `[04:23:32] 상태 ComfyUI=UP`, **4분 7초**.

**하지 말 것**: 부팅 후 5분 안에 8188을 **한 번** 재고 "안 떴다"고 보고하는 것.
2026-09-19 04:23:0x에 내가 그렇게 했고, **26초 뒤 200**이 됐다. 형께 🔴로 올렸다가 바로 정정해야 했다.

**할 것**: 8188 판정 전에 `C:\Users\user\.moa\ai_servers_up.log` 를 먼저 읽는다.
`ComfyUI down → 기동` 줄만 있고 `상태 ... ComfyUI=UP` 줄이 아직 없으면 그건 **"죽음"이 아니라 "기동 중"** 이다.
[[feedback_pinocchio_clo_dont_assert_without_checking]] · 쉐어룰 4번(안 보임 ≠ 없음)이 그대로 걸리는 자리다.

**★같이 봐야 할 위험**: 관리자 잡 `moa-ai-servers-up`의 `timeoutMs=300000`(5분)이 이 4분짜리 기동을 **아슬아슬하게 자른다**.
2026-09-19은 lastStarted 04:18:34 · lastFinished 04:23:33 로 **1초 남기고** 통과했다.
2026-09-18 오전에는 이 절단이 실제로 ComfyUI를 죽여 아투 오전 결번을 만들었다 — [[project_atz_20260918_am_zero_predicted_and_lost]].
수리(타임아웃 상향)는 결재 `REQ-20260918-COMFY-01` 로 형 답 대기 중.
