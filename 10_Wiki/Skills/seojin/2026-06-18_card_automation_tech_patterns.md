---
date: 2026-06-18
agent: seojin
skill_type: tech_pattern
trigger: next/og 카드 렌더링·로컬 자동화·Vercel 배포·Windows 스케줄러 작업 시
confidence: high
auto_apply: true
---

# 카드 자동화 기술 패턴 모음 (next/og · ComfyUI · Win 스케줄러)

## 무엇 (한 줄)
데일리 타로 카드 + 정기검사 구축 중 통한 재사용 기술 패턴 6종.

## How to apply

### 1. Docker pull은 에이전트 셸에서 막힘 → 형이 직접
이 PC에서 내 Bash로 `docker pull/run`(이미지 받기)이 `docker-credential-desktop` "A specified logon session does not exist"로 실패(헬퍼가 형 인터랙티브 세션에 묶임). credsStore 제거·격리 config·logout 다 무효. **이미지 받는 작업은 형에게 `! docker run ...`로 요청.** `docker ps/logs/exec`(로컬 데몬)는 내 셸 OK.

### 2. next/og 배경 위 텍스트 가독성
배경 아트 위 텍스트는 ① 어두운 스크림 그라데이션(transparent→dark) ② 반투명 패널(rgba ~0.5) ③ 텍스트 그림자 3중으로. **오버레이 과하면 아트가 묻힘** — radial 오버레이는 0.15(중심)→0.5(가장자리) 수준이 적정. `<img>` 절대배치 fill + `objectFit:cover`, 카드 클립은 부모 `overflow:hidden`+`borderRadius`.

### 3. Vercel 배포 왕복 줄이기 = sharp 로컬 시뮬
배포(2~3분)마다 톤 확인하지 말고, `sharp`로 SVG(배경 base64 image + 오버레이 + 패널 + 텍스트) 합성해 로컬 미리보기로 opacity/레이아웃 잡은 뒤 1회 배포. resvg-js/sharp 둘 다 bun으로 즉시 설치.

### 4. next/og 커스텀 CJK 폰트 = 서브셋 + fetch
붓글씨 등 CJK 폰트는 통째(수MB) 말고 **쓰는 글자만 서브셋**(`python -m fontTools.subset --text="甲乙..."`, 27자 16KB). `public/fonts/`에 두고 route에서 `await fetch(\`${origin}/fonts/x.ttf\`).then(r=>r.arrayBuffer())` → `ImageResponse(..., {fonts:[{name,data,...}]})`, CJK 엘리먼트에 `fontFamily` 지정. Ma Shan Zheng = OFL(상업무료).

### 5. PowerShell 5.1 .ps1은 UTF-8 BOM 필수
BOM 없는 UTF-8 .ps1은 PS5.1이 ANSI로 읽어 한글/이모지 깨짐→파싱 실패. Write 도구는 BOM 없이 저장하므로, Bash로 `printf '\xEF\xBB\xBF' > t; cat f >> t; mv t f`로 BOM 프리펜드. (Edit 후 BOM 유지되는지 재확인.)

### 6. Discord/IG 이미지 임베드 캐시버스트
같은 URL 이미지는 Discord가 캐시 → 매일 바뀌는 카드인데 어제 게 뜸. URL에 `&d=<date>` 등 날짜 파라미터 붙여 일별 유니크하게.

## 관련
- [[2026-06-18_n8n_daily_tarot_card_marketing]]
- 정기검사: `C:\Users\user\.moa\moa_healthcheck.ps1`(Win 스케줄러 MoaHealthCheck, 하루 3회). 게시판 글수는 HTML `Total N` 정규식 파싱 + state json 증감추적.
