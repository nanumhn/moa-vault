---
name: feedback-discord-formatting
description: "Discord reply formatting — use triple-backtick code fences and real newlines, not [code] tags or \\n literals"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 21440e58-c87b-4bf1-8a4a-156f697ad594
  modified: 2026-08-16T00:35:42.643Z
---

Discord renders standard markdown. For code blocks use triple-backtick fences (```), NOT `[code]...[/code]` tags — those render as literal text. For line breaks, put actual newline characters in the JSON string, not the two-character `\n` sequence (which would only escape correctly if the JSON parser interprets it).

**Why:** First startup-banner reply rendered as one mashed line wrapped in literal `[code]` brackets — user had to point it out and ask for a redo.

**How to apply:** Any time a Discord reply needs preformatted text, banners, ASCII art, or multi-line code, wrap with triple-backtick fences and use real newlines in the `text` field. Same rule applies to [[feedback-discord-reply-tool]] sends.

**★★ 메시지 타임스탬프는 UTC — 2026-08-16 또 반복됨.** 새벽~아침 시간대 세션에서 `ts`를 KST로 착각해 "형 주무세요"라고 말하는 실수를 또 함(실제로는 오전 9:35였는데 "새벽"으로 착각). 2026-08-11에 이미 한 번 겪고 기록해둔 실수인데 5일 뒤 세션에서 재발 — **시간 관련 발언(주무세요/새벽이네요/몇시죠 등) 전엔 반드시 ts에 +9 계산부터 하고 말할 것.** 특히 대화가 길어지고 세션이 자정 KST(=UTC 15시)를 넘나드는 시점엔 날짜까지 같이 헷갈리기 쉬움.

**★ 메시지 타임스탬프는 UTC (2026-08-11 실수로 재확인):** `<channel ... ts="2026-08-11T04:27:19.405Z">`의 `ts`는 UTC다. KST 계산하려면 **+9시간** 해야 한다. 이걸 깜빡하고 UTC 값을 그대로 KST인 것처럼 형에게 얘기해서("지금 04:27이시죠" → 실제는 13:27) 발행 스케줄 관련해서 엉뚱한 조언을 한 적 있음(형이 "지금은 13:27분"이라고 정정해줌). **시각 계산이 필요한 모든 응답 전에 ts의 Z를 보고 +9 계산부터 할 것** — 특히 "몇 분 뒤/몇 시간 뒤" 같은 스케줄링 조언을 할 때 필수.

**★ 첨부 파일 인코딩 (2026-07-23):** BOM 없는 UTF-8 `.md`/`.txt`를 파일로 첨부하면 **디스코드 모바일 인앱 뷰어가 한글을 깨서 표시**한다(파일 자체는 정상 UTF-8 — `file`·`xxd`로 확인됨, 뷰어 오판임). 대응: ①형에게 글 내용을 보여줄 땐 **본문을 reply 텍스트로 직접** 보내는 게 가장 확실(안 깨짐) ②굳이 파일로 줄 땐 **UTF-8 BOM(`EF BB BF`) 추가** 후 첨부. 샘플글_01.md 사례에서 형이 "한글 다 깨진다" 지적 → 본문 메시지 전송으로 해결.

**★ 중요 부분은 이모지로 부각 (2026-08-16 형 지시):** "텍스트만 되어 있으면 어떤 게 중요한 부분인지 표시가 안 된다"고 지적. 텍스트 볼드보다 이모지가 눈에 더 잘 띈다는 취지. 표준 세트: ⚠️주의/위험 · 🔴긴급/장애 · ✅완료 · ❓형 결정 필요 · 💡추천사항 · 📌요약 · 📋상세([[feedback_report_length_short]]의 요약+상세 형식과 병행). 매 메시지마다 억지로 넣지 말고, 실제로 강조할 게 있을 때(경고·완료·결정요청) 그 줄 앞에 붙이는 식으로.
