---
name: reference-build-pipe-sigpipe-trap
description: "Piping a Next.js build into head/grep kills it via SIGPIPE, leaving a half-written .next that makes next start return 500 on every route"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 771e9b4c-1ade-4980-828c-f82c0b7d539a
  modified: 2026-07-27T01:55:11.477Z
---

`bun run build 2>&1 | head -10` (or any early-closing pipe such as `| grep -m1`)
**kills the build partway through**. `head` closes the pipe, the build process
takes SIGPIPE, and `.next/prerender-manifest.json` is never written. The build
looks like it succeeded — the compile lines already scrolled past — but
`next start` then returns **500 on every route**, including static ones.

Confirmed 2026-07-27 in `D:\Develop\saju-studio` (Next 16.2.7 + bun). The
giveaway is in the server log, not the response:
`Error: ENOENT ... .next\prerender-manifest.json`.

**Do instead:** redirect the build output to a file, then grep the file.

```bash
bun run build > "$SCRATCH/build.log" 2>&1; echo "exit=$?"
grep -E "Compiled|TypeScript|Generating static" "$SCRATCH/build.log" | tail -6
ls .next/prerender-manifest.json   # cheap proof the build finished writing
```

Do not read a blanket 500 as a code bug until the build artifacts are
confirmed present — see [[feedback_verify_before_alarm]] and
[[feedback_verified_facts_only]]. A stale/locked `.next` from an interrupted
build produces the same symptom, so `rm -rf .next` + full rebuild is the reset.
