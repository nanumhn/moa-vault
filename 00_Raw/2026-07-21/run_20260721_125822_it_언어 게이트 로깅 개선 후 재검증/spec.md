# Suno Auto Extension — Spec v1

## 목적
Suno Auto Extension은 사용자에게 블로그 포스팅을 자동으로 작성하고, 다운로드하는 기능을 제공합니다.

## 범위 (In / Out)
- In: Chrome 확장 프로그램으로 DOM 자동입력 및 진행 감지
- Out (v2로 미룸): 데이터베이스 캐싱

## 아키텍처
- manifest.json 권한: "activeTab", "storage"
- 모듈: popup, content script, background
- 데이터 흐름: 텍스트 → DOM 자동입력 → 진행 감지 → 다운로드

## 리스크 & 완화
- (리스크 1) DB 쓰기 권한 부족 → 파일 소유권 수정 및 대시보드 확인
- (리스크 2) 로깅 모듈과 비즈니스 로직 간 분리 불가능 → 모듈 별 권한 정의 및 분리된 설계

## 마일스톤
- M1: 모듈 구조 설정 및 데이터 흐름 확정 (D-3)
- M2: content script와 background script 개발 완료 (D-5)
- M3: UI 디자인 최적화 및 사용자 흐름 검증 (D-7)