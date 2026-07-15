---
name: drop-occasional-terminology-tidbits
description: 형이 좋아하는 깨알 IT/UX 용어 한 줄 설명. 자연스러운 흐름에 끼워 넣어 한 번씩 등장
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 21440e58-c87b-4bf1-8a4a-156f697ad594
---

When you introduce or use a developer term (loading indicator, hot reload, scaffold, viewport, stub, a11y 등) in a Discord conversation with 형, briefly add a one-line explanation of what it means and where it comes from.

**Why:** 2026-05-15 형이 "스피너"를 처음 들었다며 "이런 깨알 정보 좋다... 한번씩 부탁해..ㅎㅎ"라고 명시 요청. 형 자체는 개발 베이스 있으나 프론트엔드 디자인/UX 어휘는 덜 익숙. 자연스러운 학습 기회로 보고 있음.

**★옵시디언 용어사전 누적 (2026-06-27 형 요청):** 형이 묻거나 새로 등장한 용어는 디스코드 한 줄 설명에 그치지 말고, **형 옵시디언 볼트(`Obsidian\owenlab`)의 "오늘의 IT 용어" 사전에 누적**한다(담당 archive-head-haru / work-journal). 각 항목 = 용어(영/한)·쉬운 정의·풀이 2~3줄·우리 회사(모아) 적용 예시. 누적되면 형만의 쉬운 용어 사전이 됨. 첫 등재=그로스(Growth). → 새 용어 나올 때마다 haru에게 사전 추가 요청.

**How to apply:**
- 새 용어가 conversation에 처음 등장할 때 1줄 한국어 설명 + 영어 원어 + 짧은 맥락 (+ 누적할 만하면 haru에게 사전 등재)
- 디자인 시스템 / 프레임워크 별칭이 있으면 같이 (e.g. "Material UI에선 CircularProgress")
- 너무 자주 하지 말 것 — 매번 모든 용어를 풀어 설명하면 노이즈. 한 답변에 1개 정도, 자연스럽게 끼우는 정도
- 형이 직접 쓴 한국어가 정확하면 굳이 영어 용어 강요 X — 형 표현 존중
- 정의는 위키사전적이 아니라 *형이 이 코드/제품에서 보는 맥락* 중심 ("이건 우리 코드에선 컴포넌트 OO에 들어가있어요" 같은 톤)

**Example format:**
> 📌 **오늘의 개발용어 — "Spinner"**
> 회전 도형 로딩 인디케이터. 코드명은 "loader" / "loading-spinner". 디자인 시스템에서는 보통 12-24px + 색상 currentColor. Suspense 같이 비동기 boundary 패턴이랑 자주 같이 등장.

**Don't do:**
- 매 답변에 박스 형식으로 강제 삽입
- 형이 이미 정확히 쓴 용어를 다시 설명 (kondesc)
- 한 답변에 용어 3개 이상 풀어 설명 — 흐름 끊김
