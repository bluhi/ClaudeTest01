# View-Source URL 제거기

브라우저 주소창의 URL이 `view-source:`로 시작하면 이를 감지하여 자동으로 `view-source:` 접두사를 제거한 원본 URL로 다시 표시(로드)하는 Chrome 확장 프로그램입니다.

예: `view-source:https://example.com` → `https://example.com`

## 설치 방법

1. Chrome 주소창에 `chrome://extensions`를 입력해 이동합니다.
2. 우측 상단의 "개발자 모드"를 켭니다.
3. "압축해제된 확장 프로그램을 로드합니다" 버튼을 클릭합니다.
4. 이 프로젝트 폴더(`manifest.json`이 있는 위치)를 선택합니다.

## 동작 방식

- `background.js`의 서비스 워커가 `chrome.tabs.onUpdated` / `chrome.tabs.onCreated` 이벤트를 감시합니다.
- 탭의 URL이 `view-source:`로 시작하면 해당 접두사를 제거한 URL로 `chrome.tabs.update`를 호출해 탭을 다시 로드합니다.
