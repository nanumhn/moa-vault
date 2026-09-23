# 덱스 무응답: 오래된 카드로 원인을 잘못 보고

## 확인된 일

- 2026-09-23 15:17 KST, 사용자의 덱스봇 DM이 Discord API에 존재했다. 기존 브리지 로그에는 같은 DM 채널이 `verdict=trigger`로 기록됐다.
- MOA 관리자 API는 `moa-dex-bridge`를 `running`으로 표시했다. 이는 **브리지** 상태다.
- 오전 04:38 KST에 발행된 Codex 업데이트 선택 카드가 Discord에 남아 있었다.
- 그러나 `cli_windows.json`에 등록된 덱스 CLI PID 22336은 실제 프로세스 조회에서 존재하지 않았다. 등록 파일은 오전 04:38 이후 갱신되지 않았다.
- 정식 시작 스크립트로 덱스 CLI를 다시 띄웠고, 새 PID 31092의 생존을 그 시점에 확인했다. DM 자동 회신은 아직 재시험하지 않았다.

## 잘못된 보고와 영향

업데이트 카드가 현재 CLI를 막고 있을 것이라고 추론해 사용자에게 `Skip` 버튼을 누르라고 안내했다. **현재 CLI 프로세스 확인 전의 인과 추론이었다.** 사용자가 덱스 CLI 창이 없다고 지적한 뒤에야 PID를 조회했다. 카드 조작 안내를 취소하고 정정했다. 카드와 CLI 종료 사이의 원인 관계, CLI 종료 이유는 확인되지 않았다.

## 재발 방지 조건

1. 실시간 장애에서는 등록 파일·과거 카드보다 먼저 현재 PID 생존과 세션 연결을 조회한다.
2. 브리지 `running`과 CLI `running`은 별개의 사실로 보고한다. PID 생존은 대화 준비 완료의 증거가 아니다.
3. 원인을 확인하지 못하면 `미확인`으로 보고한다. 확인 전에는 원인에 기대는 버튼·명령 조작을 권하지 않는다.
4. 정정 시 이전 조치 권고를 명시적으로 취소하고, 이미 진행된 범위와 아직 확인하지 않은 범위를 적는다.

## 근거 위치

- `C:\Users\user\.moa\cli_windows.json`: 당시 등록 PID 22336과 기록 시각.
- `C:\Users\user\.moa\dex_jena_bridge_dex.out.log`: DM `verdict=trigger` 기록.
- `D:\Develop\dex-workspace\tools\DEX_DISCORD_MCP_POC.md`: 시험과 정정 기록.
- 실시간 PID·실행 경로·시작 시각 대조 명령: `powershell.exe -NoProfile -ExecutionPolicy Bypass -File D:\Develop\dex-workspace\tools\dex-runtime-status.ps1`. 2026-09-23에 살아 있는 PID 31092를 `alive_registered`, 임의의 종료 PID를 `dead_pid`와 종료 코드 1로 확인했다. 이 명령도 CLI 준비 완료나 Discord 회신은 증명하지 않는다.
