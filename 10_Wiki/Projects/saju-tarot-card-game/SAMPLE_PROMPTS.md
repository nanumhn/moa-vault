# Saju Tarot — ComfyUI 카드 프롬프트 30장 (SAMPLE_PROMPTS)

> 작성: 정도현 COO · 2026-06-22 · 브랜드: CELESTIAL PILLARS
> 모델: SDXL base 1.0 / 해상도 832×1216 (타로 세로비) / steps 28 / cfg 7.0 / dpmpp_2m + karras
> 구성: **오행 5 + 천간 10 + 지지 12 + 표지·뒷면·보너스 3 = 30장**
> 각 항목 = `name | seed | positive prompt (공통 STYLE/NEG는 하단 고정 토큰 자동 append)`

---

## 0. 공통 토큰 (모든 카드에 append)

**STYLE (positive 뒤에 붙임):**
```
tarot card illustration, mystical Korean Eastern astrology, ornate golden frame border,
deep indigo night sky, gold accents, starfield, nebula, constellations, ethereal glow,
ink-wash meets cosmic, elegant premium spiritual art, highly detailed, symmetrical composition,
no text, no letters, no words, no watermark
```

**NEG (전 카드 공통):**
```
text, letters, words, numbers, watermark, signature, ugly, low quality, blurry, deformed,
extra limbs, modern objects, photo, nsfw, cartoon, childish
```

---

## 1. 오행 5원소 (Five Phases — Major tone) · seed 10xx

| # | name | seed | positive (앞부분) |
|---|---|---|---|
| 1 | element_wood | 1011 | THE WOOD PILLAR, a luminous celestial tree of life, jade green vital energy, glowing leaves, spring growth |
| 2 | element_fire | 2022 | THE FIRE PILLAR, a cosmic phoenix rising in crimson and gold flame, radiant embers, summer zenith |
| 3 | element_earth | 3033 | THE EARTH PILLAR, a golden sacred mountain at the center, amber ochre earth energy, ancient stable stone, balance |
| 4 | element_metal | 4044 | THE METAL PILLAR, a silver crescent moon and a sharp ritual blade, white-gold metallic serene light, autumn clarity |
| 5 | element_water | 5055 | THE WATER PILLAR, flowing cosmic ocean waves under a starry sky, deep sapphire blue wisdom energy, winter depth |

---

## 2. 천간 10 (Heavenly Stems — Major Arcana I~X) · seed 11xx

> 천간 = 하늘의 기운 10. 각 천간의 오행·음양을 비주얼화.

| # | name | seed | positive (앞부분) |
|---|---|---|---|
| 6 | stem_gap (甲 Yang Wood) | 1101 | THE GREAT OAK, a towering ancient pillar tree piercing the heavens, yang wood, jade and gold, commanding majesty |
| 7 | stem_eul (乙 Yin Wood) | 1102 | THE CLIMBING VINE, graceful flowering vines spiraling to the stars, yin wood, soft green and gold, gentle resilience |
| 8 | stem_byeong (丙 Yang Fire) | 1103 | THE SOVEREIGN SUN, a blazing cosmic sun crowned with corona, yang fire, radiant crimson gold, supreme brilliance |
| 9 | stem_jeong (丁 Yin Fire) | 1104 | THE SACRED LANTERN, a single eternal candle flame in the dark void, yin fire, warm amber glow, intimate illumination |
| 10 | stem_mu (戊 Yang Earth) | 1105 | THE GREAT MOUNTAIN, a vast immovable golden peak under the cosmos, yang earth, ochre and gold, eternal stability |
| 11 | stem_gi (己 Yin Earth) | 1106 | THE FERTILE FIELD, soft glowing terraced soil nurturing seeds of light, yin earth, warm amber, quiet nourishment |
| 12 | stem_gyeong (庚 Yang Metal) | 1107 | THE CELESTIAL SWORD, a gleaming forged blade of starlight, yang metal, sharp white-gold steel, decisive power |
| 13 | stem_sin (辛 Yin Metal) | 1108 | THE JEWELED ORNAMENT, a delicate silver pendant with a luminous gem, yin metal, refined white and gold, precious beauty |
| 14 | stem_im (壬 Yang Water) | 1109 | THE COSMIC OCEAN, a vast surging starlit sea, yang water, deep sapphire and gold foam, boundless flow |
| 15 | stem_gye (癸 Yin Water) | 1110 | THE GENTLE RAIN, soft luminous mist and dew descending from constellations, yin water, dark blue silver, quiet wisdom |

---

## 3. 지지 12 (Earthly Branches / Zodiac — Major Arcana XI~XXII) · seed 12xx

> 지지 12 = 12지신(쥐·소·호랑이…). 동양 조디악을 코스믹 타로 톤으로.

| # | name | seed | positive (앞부분) |
|---|---|---|---|
| 16 | branch_ja (子 Rat) | 1201 | THE MIDNIGHT RAT, a clever celestial rat among silver stars, midnight water, beginning of the cycle, cunning grace |
| 17 | branch_chuk (丑 Ox) | 1202 | THE PATIENT OX, a mighty cosmic ox of golden earth, steady horns wreathed in nebula, enduring strength |
| 18 | branch_in (寅 Tiger) | 1203 | THE BLAZING TIGER, a fierce celestial tiger wreathed in green-gold flame, yang wood courage, leaping power |
| 19 | branch_myo (卯 Rabbit) | 1204 | THE MOON RABBIT, a serene jade rabbit beneath a luminous full moon, yin wood, gentle elegance, lunar calm |
| 20 | branch_jin (辰 Dragon) | 1205 | THE CELESTIAL DRAGON, a magnificent gold-and-azure dragon coiling through constellations, yang earth, divine majesty |
| 21 | branch_sa (巳 Snake) | 1206 | THE MYSTIC SERPENT, a luminous coiled snake of starlight, yin fire, hidden wisdom, hypnotic spirals |
| 22 | branch_o (午 Horse) | 1207 | THE GALLOPING HORSE, a radiant cosmic horse charging across the fire heavens, yang fire, free spirited vigor |
| 23 | branch_mi (未 Goat) | 1208 | THE GENTLE GOAT, a peaceful celestial goat among golden clouds, yin earth, artistic serenity, soft glow |
| 24 | branch_sin (申 Monkey) | 1209 | THE CLEVER MONKEY, a witty silver monkey leaping among metallic stars, yang metal, ingenuity and play |
| 25 | branch_yu (酉 Rooster) | 1210 | THE DAWN ROOSTER, a proud golden rooster heralding cosmic sunrise, yin metal, precision and pride |
| 26 | branch_sul (戌 Dog) | 1211 | THE LOYAL DOG, a noble guardian dog beneath the earth-gold heavens, yang earth, loyalty and protection |
| 27 | branch_hae (亥 Pig) | 1212 | THE ABUNDANT PIG, a content celestial boar amid flowing water and stars, yin water, generosity and abundance |

---

## 4. 표지 · 뒷면 · 보너스 3장 · seed 19xx

| # | name | seed | positive (앞부분) |
|---|---|---|---|
| 28 | cover_hero | 1901 | CELESTIAL PILLARS cover art, the four pillars of destiny rising as luminous columns, zodiac constellation wheel, indigo and gold cosmic panorama, serene premium hero composition |
| 29 | card_back | 1902 | tarot card back design, perfectly symmetrical mandala of five elements and twelve zodiac, ornate gold filigree on deep indigo, seamless repeating sacred geometry, no central figure |
| 30 | bonus_earth_void (土 The Void) | 1903 | THE EARTH PILLAR OF THE CENTER, a radiant golden void mandala at the cosmic center, the fifth phase uniting all, supreme balance, ouroboros of five elements |

---

## 5. 운용 노트

- **재현**: seed 고정 → 동일 결과. 리롤 필요 시 seed+1 권장(SAMPLE_PROMPTS 본표 시드는 마스터로 고정).
- **배치 실행**: `gen_tarot_samples.py`의 `ITEMS` 리스트를 위 30개로 교체 → 순차 무인 배치(6GB VRAM, 장당 30~90s → 전체 약 30~45분).
- **POD 마스터**: 합격분 832×1216 → 2x upscale(1664×2432, 300DPI) 후 프레임·카드명 합성(PIPELINE §1.3).
- **품질 게이트**: 200KB↑, 텍스트 누출 없음, 골드 프레임·코스믹 톤 일관성. 불합격 리롤.
- **확장(78장 풀덱)**: Minor Arcana 40(4슈트×1~10) + Court 16은 동일 STYLE에 슈트 모티프(목=완드/화=소드 등) 추가로 생성 — 본 30장은 Major(천지오행) + 표지 우선 세트.
