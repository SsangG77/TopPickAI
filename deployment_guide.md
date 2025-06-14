# Firebase 웹 애플리케이션 배포 가이드: 과정, 원리, 오류 해결 총정리

Firebase는 Google Cloud Platform(GCP) 위에 구축된 모바일 및 웹 애플리케이션 개발 플랫폼입니다. 개발자가 서버 인프라를 직접 관리하지 않아도 앱을 빠르게 구축하고 배포할 수 있도록 다양한 서버리스 서비스를 제공합니다.

**배포 목표:**
*   **프론트엔드 (React 앱)**: Firebase Hosting을 통해 전 세계에 정적 웹사이트 형태로 배포.
*   **백엔드 (Node.js Express 앱)**: Firebase Functions를 통해 서버리스 API 형태로 배포.
*   두 서비스가 서로 연동되어 앱이 완벽하게 작동하도록 설정.

---

## 1. 배포 전 준비물

*   **Google 계정**: Firebase 프로젝트 생성 및 관리에 필요합니다.
*   **Firebase 프로젝트**: 이미 생성되어 있어야 하며, 본 가이드에서는 `toppick-ai` 프로젝트 ID를 예시로 사용합니다. 실제 프로젝트 ID로 대체해야 합니다.
*   **Node.js 및 npm**: 개발 환경에 설치되어 있어야 합니다.
*   **터미널/명령 프롬프트**: 모든 명령을 실행합니다.
*   **`backend/serviceAccountKey.json`**: Firebase Admin SDK 초기화에 사용되는 서비스 계정 키 파일. **이 파일은 나중에 `functions` 디렉토리로 이동시킬 것입니다.**

---

## 2. Firebase CLI 설치 및 로그인

*   **역할/원리**: Firebase CLI (Command Line Interface)는 로컬 개발 환경에서 Firebase 서비스와 상호작용하기 위한 도구입니다. 프로젝트 초기화, 배포, 환경 변수 설정 등 대부분의 Firebase 관련 작업을 터미널에서 수행할 수 있게 합니다.

    1.  **Firebase CLI 전역 설치**:
        *   **명령어**:
            ```bash
            sudo npm install -g firebase-tools
            ```
        *   **원리**: `npm install -g`는 패키지를 시스템 전역에 설치하여 어떤 디렉토리에서든 해당 명령어를 사용할 수 있게 합니다. `sudo`는 `EACCES: permission denied` (권한 거부) 오류를 해결하기 위해 사용됩니다. `/usr/local/lib/node_modules`와 같은 시스템 경로에 파일을 쓰려면 관리자 권한이 필요하기 때문입니다.
        *   **(`EACCES` 오류 해결)**: 이전에 발생했던 `EACCES` 에러는 이 `sudo`를 사용하여 해결됩니다.
        *   **비밀번호 입력**: 비밀번호를 입력하라는 메시지가 나오면 사용자 계정의 비밀번호를 입력합니다. (입력 시 터미널에 아무것도 표시되지 않는 것이 정상입니다.)

    2.  **Firebase 로그인**:
        *   **명령어**:
            ```bash
            firebase login
            ```
        *   **원리**: 이 명령을 실행하면 웹 브라우저가 자동으로 열리고 Google 계정으로 로그인하라는 메시지가 나타납니다. 로그인 절차를 완료하면 "Firebase CLI is successfully logged in." 메시지가 터미널에 표시되며, 로컬 환경에서 Firebase 프로젝트에 접근할 수 있는 인증 정보가 설정됩니다.

---

## 3. 프론트엔드 배포: Firebase Hosting

*   **역할/원리**: Firebase Hosting은 웹 애플리케이션의 정적 파일(HTML, CSS, JavaScript, 이미지 등)을 전 세계에 분산된 CDN(Content Delivery Network)에 업로드하여 사용자에게 빠르고 안전하게 제공하는 서비스입니다. 별도의 웹 서버를 설정하거나 관리할 필요가 없습니다.

    1.  **`frontend` 디렉토리로 이동**:
        *   **명령어**: (프로젝트 루트 디렉토리에서)
            ```bash
            cd "frontend"
            ```
        *   **원리**: React 앱의 소스 코드가 있는 디렉토리로 이동하여 `firebase init hosting` 명령이 올바른 위치에 설정 파일을 생성하도록 합니다.

    2.  **Firebase Hosting 초기화**:
        *   **명령어**: (현재 `frontend` 디렉토리에서)
            ```bash
            firebase init hosting
            ```
        *   **원리**: 현재 디렉토리를 Firebase Hosting과 연결하고, 배포 관련 설정을 진행합니다. 이 설정은 `frontend/firebase.json` 파일에 기록됩니다.
        *   **질문과 답변**:
            *   `? Please select an option:` **`Use an existing project`** (화살표 키로 선택 후 엔터)
            *   `? Select a default Firebase project for this directory:` **`toppick-ai`** (또는 본인의 Firebase 프로젝트 ID 선택 후 엔터)
            *   `? What do you want to use as your public directory? (public)` **`build`** (React 앱이 빌드된 결과물이 저장되는 폴더명입니다. **이전의 잘못된 답변(`public`)으로 인해 발생할 수 있는 문제를 방지합니다.**)
            *   `? Configure as a single-page app (rewrite all urls to /index.html)? (Y/n)` **`Y`** (React 앱은 SPA이므로, 어떤 경로로 접근해도 `index.html`을 보여주도록 설정합니다.)
            *   `? Set up automatic builds and deploys with GitHub? (Y/n)` **`n`** (지금은 GitHub 연동 없이 수동으로 배포합니다.)
            *   `? File build/index.html already exists. Overwrite? (y/N)` **`N`** (만약 이 질문이 나오면 기존 파일을 덮어쓰지 않도록 `N`을 선택합니다.)

    3.  **React 앱 빌드**:
        *   **명령어**: (현재 `frontend` 디렉토리에서)
            ```bash
            npm run build
            ```
        *   **원리**: 개발 편의를 위해 작성된 React 소스 코드(JSX, ES6+, TypeScript 등)를 웹 브라우저가 직접 이해할 수 있는 순수 HTML, CSS, JavaScript 파일들로 "컴파일" 또는 "번들링"하는 과정입니다. 이 결과물은 `frontend/build` 폴더에 생성됩니다.

    4.  **Firebase Hosting에 배포**:
        *   **명령어**: (현재 `frontend` 디렉토리에서)
            ```bash
            firebase deploy --only hosting
            ```
        *   **원리**: `frontend/build` 폴더에 있는 모든 정적 파일을 Firebase Hosting 서비스로 업로드하고 전 세계 CDN에 배포합니다. 배포가 완료되면 터미널에 웹 앱에 접근할 수 있는 `Hosting URL` (예: `https://YOUR_PROJECT_ID.web.app`)이 표시됩니다. 이 URL을 메모해두세요.

---

## 4. 백엔드 배포: Firebase Functions

*   **역할/원리**: Firebase Functions (Google Cloud Functions 기반)는 서버를 직접 관리할 필요 없는 서버리스 컴퓨팅 서비스입니다. Node.js 코드를 작성하여 특정 HTTP 요청에 따라 실행되는 API 엔드포인트를 만들 수 있습니다. 사용한 만큼만 비용을 지불하며 트래픽에 따라 자동으로 확장됩니다.

    1.  **프로젝트 최상위 디렉토리로 이동**:
        *   **명령어**: (현재 `frontend` 디렉토리에서)
            ```bash
            cd ..
            ```
        *   **원리**: Firebase Functions는 일반적으로 프로젝트의 루트 디렉토리에서 초기화됩니다.

    2.  **Firebase Functions 초기화**:
        *   **명령어**: (현재 프로젝트 루트 디렉토리에서)
            ```bash
            firebase init functions
            ```
        *   **원리**: 현재 프로젝트를 Firebase Functions와 연결하고, 클라우드 함수 코드를 작성할 `functions` 폴더를 생성합니다.
        *   **질문과 답변**:
            *   `? Please select an option:` **`Use an existing project`** (화살표 키로 선택 후 엔터)
            *   `? Select a default Firebase project for this directory:` **`toppick-ai`** (또는 본인의 Firebase 프로젝트 ID 선택 후 엔터)
            *   `? What language would you like to use to write Cloud Functions? (JavaScript)` **`JavaScript`** (엔터)
            *   `? Do you want to use ESLint to catch probable bugs and enforce style? (Y/n)` **`Y`** (ESLint는 코드 스타일 및 잠재적 오류를 검사하여 코드 품질을 높여줍니다. **이전에 발생했던 `eslint` 오류 해결에 필요합니다.**)
            *   `? Do you want to install dependencies with npm now? (Y/n)` **`Y`**

    3.  **백엔드 코드 마이그레이션 및 설정 (수동 작업)**:
        *   **원리**: 기존 Node.js Express 백엔드 코드를 Functions 환경에 맞게 조정하고, 필요한 설정들을 옮겨주는 과정입니다.
        *   **`backend/serviceAccountKey.json` 파일 이동**:
            *   `TopPickAI/backend/serviceAccountKey.json` 파일을 `TopPickAI/functions/serviceAccountKey.json`으로 **이동**시킵니다.
            *   **원리**: Firebase Admin SDK는 서비스 계정 키를 통해 Firebase 프로젝트에 서버 측에서 접근할 수 있는 권한을 얻습니다. Functions에서 이 키를 사용하려면 Functions 배포 패키지 안에 키 파일이 포함되어야 합니다.
        *   **`backend/server.js` 내용 `functions/index.js`로 이동**:
            1.  `backend/server.js` 파일의 **모든 내용**을 복사합니다.
            2.  `functions/index.js` 파일을 열고, 기존에 있던 내용을 **모두 지운 뒤** 복사한 내용을 붙여넣습니다.
            3.  **Express 앱 내보내기 추가**: `functions/index.js` 파일의 **가장 마지막 부분**에 다음 한 줄을 추가하여 Express 앱을 Firebase Function으로 내보냅니다. (기존 `module.exports` 등 다른 내보내기 코드가 있었다면 삭제)
                ```javascript
                exports.api = functions.https.onRequest(app);
                ```
            4.  **`app.listen()` 제거**: `functions/index.js` 파일에서 `app.listen(...)`으로 시작하는 줄을 **제거하거나 주석 처리**합니다.
                ```javascript
                // const port = process.env.PORT || 5000; // 이 줄도 제거합니다.
                // app.listen(port, () => {
                //   console.log(`Server is running on port ${port}`);
                // });
                ```
                *   **원리**: Cloud Functions는 Firebase가 요청을 받아 함수를 직접 실행하는 서버리스 환경이므로, Express 앱이 직접 포트를 수신 대기할 필요가 없습니다. 이 코드가 있으면 배포 시 `EADDRINUSE` (Address already in use) 오류가 발생합니다.
                *   **(`EADDRINUSE` 오류 해결)**: 이전에 발생했던 포트 사용 오류는 이 `app.listen()` 제거로 해결됩니다.
                *   **ESLint `'port' is assigned a value but never used` 오류 해결**: `port` 변수를 더 이상 사용하지 않으므로, 이 변수 선언도 함께 제거합니다.
        *   **임포트 문 확인 및 `dotenv` 제거**: `functions/index.js` 파일 상단에 `firebase-functions`, `firebase-admin`, `express`, `cors`, `axios` 등 `server.js`에서 사용하던 모든 `require` 구문이 있는지 확인합니다.
            ```javascript
            const functions = require("firebase-functions");
            const admin = require("firebase-admin");
            const express = require("express");
            const cors = require("cors");
            const axios = require("axios"); // 이 줄이 없었으면 추가하세요!
            // require('dotenv').config({ path: '../backend/.env' }); // 이 줄은 반드시 제거합니다.
            ```
        *   **Firebase Admin SDK 초기화 코드 수정**:
            `admin.initializeApp` 부분을 찾아 `databaseURL`이 환경 변수에서 가져오도록 수정합니다.
            ```javascript
            const serviceAccount = require("./serviceAccountKey.json");

            admin.initializeApp({
              credential: admin.credential.cert(serviceAccount),
              databaseURL: functions.config().app.database_url // 환경 변수 이름과 일치
            });
            ```
        *   **Stability AI API 키 사용 코드 수정**:
            `axios.post` 호출 부분에서 `Authorization` 헤더를 찾아 `STABILITY_API_KEY`가 환경 변수에서 가져오도록 수정합니다.
            ```javascript
            Authorization: `Bearer ${functions.config().stability.api_key}`,
            ```
        *   **ESLint `max-len` (줄 길이) 및 `indent` (들여쓰기) 오류 해결**:
            *   `functions/index.js` 파일에서 긴 줄을 여러 줄로 나누고, 들여쓰기 공백 수(일반적으로 2칸 또는 4칸, ESLint 설정에 따라 8칸)를 맞춥니다.
            *   **원리**: Firebase Functions 배포 전 `npm run lint` 스크립트가 실행되어 코드 품질을 검사합니다. 이러한 스타일 규칙을 준수하지 않으면 배포가 실패합니다.

        *   **파일 저장**: `functions/index.js` 파일을 저장합니다.

    4.  **Cloud Functions 환경 변수 설정**:
        *   **원리**: API 키나 데이터베이스 URL과 같은 민감한 정보는 코드에 직접 포함하거나 Git에 올리면 안 됩니다. Firebase Functions는 이러한 정보를 안전하게 저장하고 함수 내에서 접근할 수 있도록 환경 변수 관리 기능을 제공합니다.
        *   **명령어**: (현재 프로젝트 루트 디렉토리에서)
            ```bash
            firebase functions:config:set stability.api_key="YOUR_STABILITY_API_KEY" app.database_url="YOUR_FIREBASE_DATABASE_URL"
            ```
            *   **(`Error: Cannot set to reserved namespace firebase` 해결)**: `firebase`는 예약된 이름 공간이므로 `app.database_url`처럼 다른 이름 공간을 사용해야 합니다.
            *   **`YOUR_STABILITY_API_KEY`**: 이 부분은 `.env` 파일에 있던 실제 Stability AI API 키 값으로 **반드시 교체**해야 합니다.
            *   **`YOUR_FIREBASE_DATABASE_URL`**: 이 부분은 `.env` 파일에 있던 실제 Firebase Realtime Database URL 값으로 **반드시 교체**해야 합니다.
            *   **원리**: 위 명령으로 설정한 환경 변수 값은 `functions.config().서비스이름.변수명` 형태로 Cloud Functions 코드 내에서 접근 가능합니다.

    5.  **`functions` 디렉토리 `package.json` 수정 및 종속성 설치**:
        *   **`functions/package.json` 파일 수정**:
            `functions/package.json` 파일의 `"dependencies"` 섹션에 `axios`, `express`, `cors`가 포함되어 있는지 확인하거나 추가합니다.
            ```json
            "dependencies": {
              "firebase-admin": "^12.6.0",
              "firebase-functions": "^6.0.1",
              "axios": "^1.7.2",   // 추가
              "express": "^4.19.2", // 추가
              "cors": "^2.8.5"     // 추가
            },
            ```
            *   **원리**: 백엔드 코드가 외부 패키지를 사용하므로, 이 패키지들이 Functions 환경에 설치되어야 합니다. `functions` 폴더의 `package.json`에 필요한 모든 종속성을 명시하고 `npm install`을 실행하여 이를 설치합니다.
            *   **(`Cannot find module 'axios'` 오류 해결)**: 이전에 발생했던 `axios` 모듈을 찾을 수 없다는 오류는 `package.json`에 `axios`를 추가하고 `npm install`을 다시 실행하여 해결됩니다.
        *   **명령어**:
            ```bash
            cd functions
            npm install
            ```
        *   설치 완료 후 다시 프로젝트 최상위 디렉토리로 돌아옵니다: `cd ..`

    6.  **Firebase Functions 배포**:
        *   **명령어**: (현재 프로젝트 루트 디렉토리에서)
            ```bash
            firebase deploy --only functions
            ```
        *   **원리**: `functions` 폴더에 있는 모든 코드와 종속성을 Google Cloud Functions 서비스로 업로드하고 배포합니다. 이 과정에서 ESLint 검사도 다시 실행됩니다. 배포가 완료되면 터미널에 백엔드 API의 `Function URL` (예: `https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api`)이 표시됩니다. 이 URL을 메모해두세요. 이 URL을 통해 프론트엔드에서 백엔드를 호출할 수 있게 됩니다.

---

## 5. 프론트엔드와 백엔드 연결 업데이트 및 재배포

*   **역할/원리**: 프론트엔드 앱이 배포된 백엔드 API를 올바르게 호출하고, 웹 브라우저의 보안 정책(CORS)에 따라 요청이 허용되도록 설정을 업데이트합니다.

    1.  **`frontend/src/App.js` 파일 수정**:
        *   **원리**: 프론트엔드 앱은 백엔드 API의 공개적인 접근 주소(URL)를 알아야 합니다. 이 URL은 Functions 배포 후 결정됩니다.
        *   코드 편집기에서 `frontend/src/App.js` 파일을 열고, 파일 내에서 `API_URL` 변수를 찾아 4단계에서 얻은 **`Function URL`**로 변경합니다.
            ```javascript
            // frontend/src/App.js

            const API_URL = 'https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api'; // YOUR_PROJECT_ID는 실제 프로젝트 ID (예: toppick-ai)로 교체
            ```
        *   파일을 저장합니다.

    2.  **`functions/index.js` CORS `origin` 업데이트 (최종 확인)**:
        *   **원리**: `CORS (Cross-Origin Resource Sharing)`는 웹 브라우저의 보안 정책입니다. 배포된 프론트엔드(`https://YOUR_PROJECT_ID.web.app`)가 배포된 백엔드(Functions URL)에 요청을 보낼 때, 백엔드는 해당 요청의 출처(Origin)를 확인합니다. `functions/index.js`의 `cors` 설정에서 `origin`을 다음과 같이 변경했는지 **다시 한번 확인**합니다.
            ```javascript
            // ... existing code ...
            app.use(cors({
              origin: "https://YOUR_PROJECT_ID.web.app", // 여기에 실제 프론트엔드 Hosting URL을 넣어야 합니다.
              methods: ["GET", "POST"],
              credentials: true,
            }));
            // ... existing code ...
            ```
            *   **`YOUR_PROJECT_ID`**: 이전에 프론트엔드 배포 시 얻었던 `Hosting URL` (예: `https://toppick-ai.web.app`)에서 프로젝트 ID를 가져와 사용합니다.

    3.  **`frontend` 디렉토리로 이동**:
        *   **명령어**: (프로젝트 루트 디렉토리에서)
            ```bash
            cd frontend
            ```

    4.  **React 앱 재빌드**:
        *   **명령어**: (현재 `frontend` 디렉토리에서)
            ```bash
            npm run build
            ```
        *   **원리**: `App.js`에서 `API_URL`을 변경했으므로, 이 변경사항이 최종 사용자에게 적용되려면 React 앱을 다시 빌드해야 합니다.

    5.  **Firebase Hosting에 재배포**:
        *   **명령어**: (현재 `frontend` 디렉토리에서)
            ```bash
            firebase deploy --only hosting
            ```
        *   **원리**: 새로 빌드된 프론트엔드 파일을 Firebase Hosting에 다시 업로드하여 업데이트된 버전을 배포합니다.

---

## 6. 최종 확인

*   모든 배포가 완료되면, 웹 브라우저에서 **프론트엔드 배포 시 얻었던 `Hosting URL`** (예: `https://YOUR_PROJECT_ID.web.app`)로 접속하여 앱이 인터넷에서 정상적으로 작동하는지 확인합니다.
*   이미지 생성 버튼을 눌러보세요. 백엔드 Functions가 호출되고 이미지가 정상적으로 생성되는지, 그리고 단어 랭킹이 업데이트되는지 확인합니다.
*   문제가 발생하면 브라우저 개발자 도구(F12)의 **Console** 탭과 **Network** 탭에서 오류 메시지를 확인하여 문제를 진단할 수 있습니다.

---
