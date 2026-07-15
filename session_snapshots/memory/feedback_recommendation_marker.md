---
name: Mark recommended option in choice lists
description: When presenting multiple options to choose from, label the one you recommend with "(내가추천)" so it stands out
type: feedback
originSessionId: 17102dda-ea2c-4f31-9ede-37485de66407
---
When giving the user a list of choices/options, mark the one you recommend with **`(내가추천)`** at the end of that option's label.

**Why:** The user wants to see your default at a glance instead of parsing through prose. Saves them time deciding when there are 3-4 options.

**How to apply:**
- Korean conversations: append `(내가추천)` to the recommended option
- English conversations: append `(I recommend)` (or use the user's language)
- Place the marker at the end of the option's title/label, before any description
- Only mark ONE option as recommended (not multiple)
- If you genuinely have no preference, say so explicitly rather than dodging the marker
- Applies to numbered lists, bullet lists, AskUserQuestion options — anywhere choices are presented

**Repeated violation note (2026-05-13):** Caught again — at the end of a long Discord report I listed "다음 단계 후보: A/B/C" without `(내가추천)` on any of them. The marker rule applies to EVERY choice list regardless of length, position in the message, or how casual the framing is. If the prose ends with "어느 거 가실래요?" / "선택하세요" / "결정해주세요", the options above it MUST have one marked. Treat the absence of a marker as a bug, like forgetting to ack on Discord.
