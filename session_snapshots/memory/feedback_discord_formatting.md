---
name: feedback-discord-formatting
description: "Discord reply formatting — use triple-backtick code fences and real newlines, not [code] tags or \\n literals"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 21440e58-c87b-4bf1-8a4a-156f697ad594
---

Discord renders standard markdown. For code blocks use triple-backtick fences (```), NOT `[code]...[/code]` tags — those render as literal text. For line breaks, put actual newline characters in the JSON string, not the two-character `\n` sequence (which would only escape correctly if the JSON parser interprets it).

**Why:** First startup-banner reply rendered as one mashed line wrapped in literal `[code]` brackets — user had to point it out and ask for a redo.

**How to apply:** Any time a Discord reply needs preformatted text, banners, ASCII art, or multi-line code, wrap with triple-backtick fences and use real newlines in the `text` field. Same rule applies to [[feedback-discord-reply-tool]] sends.
