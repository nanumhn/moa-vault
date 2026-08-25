---
name: reference_shared_rules_marker_digits_only_2026-08-26
description: 답변 머리말 쉐어룰 버전은 숫자만 이어 붙인다 — 기호·공백 붙이면 중계기가 머리말을 못 알아본다
metadata: 
  node_type: memory
  type: reference
  originSessionId: a4ce04c1-cb1e-4fec-98a3-271369664ed0
  modified: 2026-08-25T23:35:11.467Z
---

형이 쉐어룰을 고칠 때마다 답변 머리말 버전을 올리기로 했다(2026-08-26). 지금은 `-# === Shared_Rules_v202608002`, 다음은 `...003`.

**★반드시 숫자만 이어 붙인다.** `-01` · `.1` · ` sv 01` 처럼 **숫자 뒤에 기호나 공백을 붙이면 안 된다.**

**왜** — 중계기 `dex-jena-bridge/src/wincon.mjs` 의 `hasMeaningfulReply`(377행 부근)가
`/^-#\s*={2,}\s*(?:Shared_Rules_v\d+|End)\s*$/i` 로 **줄 끝까지 숫자를 요구**한다(`$` 앵커).
숫자 뒤에 뭐가 붙으면 그 줄을 **머리말이 아니라 알맹이로 오인**해서, **머리말만 있는 빈 답을 진짜 답인 양 형께 보낸다.**
(같은 파일 367행 `hasOpenSharedReply` 는 앵커가 없어 접두사 매치만으로 통과한다 — **두 곳 중 한 곳만 깨지므로 "괜찮아 보이는" 함정이 있다.**)

**실측(2026-08-26, 실제 함수로 태워 확인)**
| 표기 | `hasOpenSharedReply` | `hasMeaningfulReply` (false여야 정상) |
|---|---|---|
| `v202608` | ✅ | ✅ |
| `v202608001` / `v202608002` | ✅ | ✅ |
| `v202608-01` | ✅ | ❌ |
| `v202608 sv 01` | ✅ | ❌ |
| `v202608.1` | ✅ | ❌ |

**숫자만 쓰면 중계기 코드도 `test/wincon-reply.test.mjs` 의 시험 4곳도 손댈 필요가 없다.**
바꾸고 싶으면 그 정규식을 `Shared_Rules_v[\w.-]+` 류로 넓히고 **테스트 4곳을 같이 고쳐야** 한다 — 덱스 코드다.

관련: [[reference_agents_md_only_injected_at_session_start_2026-08-24]] — 쉐어룰을 고쳐도 **살아 있는 덱스·제나 창은 안 문다.** 머리말 숫자가 옛 버전이면 그 창이 새 규칙을 못 받은 것이다. **버전 숫자가 곧 배달 확인용 지표**가 된다.
