# Daily Saju Card — 3~4줄 리딩 풀 (오행 5 × 6편 = 30편)

- 작성: 콘텐츠마케팅본부장 이서아 / 2026-07-08
- 용도: `saju-studio` 데일리 카드 이미지 본문 + 인스타 캡션. 룰기반(LLM 없이 Vercel 렌더).
- 구조: 각 reading = ① 훅 한 줄 → ② 오행 풀이 2~3문장 → ③ 부드러운 실천 조언 1문장. 줄바꿈은 `\n`.
- 톤 기준: 기존 `COPY[el].bodies` 결 계승(신비롭지만 담백·실용). 점술 클리셰·공포·과장·수치 단정 금지.
- **접근성(2026-07-08 방향 조정): 타깃=글로벌 영어권, 비원어민 다수. 감성은 살리되 첫 읽기에 바로 이해되는 쉬운·명료한 영어. 난해한 문학·시적 어휘와 모호한 은유 배제, 쉬운 단어+선명한 이미지 우선. (예: supple→soft, spectacle→flashy, hoard→keep, restorative→restful 등으로 순화.)**
- 자기완결: 어느 날(음/양 일진 무관) 뽑혀도 성립. 특정 인물/성별/종교색 없음.
- 도메인 면책: 서비스 전반은 entertainment & self-reflection 목적(전문 조언 아님). 개별 리딩엔 면책문을 넣지 않고 톤으로 담백하게 유지 — 면책은 페이지/캡션 하단 고정문에서 처리.

## 서진이 코드에 넣을 형태 (route.tsx `COPY[el]`에 `readings` 필드 추가)

```ts
const READINGS: Record<Element, string[]> = {
  wood: [
    "Every big tree started as a seed.\nWood energy is about starting small. What you begin today may look tiny now, but that is how roots grow — quietly, out of sight.\nPick one small goal today and let that be enough.",
    "Start before you feel ready.\nWood grows toward the light without waiting for permission. The step you keep putting off will not get easier by waiting — only by starting.\nTake one small step forward today.",
    "Growth is quiet before you can see it.\nA Wood day rewards patience, not pressure. A lot is happening under the surface right now, even when nothing shows yet.\nCare for the small thing today and give it time to grow.",
    "Reach up, but keep your roots.\nWood teaches that tall things need deep roots. Big plans feel good today, but they last only when they stand on something real.\nAim high, and stay honest about what holds it up.",
    "A plan beats a rush today.\nWood energy likes a clear direction. Knowing where you want to go matters more than how fast you move.\nTake a quiet minute to picture where you are headed, then take one step that way.",
    "Bend, and you will not break.\nYoung wood stays soft so it can keep growing. Today may test your patience, but staying flexible keeps you going where stiff things would snap.\nStay open to a new way today instead of forcing the old one.",
  ],
  fire: [
    "Light is meant to be shared.\nFire energy makes you more visible today. Something you have kept quiet — an idea, a feeling, a bit of your work — may be ready to be seen.\nShare one thing openly today and let it warm someone.",
    "Go first.\nFire is about connection, and connection usually needs someone to start it. The person you are waiting to hear from may be waiting on you.\nMake the call, send the message, or say the kind thing first.",
    "Warmth takes a little courage.\nA Fire day rewards being open more than being guarded. Being warm can feel risky, but it is exactly what brings people closer.\nLead with your heart today, even if it feels a bit exposed.",
    "Point your spark at one thing.\nFire is strong when it is focused and weak when it is spread thin. Your energy is real today; it just works best aimed at one clear place.\nPick one thing worth your energy and give it your full light.",
    "Show your work, don't hide it.\nFire energy likes expression more than perfection. The thing you keep fixing in private may help more people out in the open — honest and unfinished.\nLet something you have been hiding be seen today.",
    "Warmth grows when you give it away.\nFire spreads by sharing its heat, not by keeping it. Your energy today can lift the people around you as much as yourself.\nShare your warmth freely today and watch it come back.",
  ],
  earth: [
    "Steady beats flashy today.\nEarth energy likes small, reliable things. Showing up and following through are what quietly hold a life together.\nDo one small, dependable thing today and let that be the win.",
    "Keep your word, especially to yourself.\nEarth is the element of trust, and trust is built from promises kept. The things you follow through on today, even small ones, become ground others can stand on.\nFinish one thing you said you would do.",
    "Fix before you start something new.\nAn Earth day is better for repairing than for beginning. Something you already have may just need care, not replacing.\nLook after what matters today instead of chasing what is next.",
    "Steady yourself before you decide.\nEarth teaches that a calm mind thinks clearly. Feeling scattered is rarely a sign to push harder — more often a sign to slow down.\nTake one slow breath before any big choice today.",
    "Build slowly, and it will last.\nEarth rewards patience over speed. Things worth having are stacked one honest layer at a time, and no shortcut lasts as long.\nAdd one solid layer to what you are building today.",
    "You can be a steady place.\nEarth energy grounds you and the people near you. Staying calm and steady today is not boring — it is the quiet strength others lean on.\nGive someone your calm today, starting with yourself.",
  ],
  metal: [
    "Less, but better.\nMetal energy clears away clutter. Today is good for cutting the extra — the tasks, the noise, the maybes that quietly wear you down.\nDrop one thing that no longer helps you and enjoy the space it leaves.",
    "Decide the thing you keep circling.\nMetal likes clear choices over comfortable ones. The decision you keep avoiding rarely gets easier with time; naming it plainly brings relief.\nMake one clear choice today, even a small one, and stick with it.",
    "A clear line is a kind of respect.\nMetal is the element of boundaries. Setting a clear limit — on your time, your energy, your yes and no — is not cold; it is honest.\nSet one clear boundary today and hold it without saying sorry.",
    "Finish what is almost done.\nA Metal day rewards finishing more than starting. Something is sitting near the end, waiting for one last push to be done.\nCarry one nearly-finished thing all the way through today.",
    "Clear thinking is a gift to yourself.\nMetal cuts through the fog of too many options. When everything feels urgent, the smart move is to name what really matters and let the rest go.\nNarrow your focus to one thing today.",
    "Tidy the space, calm the mind.\nMetal links order and calm. Cleaning a small spot — a desk, an inbox, a corner — often settles your mind more than you expect.\nPut one thing back in order today and let your thoughts settle with it.",
  ],
  water: [
    "Rest is not a detour today; it is the path.\nWater asks you to soften, not push. What feels stuck may just need space to settle on its own.\nListen inside before you decide — your quiet gut often knows more than the noise around you.\nOne gentle, restful choice today will steady your whole week.",
    "Flow around what is hard.\nWater never fights the rock; it finds a way past. Where you meet resistance today, pushing harder is probably not the answer — patience and a new angle are.\nGo around the problem today instead of straight through it.",
    "Stillness gets things done too.\nA Water day rewards reflection over rushing. Some things only get clear once you stop stirring them and let them settle.\nGive a hard question some quiet today and let the answer come.",
    "Your gut feeling counts too.\nWater is the element of quiet knowing. The soft nudge you keep brushing off may deserve more attention than the loud, confident noise around it.\nTrust one quiet feeling today, even before you can prove it.",
    "Listen more than you speak.\nWater grows deeper by taking things in. Today has more to teach through listening than through filling the silence — with others and with yourself.\nLeave a little more room to listen today than usual.",
    "Being gentle is its own strength.\nWater wears down stone not by force but by staying soft and steady. You do not have to get hard today to be strong.\nMeet a tough moment today with calm and see what softens.",
  ],
};
```

## 통합 메모 (형이 발행 전 확인할 점)
- 기존 `body`(한 줄) 필드는 그대로 두고, 카드에 `readings`를 대신 렌더하면 됨(서진이가 `pick(READINGS[element], seed*…)`로 선택 + 카드 텍스트 박스 높이/폰트 조정 필요 — 4줄이라 `fontSize: 31 → 24~26`, `lineHeight: 1.4` 유지 권장).
- 인스타 캡션은 카드와 동일 reading을 쓰면 이미지-캡션 정합 유지(현 `?data` JSON에 `reading` 필드 추가 권장).
- 면책 고정문(캡션 하단): "For entertainment & self-reflection — not professional advice." 권장.
```
```
