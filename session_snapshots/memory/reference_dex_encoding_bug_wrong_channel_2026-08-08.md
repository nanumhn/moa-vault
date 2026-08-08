---
name: reference-dex-encoding-bug-wrong-channel-2026-08-08
description: "덱스(Codex)가 확인응답을 그들만의업무 채널 대신 SystemLogs 웹훅 채널(1517010882570485871)로, 인코딩 깨진 채(mojibake) 보내는 버그 발견 — 기능엔 문제없음, 표시만 깨짐"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 6279da50-7746-403f-8908-ff9f9f98e5b4
  modified: 2026-08-08T16:29:08.714Z
---

2026-08-08 덱스에게 `layout.tsx`·`page.tsx` 파일 유실 여부 확인을 요청했더니, 정상 채널("그들만의업무" 1534714627383099493)이 아니라 `.moa\healthcheck.config.json`의 `discordWebhook`(SystemLogs 앱, 채널ID `1517010882570485871`, "system-status" 채널로 보임)으로 **UTF-8이 깨진 텍스트**를 보냈다. 형이 화면에서 한자처럼 보이는 글자를 보고 "중국어"라고 보고함 — 실제로는 한글이 다른 인코딩으로 잘못 해석되며 우연히 CJK 유니코드 블록의 한자·키릴 문자가 섞여 나온 mojibake였다.

**원인 추정(미확정)**: 덱스(codex CLI)가 이 세션의 정상 봇 응답 경로(디스코드 트리거→봇 응답) 밖에서 후속 확인 메시지를 보내야 할 때, 자기 워크스페이스 안에서 발견한 기존 PowerShell 웹훅 스크립트(`moa_webhook_send.ps1` 계열)를 임의로 찾아 써서 대신 발송한 것으로 보임. 이때 한글 문자열을 PowerShell에 넘기는 과정(커맨드라인 인자 또는 파일 인코딩)에서 시스템 코드페이지(CP949)와 UTF-8이 섞여 깨졌을 가능성이 큼 — PS5.1 인코딩 함정([[reference_moa_healthcheck]]에 기록된 것과 같은 계열).

**디코딩해보니 내용 자체는 정상이었다**(raw Discord API로 `\uXXXX` JSON 이스케이프를 직접 확인): "확인 결과, 두 파일 모두 최신 작업분과 일치합니다" / "이제 중단됐던 작업을 다시 실행할 수 있는 상태입니다" — 즉 기능적으로는 문제없이 응답이 갔고, **표시(인코딩)와 채널 라우팅만 깨졌다.**

**How to apply**: 덱스·제나의 메시지가 업무채널이 아닌 다른 곳(특히 SystemLogs/system-status)에 이상하게 보이면, `curl -H "Authorization: Bot $TOKEN" .../messages`로 raw JSON을 직접 받아서 `\uXXXX` 이스케이프를 디코딩해 실제 내용을 확인할 것 — Discord 앱 화면 렌더링만 보고 "이상한 문자"라고 단정하지 말 것. 근본 수정(덱스가 왜 이 웹훅을 쓰게 됐는지, 어디서 인코딩이 깨지는지)은 아직 미착수 — 다음에 여유 있을 때 dex-jena-bridge 소스에서 fallback 발송 경로를 찾아 고칠 것.

관련: [[project_dex_jena_multiagent_2026-08-06]] [[reference_dex_jena_channel_no_live_push]]
