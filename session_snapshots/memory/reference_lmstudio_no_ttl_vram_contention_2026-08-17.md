---
name: reference_lmstudio_no_ttl_vram_contention_2026-08-17
description: "LM Studio 모델 TTL 미설정 → 유휴모델이 VRAM 무기한 점유, ComfyUI 등과 충돌"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5b69d1f6-1f0a-499b-a3c2-cae15069bb8f
  modified: 2026-08-16T22:02:49.005Z
---

2026-08-17 새벽, ComfyUI가 40분간 완전히 멈춘 사고의 진짜 원인은 media-head-siwoo의 프로세스 종료가 아니라 **LM Studio에 로드된 모델 2개(gemma-4-e4b 6.33GB, qwen2.5-7b-instruct 4.46GB)가 둘 다 IDLE인데 TTL이 없어서 영원히 안 내려가** VRAM(6GB) 대부분을 잡고 있었던 것. ComfyUI 가용 VRAM이 3,457MB → 316MB로 줄어 Flux가 시스템 RAM으로 밀려나며 이미지 1장 생성이 50초 → 11분24초로 늘어남.

gemma-4-e4b는 2026-06-13에 qwen2.5-7b로 이미 교체된 구모델([[reference_media_stack_2026-07]] 참고)인데도 로드된 채 방치돼 있었다.

**How to apply:** RTX 3060 6GB 노트북에서 회의(LM Studio)와 이미지 생성(ComfyUI)을 병행하는 구조라 이 충돌은 재발 가능. LM Studio 모델에 TTL(자동 언로드 시간)을 설정해두면 유휴 모델이 자동으로 VRAM을 반환해 재발을 막을 수 있음 — 아직 미착수, 다음에 여유 있을 때 처리. 급할 땐 `lms unload`로 유휴 모델 수동 언로드(회의 진행중인지 확인 후).
