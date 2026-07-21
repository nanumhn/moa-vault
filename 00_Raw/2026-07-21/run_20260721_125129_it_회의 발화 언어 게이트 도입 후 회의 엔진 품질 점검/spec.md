# Suno Auto Extension — Spec v1

## 목적
Chrome 확장 프로그램을 통해 회의 참여 및 동작을 자동화하여 사용자의 효율성을 높이고, 실시간 업데이트를 지원합니다.

## 범위 (In / Out)
- In: 로그인 버튼 클릭, 참가자 목록 업데이트, 실시간 UI 변경 감지
- Out (v2로 미룸): 대규모 회의 성능 최적화

## 아키텍처
- manifest.json 권한: `permissions: ["activeTab", "storage"]`
- 모듈: popup, content script, background
- 데이터 흐름: 사용자 입력 → DOM 자동입력 → 진행 감지 → 다운로드

## 리스크 & 완화
- (리스크 1) DB 성능 저하 → 캐싱 및 로드 밸анс링 적용
- (리스크 2) UI 변경 대응 능력 부족 → Mutation Observer 사용

## 마일스톤
- M1: 권한 설정 완료 (D-3)
- M2: content script 작성 (D-5)
- M3: 테스트 및 리뷰 완료 (D-7)