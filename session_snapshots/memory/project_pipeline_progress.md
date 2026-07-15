---
name: pipeline-progress-2026-05-15
description: "End-to-End music pipeline (사용자 한 문장 → YouTube) progress snapshot. Where we are, what works, what's broken, what's next."
metadata: 
  node_type: memory
  type: project
  originSessionId: 066b8f6f-a78f-4979-893b-5a9c9176b8cf
---

End-to-End 자동화 파이프라인 (사용자 한 문장 → 곡 기획 → Suno → 마스터링 → 영상 → YouTube) 진행 상황 스냅샷.

**Why:** This pipeline spans many sessions, multiple repos (moa-studio, clo_studio chrome-extension), and several stalled subproblems (Suno DOM selectors, MCP setup). A future session needs the lay of the land to pick up without re-discovering.

**How to apply:** When the user references "Stage X" or asks where we left off on Moa Studio's auto pipeline, start here. Then verify against current code (memory is point-in-time).

## 완료된 Stage

- **Stage 1 — Brief 생성**: `/auto/new` UI + `POST /api/auto/brief` → 이서아(A&R) 페르소나로 LLM 호출 (LM Studio gemma-4-e4b, 32K context). 결과는 `SongBrief` Prisma 테이블에 영구 저장. 히스토리: `/auto`, 상세: `/auto/[id]`. **랜덤 프리셋 5개 + 🎲 다시 버튼** 있음.
- **Stage 2 — Brief → Suno 큐잉**: 상세 페이지의 🎵 버튼이 `POST /api/auto/briefs/[id]/queue-suno` 호출. `lib/auto/brief-to-suno.ts`가 trackConcept 수만큼 SunoJob을 생성 (title/style/prompt). Chrome 확장이 polling → suno.com/create 자동 입력 + Create 클릭까지 검증됨.
- **Stage 3 전체 — audioUrl 자동 회수 + 자동 마스터링** (2026-05-14 완료): claim → 폼 작성 → Create → 생성 대기 → cdn1 URL 자동 회수 → 자동 마스터링까지 손 안 댐. E2E 1분 22초 측정 (reset → mastered.mp3). 수동 fallback은 `/api/suno-ext/manual-complete`에 여전히 있음.
- **Stage 4 — 자동 썸네일** (2026-05-15 완료): Suno 커버 (cdn2.suno.ai/image_large_<UUID>.jpeg) + Sharp/SVG 오버레이 → 1280×720 jpg. KO-aware text wrap, 우측-하단 앵커 (킥커+헤드라인 동시 우측정렬), 좌측-상단 "♬ MOA STUDIO" 워터마크 26pt. 잡 평균 0.8~1.6초.
- **Stage 5 — 자동 영상** (2026-05-15 완료): 썸네일 + 마스터 오디오 → ffmpeg filter_complex (scale 1280×720 정지 배경 + showwaves cline 250×250 좌측-하단 오버레이). 잡 평균 13~18초. 폴백: 썸네일 없으면 솔리드 보라 배경.
- **Stage 1~5 풀 E2E 무인 자동화 검증** (2026-05-15 14:46): brief → queue → claim → audioUrl + imageUrl → master → thumb → video, **0 manual intervention, 총 2m 3s**. 회귀 1건 잡음: content.js의 `runJob()` 반환에 `imageUrl: track.imageUrl` 누락 → JSON.stringify가 undefined 드롭 → DB null. 패치 0.2.2.

### Stage 3 자동화 셀렉터 (Suno 2026-05-14 UI)
- 클립 행: `[data-testid="clip-row"][data-clip-status]` (placeholder 스켈레톤은 `data-clip-status` 없음으로 제외)
- 행 컨테이너: `.clip-browser-list-scroller` → fallback `[role="rowgroup"]`
- 클립 UUID: row 내부 `a[href^="/song/<UUID>"]`의 href; fallback은 `img[data-src*="image_large_<UUID>"]`
- 오디오 URL: `https://cdn1.suno.ai/<UUID>.mp3` (HEAD 200, audio/mp3 확인)
- 완료 시그널: `data-clip-status="complete"` (`submitted` / `queued`는 미완)

## 그 외 알아둘 것

- **사용자 Pro 구독함** (2026-05-15) — Advanced 탭 사용 가능. `data-trigger-disabled=""`은 base-ui 내부 플래그라 Pro 락이 아님 (전 탭에 다 붙어있음).
- **Suno UI는 한국어**. placeholder 패턴 매칭은 불안정. **maxlength 기반 셀렉터 권장**:
  - `textarea[maxlength="1000"]` → Style of Music (Advanced)
  - `textarea[maxlength="3000"]` → Simple "Describe the sound"
  - `textarea[maxlength="5000"]` → Lyrics (Advanced) (`data-testid="lyrics-textarea"`도 안정)
  - `input[placeholder="Song Title (Optional)"]` → Title (Advanced, 영어 placeholder 그대로)
- **확장 코드 변경 후 reload 필수** — `chrome://extensions` → Moa Studio Bridge → 🔄. 매니페스트 자동 주입에 의존하니 새 파일 추가 시 dev server도 재시작 필요 (Turbopack이 새 route 안 잡음).
- **MV3 SW 캐싱 함정**: `chrome://extensions` reload만으로는 service worker가 옛 코드로 굴러갈 수 있음 (특히 `background.type=module`). 증상은 background.js의 에러 메시지에 새로 추가한 prefix가 없는 식. 해결: manifest.json `version` 한 단계 bump + `"type": "module"` 제거하면 강제 reinstall. content_scripts 자동 주입도 같은 사유로 안 먹히는 경우 있어 background.js에서 `chrome.scripting.executeScript`로 defensive 주입 + content.js의 `window.__moaBridgeContentLoaded` 가드가 중복 방지.

## 백로그 (Stage 4+) — 실행 순서로 번호 재정렬됨 (2026-05-15)

원래 4=영상 / 5=썸네일이었지만 썸네일이 영상에 들어가는 의존성이 있어서 실행 순서(썸네일 → 영상)에 맞춰 번호 스왑함. 회의 산출물·이전 메모에 옛 번호가 남아있을 수 있으니 주의.

- **Stage 4: 썸네일 자동 생성** — SDXL/Flux 메인, T2V는 보조. 영상 클라이맥스 프레임에서 추출 → 텍스트 오버레이(황금비율). 회의 산출물: `clo_studio/output/run_20260515_100115/visual_pipeline.md` (옛 번호로 기록됨).
- **Stage 5: 영상 합성** — 감정 아크 기반 4~5개 구간 분할, 사운드 기반 구조 편집 (naive 비트싱크 X), 구간별 컬러팔레트 자동 매핑. FFmpeg 코덱·트랜지션 + 외부 색보정. 인트로/엔딩에 Stage 4 썸네일 삽입.
- **Stage 6: YouTube 업로드 + SEO** — 질문형 Hook 제목, 트랙리스트 타임스탬프 의무, LLM 기반 태그(Genre Core + Niche Use Case), Peak Engagement Time 자동 스케줄링. `/api/youtube/upload` 라우트 기존 존재. 회의 산출물: `youtube_upload_spec.md` (같은 run).
- **Stage 7: 보고 단계** — 결과 채널 (Discord/Email) 알림 + 메타 요약.

회의 결정사항 풀텍스트: `clo_studio/output/run_20260515_100115/` (Stage 5→4→6 + SEO 토론, 7개 산출물).
이전 pipeline_design 회의 (전체 stage 정의): [[pipeline_design_artifacts]] (`clo_studio/output/run_20260514_010757/`).
