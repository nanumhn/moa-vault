---
name: owenlab-git-push-gh-credential
description: 옵시디언 볼트 등 git push가 wincredman 에러로 막히면 gh auth git-credential로 우회
metadata: 
  node_type: memory
  type: reference
  originSessionId: 40e8dc24-ed5f-4539-acc2-feab081b2c60
  modified: 2026-08-05T00:47:13.139Z
---

에이전트 셸에서 `git push`가 `Unable to persist credentials with the 'wincredman' credential store`로 실패한다 — [[docker-cred-helper-broken]]과 같은 logon-session 문제(셸에서 Windows Credential Manager 접근 불가). 우회법(2026-07-29 owenlab-notes push에서 검증):

```
git -c credential.helper= -c "credential.helper=!gh auth git-credential" push
```

gh CLI는 nanumhn 계정으로 로그인돼 있고 토큰을 keyring이 아닌 자체 경로로 읽어와 동작한다.

**★두 플래그 다 필요(2026-08-05 k-saju-blog push에서 재확인)**: `-c "credential.helper=!gh auth git-credential"` 하나만 주면 기존 `credential.helper=manager` 설정이 안 지워지고 같이 실행돼서 여전히 wincredman 에러가 남(관찰: 순서상 manager가 먼저 시도해서 실패). 반드시 `-c credential.helper=`(빈 값, 기존 헬퍼 리셋)를 **먼저** 주고 그 다음에 gh 헬퍼를 추가해야 한다. fetch에도 동일하게 적용됨(push만이 아님).
