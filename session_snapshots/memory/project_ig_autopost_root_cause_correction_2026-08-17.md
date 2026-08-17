---
name: project_ig_autopost_root_cause_correction_2026-08-17
description: "인스타 자동게시 56일 장애 원인 정정 — facebook호스트 아니라 PNG포맷 추정([미확인]), 기존 일지 기록은 오기"
metadata: 
  node_type: memory
  type: project
  originSessionId: 5b69d1f6-1f0a-499b-a3c2-cae15069bb8f
  modified: 2026-08-16T22:58:39.639Z
---

2026-08-16 오후에 "인스타 자동게시가 6/22부터 멈춘 원인 = 잘못된 API 서버 주소(`graph.facebook.com`), 정답은 `graph.instagram.com`"이라고 확인·보고돼 그날 업무일지(`70 Record/2026-08-16.md`)에 사실처럼 기록되고 git push까지 됐다.

**2026-08-17 새벽, cto(서진)가 재검증하며 이 진단이 틀렸음을 발견했다.** n8n 워크플로 `tarotDaily00002`의 IG 노드 3개를 직접 열어보니 **URL이 6/22 이후 한 번도 수정 안 된 상태 그대로 이미 `graph.instagram.com`**이었다(`updatedAt`=2026-06-22 확인). 즉 "누가 나중에 고쳤다"가 아니라 **처음부터 맞는 호스트였다.**

**새 가설[미확인]**: Meta 문서("JPEG is the only image format supported")와 실측(우리 카드 렌더는 PNG, `next/og`/Satori가 PNG만 출력)이 일치해서, **PNG 포맷이 진짜 원인일 가능성**이 높다고 보고 있다. 다만 n8n 실행 로그가 자동 정리돼 6/22 실패 4건의 실제 에러 메시지는 확인 불가 — 실제 API 컨테이너 생성 테스트로 검증 진행 중.

**Why:** 잘못된 진단이 이미 업무일지·기억(git 커밋)에 "확인됨"으로 박혀 있다. 다음에 이 주제를 참고할 때 옛 기록(facebook 호스트 오류)을 그대로 믿으면 안 된다.

**How to apply:** 향후 이 건을 언급할 때는 이 정정 메모를 우선 참고할 것. `70 Record/2026-08-16.md`의 해당 서술도 다음 일지 작성 기회에 정정 필요(작성자=archive-head-haru). PNG포맷 가설이 실증되면 이 메모도 업데이트할 것.

**진행 업데이트(같은 날 밤)**: cto가 `/api/og/daily-card-jpeg` 라우트를 신설해 JPEG 변환 수정을 커밋(`7e8c138`)했고, 클로가 배포 승인함. 다만 실제 Meta API 에러로 확인된 건 아니고(n8n 실행기록 소실+자격증명 복호화 시스템 차단으로 직접검증 불가) 여전히 문서근거+정황일치 수준 — **진짜 확인은 배포 후 첫 자동게시 실행 때 난다.** 배포 후 n8n 워크플로(`tarotDaily00002`) 이미지URL 교체+실패시 디스코드 경보 추가+활성화까지 이어질 예정.
