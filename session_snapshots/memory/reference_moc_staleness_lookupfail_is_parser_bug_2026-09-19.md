---
name: reference_moc_staleness_lookupfail_is_parser_bug_2026-09-19
description: "moa_moc_staleness.ps1 의 LOOKUP-FAIL 은 대개 MOC가 낡아서가 아니라 evidence_git 뒤에 설명글이 붙어 파싱이 깨진 것이다"
metadata:
  type: reference
---

`moa_moc_staleness.ps1 -Days 3` 이 내는 **LOOKUP-FAIL** 을 "경로가 낡았다"로 읽지 말 것.

**실측(2026-09-19, haru가 소스 `163~171행` 직접 확인)**
「네이버 블로그 SaaS MOC」 frontmatter가 이렇게 돼 있었다:

```yaml
evidence_git: D:/Develop/nblog-saas-prod-release · 운영 /home/bitnami/apps/nblog-saas/current
```

검사기는 **콜론 뒤 전체 문자열을 경로 하나로 보고** `Test-Path` 를 건다.
설명글(` · 운영 ...`)이 붙어 있으니 당연히 실패하고 LOOKUP-FAIL 이 뜬다.
[보고받음: haru, `ls` 확인] **`D:/Develop/nblog-saas-prod-release` 폴더는 실재한다.**

**★내가 여기서 틀렸다**: 나는 [[reference_nblog_runs_local_not_vercel_2026-09-17]] 를 근거로
*"운영본이 `nblog-saas-dex-ops-baseline`+3002니 MOC의 경로가 낡은 것"* 이라고 [추측]해 형께 보고했다.
**맞는 기억을 엉뚱한 자리에 갖다 붙인 것**이다. 기억이 맞아도 그게 이 증상의 원인이라는 보장은 없다.

**할 것**
1. LOOKUP-FAIL 이 뜨면 **먼저 그 경로를 `ls` 로 직접 확인**한다. 있으면 파싱 문제다.
2. 고칠 곳은 MOC 본문이 아니라 **frontmatter의 경로 줄 하나**다. 설명은 다른 키나 본문으로 뺀다.
3. ★**같은 형식(`경로 · 설명`)을 쓰는 다른 MOC가 더 있는지 전수 확인** — 2026-09-19 시점엔 **확인 못 했다.** 있으면 전부 같은 헛경보를 낸다.

관련: [[reference_moc_staleness_evidence_contract_2026-08-22]] · [[feedback_check_tool_can_false_pass]] · [[feedback_dont_fill_data_gaps_with_inference]]
