---
name: project_ksaju_vercel_migration_plan_2026-08-12
description: "k-saju.me+blog.k-saju.me Vercel Hobby 상업이용위반 확인, cto가 2단계 이전계획 수립(Pro임시업그레이드→새Lightsail이전). 형 승인대기"
metadata: 
  node_type: memory
  type: project
  originSessionId: 4166856e-c7da-40b3-8c0d-8064c43df842
  modified: 2026-08-13T07:07:38.772Z
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

**★★2026-08-13 형 최종 결정(수차례 정정 끝 확정)**: Vercel Pro 임시업그레이드 단계는 건너뛰고 바로 Lightsail로. 처음엔 인스턴스 2개 분리안이 나왔다가(→취소), 최종적으로 **인스턴스 1개**에 k-saju.me+blog.k-saju.me 같이 운영, **1GB($7) → 2GB($12) → 4GB($24) 순서로 단계적 업그레이드**(부하 신호 뜨면 다음 tier로). 기존 Vercel은 삭제 안 하고 테스트/롤백용으로 그대로 살려둠(요청사항). Hobby 상태로 이전 완료까지 며칠 더 남는 계정정지 리스크는 형이 인지하고 감수. cto-seojin에게 이 단계적 업그레이드 버전으로 구체 이전계획(AWS콘솔 액션+업그레이드 트리거 임계치 포함) 작성 지시함(2회 정정 후 최종 발송).

**Why**: 초기비용 최소화(가장 싼 tier부터) + Lightsail은 라이브 리사이즈가 안 돼 스냅샷→새 인스턴스 전환이라 처음부터 크게 잡을 필요 없다는 판단.
**How to apply**: 다음 세션에서 이 이전계획을 이어받으면 "인스턴스 1개, 시작 tier=1GB($7), 2GB→4GB로 단계 업그레이드"가 최종 결정임을 기준으로 삼을 것(2개 분리안·$12/$24 단일시작안은 모두 폐기된 중간안). Vercel Pro 업그레이드는 스킵된 것으로 취급(별도 지시 없는 한 재제안하지 말 것).

**★2026-08-13 QA 통과 — 실행계획 확정(v3, 착수 대기)**: `D:\Develop\saju-studio\_workspace\lightsail-migration\PLAN.md`(최종 커밋 4f62c71, 918줄) qa-lead-jian PASS. 반려 2라운드 거침 — v1 FAIL(sharp 리눅스 바이너리 누락/B5, Prisma 엔진 검증 위치 오류/B1, 블로그 캐시 무효화 누락)→v2로 전부 실행가능 수준 수정→PASS→v3에서 경미 권고 4건까지 반영 완료(트레이싱 글로브 통일·sharp find 검증 로컬/서버 분리·이미지 실측 정정 1.61~2.22MB·§13 규칙 오너화). **push는 계속 보류, 형 착수 승인만 남음.** 형 액션 2개(Neon Vercel소속 확인, DNS TTL 60초)는 8/13에 전달함 — 완료되면 착수(Day0, 블로그 먼저→1GB로 시작).

**진행상태(2026-08-13 갱신)**: 형 액션 2개 모두 완료 — ②DNS TTL 60초, ①Neon=Vercel 네이티브 통합 확정(Storage탭에 "neon-violet-blanket" Neon-Free로 직접 노출, "Open in Neon" 버튼 구조). §8 시나리오A(2막 이관 필요, 단 앱이전 후 후속으로 미룸) 확정. **cto-seojin에게 Day0(블로그 먼저, 1GB) 착수 승인 발송함.**

**Day0 마일스톤1 완료(코드+빌드게이트, 커밋 ec4520d/e1d2f04, push는 아직)**: B1(Prisma리눅스엔진)·B5(sharp)·글로브키 수정 전부 실측 통과. **cto가 계획과 다르게 짠 부분**: `output:"standalone"`을 `LIGHTSAIL_BUILD=1` 환경변수로만 켜지게 분기(안 그러면 롤백용 Vercel 빌드가 컷오버 이틀 전에 바뀔 뻔함 — 실측으로 변수없이 빌드시 기존과 100%동일 확인). **B1·B5와 같은 뿌리 세번째 사례 발견**: saju-studio에 lemonsqueezy 관련 untracked 파일(폐기된 결제레일 죽은코드)이 로컬빌드엔 실리는데 git엔 없어 Vercel 프로덕션엔 없음 — 그대로 배포하면 `/api/lemonsqueezy/*`가 프로덕션에 처음 생기는 사고였음. cto가 배포게이트에 untracked파일 거부 규칙 추가하기로 자체결정, lemonsqueezy 잔재 삭제/gitignore/정식편입 여부는 **형 결정 필요하나 급하지 않음(이전과 별개 건)**.

**🔴 다음 블로커 — 형 액션 ③~⑦ (AWS콘솔, 총 ~20분) 필요, 아직 미완료**: ③Lightsail 인스턴스 생성(ap-northeast-2a·OS Only Ubuntu 24.04 LTS·이름 k-saju-prod·SSH키페어 k-saju-lightsail 신규생성+.pem 다운로드, 10분) ④고정IP 생성후 인스턴스 연결(2분) ⑤방화벽 TCP 22/80/443만+IPv6비활성(3분) ⑥자동 스냅샷 켜기 매일새벽KST(2분, OOM시 5분복구 전제) ⑦origin.k-saju.me A레코드→고정IP TTL60(3분, hosting.co.kr에서). ③완료 후 ④⑤⑥, ④직후 ⑦. 이거 끝나야 서버 프로비저닝 시작 가능 — cto는 그동안 배포스크립트/PM2/GitHubActions 준비 중.

**★2026-08-13 시작 tier 변경**: AWS Lightsail **$7(1GB) 플랜이 신규생성 단종**(형이 콘솔에서 직접 확인). **시작 tier를 $12(2GB)로 변경** — 1GB 단계 스킵, 승급경로는 2GB→4GB만 남음. 인스턴스1개/블로그선행 등 나머지 결정은 안 바뀜. cto한테 §1-1/§1-6/§7-1/§9 tier 표기 정정 지시함(문서 재검 불필요할 정도의 사소한 정정으로 판단, 여유 늘어나는 방향이라 안전성엔 오히려 도움).

**2GB 반영 완료(커밋4b41c67)**: 메모리 예산 재계산 결과 여유 1.1~1.3GB — §12 최대리스크 항목 높음→낮음으로 하향. 여유 생긴 김에 개선 2건 추가: ①k-saju 블루그린 무중단배포 처음부터 적용(다운타임 2~4초→0) ②블로그 캐시 무효화실패시 피해범위 1시간→10분. 서버빌드금지/스왑2GB/sharp워밍업/Nginx정적서빙 4개는 tier무관 유지. §7-1에 "4GB 다음은 인스턴스 2대 분리"(형이 처음 제안했던 안)를 미래 경로로 명시. **지금은 형이 AWS콘솔에서 $12 인스턴스 생성 중 — 생성완료 알리면 cto가 프로비저닝 착수.**

**부수 발견(형 결정 불필요, 후속 점검용)**: nblog-saas도 k-saju와 동일한 "로컬 빌드→리눅스 전송" 방식+Prisma라 같은 함정(B1류) 사정권 — 현재 정상동작 중이라 급하지 않음, k-saju 이전 완료 후 점검 항목으로 §13에 기록됨. [[reference_nblog_saas_pm2_dump_missing_secrets_2026-08-12]]와 같은 "잠복장애, 재부팅/재배포 때 드러남" 성격.

관련: [[project_ksaju_live]] [[project_w34_metrics_and_bugs_2026-08-12]] [[reference_nblog_saas_dev_gcp_key_rotation_2026-08-11]]
