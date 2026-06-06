# 클라이언트/통합 측 동기화 명세

## API 선택 (최종 권고)
Microsoft Graph Excel API와 OneDrive Webhook을 결합하는 방식이 가장 적합합니다. 단순히 파일 내용을 읽는 것(Read)뿐만 아니라, 데이터 변경 이벤트를 실시간으로 감지하고 클라이언트에게 알리는 구조가 필수적입니다. Office Scripts나 Power Automate는 워크플로우 자동화에 강하지만, 확장 프로그램의 '실시간 사용자 경험'을 위한 낮은 레이턴시 이벤트 처리가 어렵습니다.

## 인증 흐름 (MSAL / OAuth2)
(Chrome Extension MV3 환경 기준, 5단계 의사코드)

1.  **Authentication:** `msal-browser` 라이브러리를 사용하여 MSAL Flow를 통해 사용자 ID와 Access Token을 획득합니다. (Popup UI 또는 Content Script 초기 로드 시 실행).
2.  **Token Refresh Check:** 현재 토큰의 만료 시간을 확인하고, 유효기간 임박 시점에 백그라운드(Background Service Worker)에서 재발급 요청을 수행합니다. (지속적인 Background Task 처리 필수).
3.  **Webhook Setup:** MS Graph API를 통해 특정 파일/폴더에 대한 'Change Notification' 구독을 등록합니다. (이 단계에서 Webhook Endpoint 주소 확보 및 권한 부여 필요).
4.  **Event Reception & Diff Parsing:** 백그라운드 워커가 Webhook 알림(Payload)을 수신하고, Payload 내의 `diff` 정보를 파싱하여 어떤 행(`Row ID`)과 열(`Column Name`)이 변경되었는지 식별합니다.
5.  **Local State Update:** 파싱된 Diff 데이터만 추출하여 확장 프로그램의 로컬 스토리지 (`chrome.storage.local`)에 반영하고, Content Script가 해당 변화를 감지하여 UI 업데이트를 트리거합니다.

## 차등 폴링 vs Webhook 비교
| 구분 | Polling (차등 조회) | Webhook (이벤트 기반) | 권고 사유 |
| :--- | :--- | :--- | :--- |
| **작동 방식** | 클라이언트가 주기적으로 API를 호출하여 변경 여부를 체크. | 서버(Graph/OneDrive)에서 데이터 변경 시점에 즉시 알림을 발송. | Webhook이 압도적으로 우수함. 불필요한 트래픽과 Rate Limit 위험이 없으며, 실시간 UX 구현에 필수적임. |
| **효율성** | 낮음 (지연 및 오버헤드 발생) | 매우 높음 (변경 즉시 반응) | - |
| **Rate Limiting** | 높은 빈도로 호출 시 리스크 극대화. | 변경 이벤트만 수신하므로 리스크가 최소화됨. | Webhook 사용 필수. |

## SheetJS / exceljs 사용 권고 (오프라인 백업·import용)
클라이언트 측에서 Excel 파일을 직접 다루는 것이 불가피합니다. **SheetJS 라이브러리**를 사용하여 파일의 구조 파싱, 데이터 유효성 검사(Validation), 그리고 오프라인 데이터를 임시로 저장할 때 사용하도록 권고합니다. 이 과정에서 `MutationObserver` 패턴을 활용하여 DOM에 삽입되는 데이터를 실시간으로 모니터링하고 상태 변화를 추적하는 로직