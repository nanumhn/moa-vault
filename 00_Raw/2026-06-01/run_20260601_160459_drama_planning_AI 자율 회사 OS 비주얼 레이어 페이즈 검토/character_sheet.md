# 캐릭터 시트 — 황혼의 오후

## 인물별 비주얼 설정
*   **강시우:** 30대 후반, 깔끔하게 정돈된 짧은 머리(Dark Brown), 포멀한 네이비 계열 재킷/셔츠. 날카롭지만 피곤함이 배어 있는 눈매. 체형: 보통, 단정한 실루엣.
    *   *고정 시드:* 45672109
    *   *영문 프롬프트:* A man in his late 30s, neat dark brown short hair, wearing a tailored navy blazer and shirt. Sharp eyes with subtle signs of fatigue. Full body shot, cinematic lighting.

*   **이서아:** 20대 후반, 차분한 긴 생머리(Ash Blonde), 부드러운 아이보리/베이지 니트웨어. 청초하고 사려 깊은 인상. 체형: 가녀리고 유연함.
    *   *고정 시드:* 89123456
    *   *영문 프롬프트:* A woman in her late 20s, long ash blonde straight hair, wearing a soft ivory/beige knitwear. Delicate and thoughtful expression. Mid-shot, natural diffused light.

*   **주요 인물 C (Placeholder):** 30대 초반, 어깨까지 오는 웨이브 머리(Chestnut Brown), 루즈핏의 빈티지 코트. 따뜻하지만 감정을 숨기고 있는 듯한 눈빛. 체형: 슬림하고 활동적임.
    *   *고정 시드:* 10987654
    *   *영문 프롬프트:* A man/woman in his early 30s, shoulder-length chestnut brown wavy hair, wearing a loose vintage coat. Eyes that seem warm but hide emotion. Full body shot, soft ambient light.

## 일관성 유지 규칙
**[필수 준수 사항]**
1.  **시드 고정:** 모든 주요 인물은 해당 시트에서 지정된 **고정 시드(Seed)**를 컷에 관계없이 강제 적용해야 합니다. 이는 캐릭터의 골격과 미세한 특징을 통일하는 최소 단위입니다.
2.  **LoRA 활용 의무화:** 각 인물의 얼굴 구조, 헤어스타일은 전용 LoRA 모델로 학습시켜 모든 프롬프트 생성 시 *반드시* 호출해야 합니다. (Ex: `[CharacterName]_v1_lora`)
3.  **레퍼런스 기반 앵글 제한:** 캐릭터의 표정 변화 범위(Emotional Range)와 각도(Angle)는 사전에 지정된 레퍼런스 이미지 내에서만 허용합니다. 과도한 클로즈업이나 측면 구도는 비주얼 검토를 거쳐야 합니다.
4.  **체크리스트:** 매 컷마다 ①시드 일치 ②LoRA 적용 ③의상 디테일 확인을 의무화하고, 특히 '손과 눈빛'에 대한 디테일 체크가 가장 중요합니다.

## 배경/팔레트 통일
*   **주요 컬러 팔레트 (Primary Palette):**
    *   웜 그레이 (Warm Gray): `#B8A69D` (따뜻한 중립색, 아련함)
    *   뮤트 블루 (Muted Blue): `#7A8FA0` (거리감, 결핍의 색)
    *   세피아 톤 (Sepia Tone): `#C4B39F` (시간의 흐름, 회상)
*   **전체 무드/톤:** 낮은 채도(Low Saturation), 부드러운 명암 대비(Soft Contrast). 모든 배경은 '빛이 드리워진 오후'와 같은 은유적 시간대를 공유해야 합니다.