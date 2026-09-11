---
name: reference_moa_manager_stale_lock_pid_reuse_2026-09-11
description: "재부팅 후 MOA 관리자(3888)가 안 뜨는 원인 — manager.lock의 옛 PID가 시스템 프로세스로 재활용돼 EPERM을 \"살아있음\"으로 판정"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 020131be-1ce0-4c5b-b0d5-362e34bde274
  modified: 2026-09-10T19:35:47.690Z
---

2026-09-11 04:28 재부팅 후 MOA 관리자(:3888)가 기동 직후 죽었다. 그 여파로 덱스·제나 다리와 외부 워치독 전부 멈춤(워치독 로그가 04:28 이후 0줄).

- 증거: `D:\Develop\jena-workspace\console-monitor\data\manager-launch.log` → `Error: MOA Manager가 이미 실행 중입니다. PID=1628`
- `data\manager.lock` 내용 = `1628`(09-10 04:29 부팅 때 쓴 값). 재부팅은 exit 핸들러를 안 돌려 락이 안 지워진다.
- 09-11 부팅 후 PID 1628 = `LsaIso.exe`(04:28:55 생성, 보호 시스템 프로세스).
- `moa-manager.mjs` `acquireLock()`(약 108~118행): `process.kill(pid,0)` 이 EPERM이면 `alive=true` → throw. **이름을 안 봐서 PID 재활용을 못 거른다.**
- [[reference_pid_reuse_defeats_liveness_check_2026-08-26]] 와 같은 병. 재부팅마다 옛 PID가 우연히 산 프로세스에 걸리면 재발한다.

**증상으로 알아보는 법**: 3888 접속 거부 + 다리 node 프로세스 없음 + 워치독 로그 무증가. 배경감시의 `[감시고장]` 줄(20분 무증가)이 이걸 잡는다.
**응급 해소**: `manager.lock` 삭제 후 `MoaManager` 예약작업(Ready 상태) 재실행. 상태변경이라 형 승인 필요([[feedback_temporary_restricted_authority_2026-08-28]]).
**근본 수리**: 락에 PID와 함께 프로세스 이름·시작시각을 넣어 대조하도록 코드 수정. 코드라 제나 몫([[feedback_clo_tests_jena_codes_2026-09-06]]).
