---
name: reference_domain_availability_check
description: "How to reliably check domain availability on this machine — rdap.org and DNS both give false \"available\" results"
metadata: 
  node_type: memory
  type: reference
  originSessionId: ee8b467e-df9e-45b7-958b-13a0479d9823
---

도메인 등록 가능 여부 확인 시 주의 (2026-06-13 saju.co 오판 사고에서):

- **rdap.org는 `.com`(Verisign)만 신뢰 가능.** `.co`·`.ai`·`.app` 등 ccTLD/new gTLD는 rdap.org가 미색인이라 **등록돼 있어도 404("가능")로 잘못 나온다.** saju.co를 "가능"으로 보고했으나 실제로는 Shopify로 운영 중이었음.
- **이 PC의 DNS도 못 믿는다.** 한국 ISP가 없는 도메인(NXDOMAIN)을 캐치 페이지 IP **203.248.252.2**로 리다이렉트한다. 그래서 미등록 도메인도 DNS에 IP가 찍힌다. (203.248.252.2 = "없는 도메인" 안내, 실제 등록 아님)

**신뢰 가능한 판정:**
- `.com`: `curl -sL rdap.org/domain/X.com` → 404=가능 / 200=등록됨 (Verisign authoritative, 신뢰).
- 진짜 사이트 여부 보조 확인: `curl https://X` → 301/200이면 실사용 중(등록됨). DNS가 203.248.252.2 단일 IP면 그건 ISP 캐치(미등록 신호).
- **그 외 모든 TLD(.co/.ai/.app 등): 레지스트라(Porkbun, Cloudflare) 실시간 검색이 유일하게 확실.** 형에게 거기서 확정하라고 안내할 것.

관련: 사주 서비스 도메인 후보 — trysaju.com/usesaju.com/knowsaju.com이 .com RDAP로 가능 확인됨(2026-06-13). [[project_3_saju_global]]
