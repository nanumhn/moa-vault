---
name: reference_whisperwriter_windows_setup_2026-08-14
description: "형 PC1에 WhisperWriter(무료 Whisper 딕테이션) 설치 성공 절차+함정 — 형이 음성인식 잘 안 된다고 해서 세팅"
metadata:
  type: reference
  originSessionId: 237b10af-2489-4619-b769-c78eb3db65da
  modified: 2026-08-14T04:38:40.376Z
---

형 PC1(윈도우, 기본 파이썬 3.13 깔려있던 PC)에 시스템 전역 음성입력 도구로 WhisperWriter(github.com/savbell/whisper-writer) 설치. 목적: 윈도우 기본 Win+H 딕테이션이 고유명사(예: "클로"→"컬러") 잘 못 알아들어서 대체.

**막힌 것과 해결 순서**:
1. 기본 파이썬 3.13에서 `pip install -r requirements.txt` 하면 `ctranslate2==4.2.1`이 3.13용 wheel이 없어서 실패 → 버전핀 지우고 최신으로 깔면 일단 통과되지만
2. 다음엔 `numba==0.57.0`이 3.13 자체를 지원 안 해서 빌드 실패(numba는 항상 최신 파이썬 지원이 몇 달 늦음)
3. **근본 해결: Python 3.11을 별도 설치**(3.13은 그대로 둠, `py -3.11 -m venv venv`로 이 프로젝트 전용 가상환경) — numba 문제 해결
4. `av` 패키지도 버전핀 때문에 빌드실패 → 버전핀 제거하고 최신 설치
5. 처음 실행시 설정창에서 Save 누르면 `AttributeError: 'WhisperWriterApp' object has no attribute 'key_listener'` — **본가 코드 버그**(main.py의 cleanup()이 `self.key_listener` 존재 검사 없이 접근, 최초 설정 저장시 초기화 전 상태라 발생). `hasattr()` 가드 추가해서 직접 패치.
6. 그 다음 원인불명 조용한 종료(에러도 안 뜨고 창도 안 뜸) — `run.py`가 `subprocess.run()`으로 `main.py`를 새 프로세스로 띄우는 구조라, 자식 프로세스 stdout이 부모 리다이렉션에 안 잡힘(버퍼링). `python -u src\main.py`로 직접 실행해서 겨우 지점 확인(모델로딩 직후 죽음).
7. **진짜 원인**: 3단계에서 3.11 venv를 만들었어도 4단계에서 이미 ctranslate2 버전핀을 지워버려서 **최신(4.8.1)이 깔려있었음** — faster-whisper와 ABI 불일치로 네이티브 크래시(에러메시지 없이 프로세스 통째로 죽음, 이게 파이썬 traceback이 아예 안 뜨는 이유). `pip install ctranslate2==4.2.1`로 원래 핀 버전 재설치(3.11에선 이 버전 wheel이 있어서 설치됨) → 정상 작동.

**결론(다음에 다른 PC에 깔 때 바로 적용)**: whisper-writer는 Python **3.11 전용**으로 취급할 것. 3.13에서 시도하지 말고 처음부터 `py -3.11 -m venv venv` 만들고, requirements.txt 버전은 **손대지 말고 원본 그대로** 설치. cleanup() AttributeError 패치는 사전에 적용해두면 좋음(재발 확실).

**How to apply**: 다른 PC(개발2, 형 다른 PC 등)에 딕테이션 도구 세팅 요청 오면 이 절차 그대로(3.11 venv + 원본 requirements.txt + cleanup() 패치) 안내. 활성화키는 `ctrl+space` 사용 중(Caps Lock 단일키는 "Unknown key" 에러로 미지원 확인됨).

관련: 없음(신규)
