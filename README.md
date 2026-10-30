# art — 아트공조 데모

시스템에어컨 업체 아트공조의 반응형 웹사이트 데모입니다. HTML, CSS, JavaScript로 작성되어 별도 설치나 빌드 없이 실행할 수 있습니다.

## 로컬 실행

Node.js가 설치된 환경에서 아래 명령을 실행합니다.

```sh
node preview.mjs
```

브라우저에서 `http://127.0.0.1:4173`을 엽니다. 이 주소는 실행 중인 컴퓨터의 로컬 미리보기용입니다.

## 주요 기능

- 삼성·LG 선택 후 고객정보 → 견적기준 → 옵션 → 할인 → 최종확인의 5단계 견적
- 옵션과 할인에 따른 금액 계산, 견적서 인쇄 및 브라우저 PDF 저장
- 아파트 사례 검색, 시공사례 필터, 상업공간 상담 체험
- 모바일 메뉴, 반응형 화면, Pretendard 한글 웹폰트

## 파일 구성

| 경로 | 용도 |
| --- | --- |
| `dist/index.html` | 메인 페이지와 콘텐츠 |
| `dist/style.css` | 레이아웃 및 Pretendard 한글 스타일 |
| `dist/config.js` | 업체명, 예시 연락처·주소, 가상 아파트 데이터 |
| `dist/app.js` | 검색, 상담 체험, 콘텐츠 창 |
| `dist/quote.js`, `dist/quote.css` | 견적 계산과 단계별 화면 |
| `dist/assets/` | 로고 및 AI 공간 연출 이미지 |
| `preview.mjs` | 로컬 정적 서버 |
| `quote-check.mjs` | 견적 계산 및 공개 옵션 검사 |
| `vercel.json` | Vercel 정적 배포 설정 (`dist` 출력) |
| `.openai/hosting.json` | 기존 Sites 배포 식별자·설정 |

## 검사

```sh
node --check dist/app.js
node --check dist/quote.js
node quote-check.mjs
```

견적 계산과 옵션 데이터의 일관성 검사 14개를 포함합니다.

## 배포와 Git 동기화

정적 호스팅 시 `dist` 폴더를 배포합니다. Vercel 프로젝트는 저장소 루트를 Root Directory로 사용하며 `vercel.json`이 출력 디렉토리와 빌드 생략 설정을 지정합니다.

- Vercel: [아트공조 공개 데모](https://art-one-rho.vercel.app/) — GitHub `main`에 push하면 연결된 프로젝트가 자동으로 배포됩니다.
- Sites: [기존 아트공조 데모](https://artgongjo-demo-1030.nettman001.chatgpt.site) — 접근 범위는 Sites 설정을 따르며, GitHub push와 별도로 배포해야 합니다.

```sh
git pull --ff-only origin main
git push origin main
```

## 데모 안내

연락처·주소·가격·상담현황·시공사례는 모두 체험용 예시입니다. 공간 이미지는 AI로 생성했으며 실제 시공 실적을 나타내지 않습니다. 이미지 생성 정보는 `dist/assets/asset-sources.json`에 기록되어 있습니다.

상담 폼은 입력 정보를 서버로 전송하거나 브라우저에 영구 저장하지 않습니다. 폰트는 사용자 지정 Pretendard CDN에서 불러옵니다. 실제 서비스로 전환할 때는 운영 정보와 상담 전송 기능을 연결해야 합니다.
