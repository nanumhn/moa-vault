# Saju Tarot & Card Game — Decisions & Learning Log

> 정도현 COO · 2026-06-22 · 신규 사업 ②번 기획·구현 1차

## 결정 이력 (Decisions)

| # | 결정 | 근거 |
|---|---|---|
| D1 | 브랜드명 **CELESTIAL PILLARS** (Saju Tarot) / **FIVE PHASES** (game) | 四柱=Four Pillars 직역이 글로벌·신비 정합. 백업안 확보. **형 최종 결재 대기** |
| D2 | 타로 덱 = **78장 표준 구조**에 사주 매핑 (천간10+지지12=메이저22 정합) | Etsy/Printful 타로 카테고리 표준 호환 + "숫자 일치" 마케팅 무기 |
| D3 | **디지털 먼저** (PDF $19.9 / PnP $12.9) → POD → 구독/개인화 → Kickstarter | 저위험·빠른 현금화. 클라우드는 로컬 LLM 접근 불가라 자산 사전생성 |
| D4 | 어덜트 = 성적 X, **깊이·성숙·자기발견** | 형 지시 명확 + 메모리 feedback_user_value_first(공포마케팅 금지) |
| D5 | A 아트·세계관을 B(게임)가 재활용 | 제작비 절감, A=B의 퍼널·R&D |
| D6 | k-saju.me와 **완전 독립 브랜드/손익/도메인/결제** | 형 지시 |
| D7 | 샘플 생성 = SDXL base 1.0 / 832×1216 / 28step / dpmpp_2m+karras | 기존 gen_saju_images.py 검증 워크플로우 재활용 |

## 학습 노트 (Learning)

- **자산 재활용 성공**: `gen_saju_images.py`(k-saju 원소 이미지용)의 SDXL workflow+post/wait/save 로직이 타로 카드에 거의 그대로 이식됨. 신규 사업이라도 기존 ComfyUI 스크립트가 강력한 베이스. → 다음에도 ComfyUI 작업은 이 패턴 우선 복제.
- **ComfyUI 기동 함정**: `run_nvidia_gpu.bat`를 백그라운드 셸로 호출하면 새 콘솔로 분리되어 부모가 즉시 exit 0 반환 → 실제 미기동. **`python_embeded/python.exe -s ComfyUI/main.py --windows-standalone-build` 직접 호출**이 확실. 콜드스타트 모델로드 ~30s+, Monitor until-loop로 8188 대기.
- **품질**: SDXL base 1.0 + 골드프레임/인디고 코스믹 프롬프트 = 타로 톤 매우 우수(1장째부터 합격). 6GB VRAM에서 1216px 장당 48~72s. 텍스트 누출 0 (NEG에 text/letters/numbers 명시 효과).
- **세로비 832×1216**가 타로 카드(2:3)에 정합. 1024 정사각보다 카드용으로 우월.
- **카드 구성 인사이트**: 천간10+지지12=22가 타로 메이저22와 일치 → 이게 기획의 핵심 hook. 사주↔타로 융합 사업의 결정적 차별화 포인트로 재사용 가능.
- **하드웨어 제약 재확인**(reference_local_hardware_spec): 78장 풀덱 무인배치 = 약 1.5~3h. 야간 배치로 운용 권장. SGLang/12B 여전히 보류.

## 사후 추적 (형 결재 결과)

- [ ] 형 결재 통과 여부 — 결재 후 기입
- [ ] 채택된 브랜드명 (CELESTIAL PILLARS 확정 / 변경?)
- [ ] P1(A PDF 출시) 착수 승인 여부
