---
name: Moa Studio Phase memo — deferred features
description: Consolidated backlog of "nice to add later" features for Moa Studio. User wants these batched into future phases rather than ad-hoc adds.
type: project
originSessionId: 8c0330e2-674a-4bf5-b00a-4c79a2540161
---
User explicitly asked to keep these grouped so they can be implemented as bundles, not piecemeal.

**Why:** Avoid drip-feed implementation that breaks focus. Plan a "Phase 5: Voice & Polish" or similar release that ships several related items at once.

**How to apply:** When user proposes a new feature that's not blocking, add it here under the right category. When entering Phase 5/6 planning, review this whole memo together. When implementing, group by category to share infrastructure.

## 🎵 Audio / Voice
- **캐릭터별 TTS 음성** — ElevenLabs(유료, 자연스러움) / Coqui TTS·Bark(로컬, 무료, 4-6GB) 옵션. 캐릭터 yaml에 voice_profile 필드 추가. 회의 콘솔(8080)에 발언 재생 버튼. (Task #18)
- **회의실 효과음 + 실시간 듣기 모드** — 발언 시작 chime, 회의 시작/종료 효과음. (Task #19)

## 🎬 Meeting / Org
- (없음 — 추가되면 여기)

## 📱 Shorts / Vertical Output
- **세로 썸네일 + Shorts 영상** (1080×1920) — 현재 Stage 4 썸네일은 1280×720 가로 (YouTube 메인용). Shorts용 별도 9:16 변형 필요. 같은 Suno 커버 + 텍스트 오버레이 룰 재활용. (2026-05-15 형 제안)
- **사운드 이퀄라이저 시각화** — 오디오 파형/주파수 스펙트럼을 영상에 합성. Web Audio API analyser 또는 FFmpeg `showspectrum`/`showwaves` 필터. Shorts/세로 영상에 특히 어울림. (2026-05-15 형 제안)

## 🎚️ Audio Production
- **Suno 자동화 v2** — Chrome 확장의 content script가 Suno UI 변경에 너무 취약. Playwright/Puppeteer 헤드리스 Chromium 또는 비공식 API 리서치. (Task #16)
- **큐 취소/삭제 UI** — /suno 카드 ··· 메뉴 → 🚫 취소 / 🗑️ 삭제 + 확인 다이얼로그. (Task #15)

## 🖥️ UI / UX
- **모바일/태블릿 반응형** — 현재 데스크탑 기준만 잘 보임
- **권한/보안 강화** — 현재 누구나 /suno, /meetings 접근 가능. NextAuth 세션 가드 추가.
- **픽셀 오피스 디자인 외주** (2026-06-01) — 클로가 만든 1차 픽셀 오피스(`/office`, LimeZu 기반)가 형 레퍼런스(다중 방 구획 + 풍부한 가구) 수준에 못 미침. 형 결정: "픽셀 전문가 고용해서 픽셀 오피스 구성 요청". AI 기반 자동화/시스템 통합은 클로 강점, 픽셀 아트 디자인은 사람 전문가가 잘. 외주 결과물(타일맵 + 가구 배치) 받으면 우리 Phaser 코드에 통합은 클로가 빠르게 가능. 현재 `app/(main)/office/pixel-office.tsx`가 베이스.

## ⚡ Performance
- **GPU torch + audio-separator** — 31분 → 3-6분으로 단축 (이미 GPU 셋업 끝, 벤치마크 대기 중. 완료 시 이 항목 삭제)

## 🔗 Integration (later)
- **3000 ↔ 8080 통합** — 사용자 결정: "더더더 뒤에 고민". 현재는 단방향 outlink만.
- **회의 ↔ Suno 자동 연결** — 회의에서 결정한 곡 정보를 큐에 자동 enqueue. 평가 피드백을 다음 회의 인풋으로.

---

Maintenance: add new ideas as user mentions them; remove items when implemented; if a category grows past 5 items consider splitting.
