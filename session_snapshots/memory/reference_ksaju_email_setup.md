---
name: reference_ksaju_email_setup
description: "support@k-saju.me email is live — ImprovMX (receive) + Brevo SMTP (send) via Gmail, both free"
metadata: 
  node_type: memory
  type: reference
  originSessionId: ee8b467e-df9e-45b7-958b-13a0479d9823
---

support@k-saju.me 메일이 라이브 (2026-06-17 구축, 비용 0원).

- **받기:** ImprovMX 무료 포워딩. support@k-saju.me → 형 Gmail(ssky.park@gmail.com)로 자동 전달. DNS: MX mx1/mx2.improvmx.com + SPF `v=spf1 include:spf.improvmx.com ~all`.
- **보내기:** Brevo 무료 SMTP(하루 300통) + Gmail "다른 주소로 보내기". SMTP `smtp-relay.brevo.com:587`, login `af02f0001@smtp-brevo.com`, SMTP 키는 형이 보관(메모리·transcript에 X). Brevo 계정: kihyo / 회사 nanumn.
- **인증 레코드(k-saju.me DNS):** brevo-code TXT(@), DKIM CNAME brevo1·brevo2._domainkey → b1·b2.k-saju-me.dkim.brevo.com, DMARC TXT _dmarc `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com`.
- ImprovMX 무료는 받기만 — 발송 SMTP는 유료($9/월)라 Brevo로 분리한 것.
- Brevo SMTP 키 화면의 "Activate for SMTP keys"(IP 차단)는 켜면 안 됨 — Gmail 발송 IP 가변이라 막힘.

개인정보처리방침·이용약관·PayPal에 적힌 support@k-saju.me 가 이제 실주소. 관련: [[project_ksaju_live]]
