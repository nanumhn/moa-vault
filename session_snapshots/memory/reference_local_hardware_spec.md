---
name: reference_local_hardware_spec
description: "This PC's GPU/RAM spec and the local LLM choice it constrains — check before any model/inference-backend decision"
metadata: 
  node_type: memory
  type: reference
  originSessionId: ee8b467e-df9e-45b7-958b-13a0479d9823
---

이 PC(모아 스튜디오 운영 머신) 사양 — 로컬 LLM·추론 백엔드 결정 시 항상 먼저 확인:

- **GPU:** NVIDIA RTX 3060 **Laptop** — VRAM **6GB** (driver 596.36). 이게 모든 로컬 모델의 상한선.
- **RAM:** 31.7GB
- **WSL:** 미설치 / **Docker:** 미설치 (SGLang·vLLM 같은 Linux/CUDA 서버형 백엔드는 이 둘부터 깔아야 함)

**6GB VRAM 현실 제약:**
- 12B는 Q4(7~8GB)도 초과 → 부분 CPU 오프로딩 아니면 못 올림.
- SGLang/vLLM은 모델을 통째로 VRAM에 올리는 구조라(CPU 분할 약함) 6GB엔 부적합. 게다가 회의는 소량 요청이라 SGLang의 동시처리 이점도 무의미 → **이 환경에선 SGLang 보류가 맞음**.
- LM Studio는 GPU+CPU 자동 분할이라 6GB에서도 7~8B Q4까지 잘 돌림.

**현재 회의 발화 모델 (2026-06-13~):** LM Studio `qwen2.5-7b-instruct` Q4_K_M (4.15GB VRAM, ~32 tok/s, 한국어 양호). gemma-4-e4b에서 교체. 엔진은 `clo_studio/meeting.py:get_active_model()`가 PREFERRED_MODEL 고정으로 선택. 관련: [[project_moa_lora_video_limit]]
