---
name: reference_n8n_credential_migration
description: "How to move a plaintext API key/PAT out of an n8n HTTP Request node into a referenced Credential, and verify auth non-mutatingly"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4e434952-0e4a-4a91-9a85-1b63b25294aa
---

n8n HTTP Request 노드에 평문 하드코딩된 토큰(Authorization 헤더)을 Credential 참조로 옮기는 절차 (2026-07-08 blogAutoPost001 GitHub PAT 사례).

**노드 전환 (JSON 라운드트립, heredoc 금지 — see [[reference_n8n_code_node_safe_edit]]):**
- 형이 n8n UI에서 **Header Auth** credential 생성(type `httpHeaderAuth`): Name=`Authorization`, Value=`Bearer <PAT>`(공백 1칸 필수). 값은 형이 직접 입력 → 나는 값 안 봄.
- credential id는 `docker exec n8n n8n export:credentials --all --output=/tmp/x` 후 id/name/type만 파싱(값은 암호화됨, 출력 금지).
- 노드에 `parameters.authentication="genericCredentialType"`, `parameters.genericAuthType="httpHeaderAuth"`, `node.credentials={httpHeaderAuth:{id,name}}` 세팅 + headerParameters에서 Authorization 줄만 제거(Accept·X-GitHub-Api-Version 유지).
- import→`update:workflow --active=true`→`docker restart n8n`→재export로 `github_pat_` 패턴 0건 + credential 참조 확인.

**인증 검증 (글 push 없이 = 라이브 오염 방지):**
- CLI `n8n execute --id=`는 러닝 서버와 **task broker 포트 5679 충돌**로 못 씀. 대신 **webhook 트리거 임시 워크플로우**를 만들어(webhook→HTTP Request GET(같은 credential)→Code(statusCode만 반환)) `curl localhost:5678/webhook/<path>`로 호출.
- HTTP Request에 `options.response.response.fullResponse=true`+`neverError=true` 주면 401도 throw 없이 statusCode 회수.
- 읽기전용 GET만: `/repos/<owner>/<repo>`(200=토큰유효+read) 또는 `/user`. **write(push)는 mutating이라 테스트 금지** → Contents:Write는 다음 정기 실행으로 확인.
- 401 "Bad credentials"=토큰 문자열 무효(오타/공백/부분붙여넣기/Bearer 프리픽스 누락). 403/404=스코프 문제. 구분해서 형에게 안내.
- 임시 워크플로우는 import 시 `id`·`active` 필드 필수(없으면 SQLITE NOT NULL 에러). CLI에 `delete:workflow` 없음 → `update --active=false`+restart로 inert(webhook 404) 처리, 삭제는 UI 원클릭.

**시크릿 위생:** n8n export JSON엔 평문 PAT 섞일 수 있음 → 백업 dir(예 moa-vault/90_Backups)은 gitignore + 백업 파일 내 `github_pat_...`는 placeholder로 마스킹. `export:credentials` 결과 파일은 즉시 삭제.
