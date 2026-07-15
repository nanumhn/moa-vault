---
name: Google login via popup, not main-window redirect
description: User prefers Google OAuth flows (sign-in, YouTube upload, etc) to open in a popup window so the main session isn't lost
type: feedback
originSessionId: 8c0330e2-674a-4bf5-b00a-4c79a2540161
---
When implementing any Google OAuth flow (NextAuth sign-in, YouTube Data API upload, Google Drive, etc), use a popup-based flow rather than a full-page redirect.

**Why:** User does not want the main app window to navigate away during auth — losing scroll position, in-progress forms, or the working tab is friction.

**How to apply:**
- For YouTube upload / Google APIs: use Google Identity Services (GIS) Token Client (`google.accounts.oauth2.initTokenClient`) which natively supports popup mode and returns an access_token via callback. Send the token to the backend to call YouTube Data API.
- For NextAuth sign-in: NextAuth doesn't ship popup OAuth out of the box. Patterns: (a) open `/api/auth/signin/google?callbackUrl=/auth/popup-callback` in a `window.open(...)` popup with a small callback route that postMessages success and closes itself; (b) custom client-side handler. Avoid the default top-level redirect.
- Never default to redirect mode without checking with the user first.
