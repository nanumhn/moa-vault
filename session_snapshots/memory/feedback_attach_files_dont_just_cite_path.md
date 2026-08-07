---
name: feedback_attach_files_dont_just_cite_path
description: 결과물 보고할 때 파일 경로를 텍스트로 적는 것과 실제 첨부(files 파라미터)는 다르다 — 형은 텍스트만 보고 파일이 없다고 여긴다
metadata: 
  node_type: memory
  type: feedback
  originSessionId: e191fe26-93b0-4a73-b1fb-b967f371511a
  modified: 2026-08-07T08:38:09.083Z
---

2026-08-07 PPT 프로젝트 보고 중, 제안서 템플릿 결과를 업무방에 올릴 때 `reply` 도구의 `files` 파라미터 없이 파일 경로만 텍스트로 적어서 보냈다. 형이 "안 보이는데?"라고 지적할 때까지 몰랐다. 직전에 올린 재가공본 메시지는 `files`를 제대로 넣어서 정상 첨부됐었는데(fetch_messages로 "+1att" 표시 확인됨), 그 다음 제안서 메시지에서 빠뜨렸다.

**Why:** 형 입장에서 "경로: `D:\...\out\`"라고 적힌 텍스트는 클릭할 수도, 다운로드할 수도 없는 정보다. 실제 파일을 봐야 하는 요청(PPT·이미지·문서 결과물)에서 경로만 알려주는 건 "아직 안 준 것"과 같다.

**How to apply:**
- 형에게 파일 결과물을 전달할 때는 반드시 `reply`의 `files` 파라미터에 절대경로를 넣어 실제 첨부할 것. 경로를 설명 텍스트에 적는 것은 첨부를 대체하지 못한다.
- 발송 후 의심되면 `fetch_messages`로 방금 보낸 메시지에 첨부 개수(`+Natt`)가 찍혔는지 교차 확인한다([[feedback_verify_before_alarm]]과 같은 원리 — 발송했다는 주장과 실제 도착은 별개).
- 여러 파일을 연속으로 올릴 때 하나는 `files`를 넣고 다음 건 빠뜨리는 실수가 나기 쉬우니, 파일이 있는 보고는 매번 `files` 파라미터 채웠는지 스스로 점검한다.

관련: [[feedback_never_send_placeholder_text]] [[feedback_verify_before_alarm]]
