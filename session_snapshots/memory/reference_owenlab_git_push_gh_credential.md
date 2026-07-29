---
name: owenlab-git-push-gh-credential
description: 옵시디언 볼트 등 git push가 wincredman 에러로 막히면 gh auth git-credential로 우회
metadata: 
  node_type: memory
  type: reference
  originSessionId: 40e8dc24-ed5f-4539-acc2-feab081b2c60
  modified: 2026-07-29T05:12:14.021Z
---

에이전트 셸에서 `git push`가 `Unable to persist credentials with the 'wincredman' credential store`로 실패한다 — [[docker-cred-helper-broken]]과 같은 logon-session 문제(셸에서 Windows Credential Manager 접근 불가). 우회법(2026-07-29 owenlab-notes push에서 검증):

```
git -c credential.helper= -c "credential.helper=!gh auth git-credential" push
```

gh CLI는 nanumhn 계정으로 로그인돼 있고 토큰을 keyring이 아닌 자체 경로로 읽어와 동작한다.
