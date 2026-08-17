---
name: reference_lmstudio_no_ttl_vram_contention_2026-08-17
description: "LM Studio 모델 TTL 미설정 → 유휴모델이 VRAM 무기한 점유, ComfyUI 등과 충돌. 원인=ConnectAILab(미사용 프로젝트)의 gemma 하드코딩, 해당 폴더 제거로 해결"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 5b69d1f6-1f0a-499b-a3c2-cae15069bb8f
  modified: 2026-08-17T12:52:13.754Z
---

2026-08-17 새벽, ComfyUI가 40분간 완전히 멈춘 사고의 진짜 원인은 media-head-siwoo의 프로세스 종료가 아니라 **LM Studio에 로드된 모델 2개(gemma-4-e4b 6.33GB, qwen2.5-7b-instruct 4.46GB)가 둘 다 IDLE인데 TTL이 없어서 영원히 안 내려가** VRAM(6GB) 대부분을 잡고 있었던 것. ComfyUI 가용 VRAM이 3,457MB → 316MB로 줄어 Flux가 시스템 RAM으로 밀려나며 이미지 1장 생성이 50초 → 11분24초로 늘어남.

gemma-4-e4b는 2026-06-13에 qwen2.5-7b로 이미 교체된 구모델([[reference_media_stack_2026-07]] 참고)인데도 로드된 채 방치돼 있었다.

**How to apply:** RTX 3060 6GB 노트북에서 회의(LM Studio)와 이미지 생성(ComfyUI)을 병행하는 구조라 이 충돌은 재발 가능. LM Studio 모델에 TTL(자동 언로드 시간)을 설정해두면 유휴 모델이 자동으로 VRAM을 반환해 재발을 막을 수 있음. 급할 땐 `lms unload`로 유휴 모델 수동 언로드(회의 진행중인지 확인 후).

**★2026-08-17 오후 — gemma를 계속 불러온 진짜 원인 찾아 해결함.** gemma-4-e4b를 로드시킨 건 모아 프로젝트가 아니라 `D:\Develop\ConnectAILab\brain\_company\_shared\agent_models.json`이었다 — ceo·secretary·유튜브·리서처 등 9개 역할이 전부 gemma-4-e4b로 하드코딩돼 있었고, 이 프로젝트가 LM Studio를 호출할 때 TTL을 안 넘겨서 한번 뜨면 안 꺼졌다. 형이 "ConnectAILab는 사용 안 하는 것"이라고 확인해줘서 완전삭제 대신 `D:\Develop\_archive\ConnectAILab_removed_2026-08-17`로 이동(git 미관리 폴더라 삭제하면 복구 불가라 보존). 이제 gemma를 부를 주체 자체가 없어졌으므로 이 VRAM 충돌은 재발하지 않을 것으로 예상. (윈도우 작업스케줄러엔 이 폴더를 참조하는 항목 없음 확인함.)
