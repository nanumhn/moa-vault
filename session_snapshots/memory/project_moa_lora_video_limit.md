---
name: MOA LoRA + anime video produces weak results
description: Photo-trained LoRA combined with anime style + LTX-Video on 6GB gives weak output; user labeled it "별루네"
type: project
originSessionId: 6d056bc2-1444-43e6-921c-39ae15de982f
---
The MOA face LoRA (`moa_lora_v1.safetensors`, `moa_lora_v2.safetensors`) was trained on photo-realistic Korean woman portraits using SDXL base. When combined with anime-style prompting and animated via LTX-Video 2.3 at 480×704 on 6GB VRAM, the result was unsatisfying — user explicitly said "로라에게 영상 생성은 무리였네. 별루네." after the rainy-window attempt on 2026-05-09.

**Why:** Three layered constraints stack:
1. SDXL base model produces photorealistic by default; anime tags only "stylize" but don't transform.
2. LoRA face features were trained on photos, so they don't compose cleanly with anime cel-shading.
3. LTX-Video at 480×704 is low resolution and motion is limited on 6GB VRAM.

**How to apply:** Don't propose "trained MOA LoRA → anime video" as a happy-path workflow. If user wants anime-style MOA video, recommend either: (a) re-training MOA LoRA on top of an anime-finetuned base (AnimagineXL, NoobAI XL, Pony) — needs new base download and re-training; (b) using existing MOA LoRA only for photorealistic videos. For real video quality on 6GB, also flag that Wan 2.2 / Hunyuan are alternatives to LTX-Video at the cost of slower inference.
