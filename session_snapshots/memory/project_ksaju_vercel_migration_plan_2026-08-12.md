---
name: project_ksaju_vercel_migration_plan_2026-08-12
description: "k-saju.me+blog.k-saju.me Vercel Hobby 상업이용위반 확인, cto가 2단계 이전계획 수립(Pro임시업그레이드→새Lightsail이전). 형 승인대기"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4166856e-c7da-40b3-8c0d-8064c43df842
  modified: 2026-08-12T04:25:11.519Z
---

data-finance-jiwon이 발견한 [[project_ksaju_live]] Vercel Hobby 상업이용 위반건을 cto-seojin이 실측 확인+이전계획 수립.

**범위 확대 발견**:
- k-saju.me뿐 아니라 **blog.k-saju.me도 Vercel Hobby**(레포 nanumhn/k-saju-blog), 애드센스 수익도 같은 위반.
- **[추정] Neon DB가 Vercel 통합 소속일 가능성 높음**(env변수 시그니처로 판단) — 맞으면 Vercel 프로젝트 삭제시 DB도 삭제됨. 실행 전 최우선 확인사항.

**cto 추천안(2단계)**:
1. 즉시: Vercel Pro($20/월)로 업그레이드해서 위반상태부터 차단(계정정지 리스크 >> $20).
2. 2주 내: 새 Lightsail 인스턴스(ap-northeast-2, 2GB, ~$7-12/월)로 정식 이전 후 Pro 해지.
- 기각한 대안: ①이 PC 자체를 서버로(04:00 매일재부팅=결제서비스에 안 맞음, 가정용회선 NAT/동적IP 리스크) — 단 로컬LLM 이점은 cloudflared 터널로 LM Studio/ComfyUI만 비공개 노출해서 유지 가능한 방법 찾음. ②기존 nblog Lightsail에 합치기(RAM available 286MB/swap 73%사용 중이라 OOM위험, Debian11 LTS 8/31 지원종료 임박이라 이중위험).
- 비용절감은 월 $8-13뿐 — 진짜 이유는 통제권+Vercel자동배포누락탈출+로컬제약탈출.

**절차 핵심**: Neon DB는 안 옮김(이전 중 두 오리진이 같은 DB 보게 해서 데이터 분리 방지), Gumroad 웹훅은 도메인 불변이라 재등록 불필요(idempotent라 안전), Vercel은 삭제 말고 배포만 일시중지(롤백 경로 유지).

**예상 소요**: 실작업 8~11시간, 캘린더 2~3일. blog.k-saju.me는 +2~3시간 별도.

**형 승인/액션 필요 지점 8개**: (a)방향+Pro여부 (b)AWS콘솔 Lightsail생성+고정IP (c)Vercel 환경변수 export(채팅 붙여넣기 금지, 파일로) (d)DNS TTL하향+A레코드변경 (e)Google Cloud Console 리다이렉트URI추가 (f)Neon 소유권 이관 (g)전환시각(새벽KST, 04:00 PC재부팅과 안 겹치게) (h)blog.k-saju.me 동시이전여부.

**상태(2026-08-12)**: 형에게 "오늘 Pro부터 올릴까요?" 질문 던짐, 답변 대기. 코드는 cto가 로컬빌드 통과 확인(43페이지, exit 0), 승인 나면 코드수정부터 착수 예정.

관련: [[project_ksaju_live]] [[project_w34_metrics_and_bugs_2026-08-12]] [[reference_nblog_saas_dev_gcp_key_rotation_2026-08-11]]
