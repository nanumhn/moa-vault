---
date: 2026-06-02
agent: meta (dev orchestrator)
skill_type: ops_pattern
trigger: 새 dev server 또는 smoke test 띄울 때
confidence: high
auto_apply: true
---

# 포트 점유 회피 + node.exe 광범위 kill 금지

## 무엇
새 서비스/dev server를 띄울 때 **반드시 포트 점유 여부를 먼저 확인**하고, 점유 시 다른 포트로 띄움. 또한 cleanup은 **PID 지정 kill만**, `taskkill /F /IM node.exe` 같은 광범위 kill 금지.

## Why (오늘 사고)
2026-06-02 사주 페이즈3 작업 중:
- 형이 평소 띄워둔 moa-studio가 포트 3000 점유 중
- 내가 smoke test 위해 `taskkill /F /IM node.exe`로 **모든 node 죽임** → moa도 같이 죽음
- 그 자리에 saju-studio를 3000으로 띄움 → 형 입장에서는 "사주가 왜 떠?"
- 형 지적: "기존 포트에 서비스가 있으면 다른 포트에서 띄워야지~!?"
- 정확히 옳음.

## 자동 적용 규칙 (다음에는 이렇게)

### 1) 포트 사용 전 점유 확인 (Windows)
```powershell
Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
```
점유 중이면 `3001`, `3002`로 자동 증가.

### 2) PID 지정 kill만
내가 직접 띄운 dev server의 PID를 기억 → 그 PID만 `Stop-Process -Id $pid -Force`로 종료.
**광범위 `taskkill /F /IM node.exe` 금지** — 다른 사람/다른 서비스의 node 죽임.

### 3) 서비스별 고유 포트 영구화
- moa-studio → 3000 (기본)
- saju-studio → 3001 (`package.json` `dev`: `next dev -p 3001`로 영구 변경)
- clo_studio dashboard → 8080 (기존)
- 추후 새 서비스 → 3002+

### 4) smoke test 패턴
dev server를 띄워서 curl로 검증할 때:
- 시작 PID를 변수에 저장
- 검증 끝나면 그 PID만 종료
- 절대 image name으로 kill 안 함

```bash
cd /d/Develop/saju-studio && bun run dev > /tmp/dev.log 2>&1 &
PID=$!
sleep 8
curl ...
kill $PID
```

## 백로그 (구조적 fix)
- [ ] 각 프로젝트 `package.json`에 고유 포트 영구 명시 (saju 3001 ✓)
- [ ] dev server 시작 헬퍼 함수 (포트 점유 자동 감지 + 자동 증가)
- [ ] taskkill 광범위 호출을 사전 차단할 wrapper

## 관련
- [[feedback_autonomy_delegation]] — 자율 결정의 비가역적 행동 금지 (port conflict는 가역이지만 형 작업 중단 유발)
- [[2026-06-02_meeting_artifact_quality_gate]] — 자동 품질 게이트 5종
