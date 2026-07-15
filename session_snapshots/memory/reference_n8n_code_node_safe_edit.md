---
name: reference_n8n_code_node_safe_edit
description: Safe way to edit/inject n8n Code-node jsCode + Git Bash docker /tmp path gotcha
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4e434952-0e4a-4a91-9a85-1b63b25294aa
---

Editing n8n Code nodes without the heredoc death (see [[reference_daily_card_image_date_bug]]):

1. Export: `MSYS_NO_PATHCONV=1 docker exec n8n n8n export:workflow --id=<id> --output=/tmp/x.json`.
   ⚠️ On Git Bash (win), `/tmp/...` inside `docker exec` gets MSYS-mangled to `C:/Users/.../Temp/...`
   and export fails with ENOENT. Prefix `MSYS_NO_PATHCONV=1` to stop the path translation.
   Then `docker exec n8n cat /tmp/x.json > local.json` to pull it out.
2. Write the jsCode as a real `.js` file (file editor), unit-test it with `bun` (no system node here — [[reference_node_runtimes]]).
3. Inject via **json round-trip**: a Python script that reads the .js text and embeds it with
   `json.dumps` — this escapes backticks / `${}` / newlines correctly. NEVER shell heredoc / string-concat the jsCode.
4. `docker cp patched.json n8n:/tmp/` → `n8n import:workflow --input=/tmp/patched.json`
   (import DEACTIVATES the workflow) → `n8n update:workflow --id=<id> --active=true` → `docker restart n8n`.
5. Verify: `curl localhost:5678/healthz`, re-export and diff nodes/connections, and re-extract the
   embedded jsCode from the exported JSON and re-run the unit tests (proves round-trip didn't corrupt it).

Never full-run the blog workflow to test (pushes a live post). Test the node function in isolation.
GitHub Push MDX node holds a plaintext PAT — never echo the workflow JSON to logs/reply.

Applied 2026-07-08: added pre-publish Quality Gate to `blogAutoPost001` (Validate Quality Code node →
IF `_validation.pass` → GitHub Push / Discord alert). See [[project_blog_ksaju]].
