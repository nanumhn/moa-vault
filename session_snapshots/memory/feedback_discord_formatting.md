---
name: feedback-discord-formatting
description: "Discord reply formatting — use triple-backtick code fences and real newlines, not [code] tags or \\n literals"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 21440e58-c87b-4bf1-8a4a-156f697ad594
  modified: 2026-07-23T15:24:07.165Z
---

Discord renders standard markdown. For code blocks use triple-backtick fences (```), NOT `[code]...[/code]` tags — those render as literal text. For line breaks, put actual newline characters in the JSON string, not the two-character `\n` sequence (which would only escape correctly if the JSON parser interprets it).

**Why:** First startup-banner reply rendered as one mashed line wrapped in literal `[code]` brackets — user had to point it out and ask for a redo.

**How to apply:** Any time a Discord reply needs preformatted text, banners, ASCII art, or multi-line code, wrap with triple-backtick fences and use real newlines in the `text` field. Same rule applies to [[feedback-discord-reply-tool]] sends.

**★ 첨부 파일 인코딩 (2026-07-23):** BOM 없는 UTF-8 `.md`/`.txt`를 파일로 첨부하면 **디스코드 모바일 인앱 뷰어가 한글을 깨서 표시**한다(파일 자체는 정상 UTF-8 — `file`·`xxd`로 확인됨, 뷰어 오판임). 대응: ①형에게 글 내용을 보여줄 땐 **본문을 reply 텍스트로 직접** 보내는 게 가장 확실(안 깨짐) ②굳이 파일로 줄 땐 **UTF-8 BOM(`EF BB BF`) 추가** 후 첨부. 샘플글_01.md 사례에서 형이 "한글 다 깨진다" 지적 → 본문 메시지 전송으로 해결.
