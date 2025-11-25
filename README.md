# AI 영양제 추천 앱 💊

AI 기반 개인 맞춤형 영양제 추천 모바일 애플리케이션입니다. 사용자의 건강 정보를 단계별로 수집하고, 수집된 데이터를 기반으로 맞춤형 영양제를 추천해드립니다.

## 목차

- [문제 정의 및 개발 배경](#문제-정의-및-개발-배경)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [개발 환경](#개발-환경)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [API 키 설정](#api-키-설정)
- [빌드 방법](#빌드-방법)
- [테스트](#테스트)
- [주요 구현 특징](#주요-구현-특징)

## 문제 정의 및 개발 배경

### 문제 상황

현대인들은 다양한 건강 고민을 가지고 있으며, 이를 해결하기 위해 영양제를 복용하고자 합니다. 하지만 다음과 같은 어려움이 있습니다:

1. **정보의 과잉**: 시중에 수많은 영양제 제품이 있어 선택이 어렵습니다.
2. **개인화 부족**: 각자의 건강 상태, 생활 습관이 다른데도 획일적인 추천을 받습니다.
3. **전문 상담의 부재**: 영양 전문가와 상담하기에는 시간과 비용이 부담됩니다.
4. **복잡한 정보 수집**: 건강 정보를 체계적으로 정리하고 분석하기 어렵습니다.

### 솔루션

이 앱은 AI 기술을 활용하여 위 문제들을 해결합니다:

1. **체계적인 정보 수집**: 다단계 폼을 통해 사용자의 건강 정보를 체계적으로 수집합니다.
2. **개인화된 추천**: OpenAI GPT-4o-mini 모델을 활용하여 개인의 특성을 반영한 맞춤형 영양제를 추천합니다.
3. **접근성 향상**: 모바일 앱으로 언제 어디서나 쉽게 영양제 추천을 받을 수 있습니다.
4. **사용자 친화적 UX**: 직관적인 인터페이스와 시각적 요소로 누구나 쉽게 사용할 수 있습니다.

### 기능 구성 근거

1. **다단계 폼 설계**: 한 번에 많은 정보를 입력받으면 사용자가 부담을 느끼고 이탈할 수 있습니다. 이에 6단계로 나누어 점진적으로 정보를 수집하고, 각 단계마다 유효성 검증을 수행합니다.

2. **건강 고민 선별 및 다중 선택 기능 제공**: 사용자가 인지하지 못했던 건강고민을 쉽게 발견하고 여러가지 고민을 가지고 있을 경우를 고려하여 15가지 주요 건강 관심사를 선별하고 다중 선택이 가능하도록 설계했습니다.

3. **운동 및 수면 패턴 수집**: 영양제 추천은 단순히 증상뿐만 아니라 생활 습관도 고려해야 합니다. 운동 강도, 빈도, 수면 시간과 질을 수집하여 종합적인 추천이 가능하도록 했습니다.

4. **실제 제품 추천 및 구매 링크 제공**: 사용자가 특정 영양소가 필요하다는 것을 알아도 시중에는 다수의 제품이 있어 제품 선정에 어려움을 느끼고 실제 구매까지 이어지지 않을 수 있습니다. 이에 사용자가 필요한 영양소를 얻을 수 있는 제품을 바로 구매할 수 있도록 실제 제품 정보와 구매 링크를 함께 제공합니다.

## 주요 기능

### 1. 다단계 사용자 정보 수집

- **기본 정보**: 이름, 출생년도, 성별
- **신체 정보**: 키, 몸무게
- **의약품 정보**: 현재 복용 중인 약물
- **건강 고민**: 15가지 건강 관심사 중 선택
- **운동 습관**: 운동 여부, 빈도, 강도, 운동 시간
- **수면 패턴**: 수면 시간, 수면 품질

### 2. AI 기반 영양제 추천

- 사용자 입력 데이터 기반 개인화된 추천
- 성별, 나이, 생활습관을 종합적으로 고려
- 각 영양제별 상세 정보 제공:
  - 제품명
  - 복용량
  - 복용 빈도
  - 복용 시간
  - 구체적인 추천 이유 (~요 체, 2-3문장)
- 실제 구매 가능한 제품 추천 및 구매 링크 제공

### 3. 사용자 친화적 UX

- 직관적인 단계별 입력 폼
- 이모지와 아이콘을 활용한 시각적 선택 인터페이스
- 부드러운 화면 전환 애니메이션
- 입력 데이터 유효성 검증

## 기술 스택

### Core Technologies

- **React Native 0.81.5** - 크로스 플랫폼 모바일 앱 개발 프레임워크
- **Expo SDK 54** - 개발 및 빌드 환경 (New Architecture 활성화)
- **TypeScript 5.9.2** - 타입 안정성과 개발자 경험 향상
- **React 19.1.0** - 최신 React 기능 활용

### AI Integration

- **OpenAI API (GPT-4o-mini)** - AI 기반 영양제 추천 엔진
- **JSON Mode** - 구조화된 응답 보장

### State Management & Forms

- **React Hook Form 7.66.1** - 폼 상태 관리
- **Zustand 5.0.8** - 전역 상태 관리
- **Immer 11.0.0 & use-immer 0.11.0** - 불변성 관리

### Navigation

- **React Navigation 7.1.21** - 화면 네비게이션
- **Native Stack Navigator 7.8.0** - 네이티브 스택 네비게이션

### Data Fetching & Validation

- **TanStack React Query 5.90.10** - 서버 상태 관리 및 캐싱
- **Axios 1.13.2** - HTTP 클라이언트
- **Zod 4.1.12** - 스키마 기반 데이터 유효성 검증

### Styling

- **Emotion Native 11.11.0** - CSS-in-JS 스타일링

### Testing

- **Jest 29.7.0** - 테스팅 프레임워크
- **Jest Expo ~54.0.0** - Expo 환경 테스트 지원

## 개발 환경

### 권장 환경

- **Node.js**: v18 이상 (v20 권장)
- **npm**: v8 이상 또는 **yarn**: v1.22 이상
- **OS**: macOS, Windows, Linux

### 모바일 개발 환경

#### iOS (macOS only)

- **Xcode**: 14.0 이상
- **CocoaPods**: 최신 버전
- **iOS Simulator**: Xcode에 포함

#### Android

- **Android Studio**: Flamingo (2022.2.1) 이상
- **Android SDK**: API Level 31 이상
- **Java**: JDK 11 이상

### 선택 사항

- **Expo Go**: 실제 디바이스에서 빠른 테스트를 위한 앱 (App Store / Play Store에서 다운로드)
- **EAS CLI**: Expo 클라우드 빌드를 위한 CLI 도구

## 프로젝트 구조

```
ai-supplement/
├── App.tsx                          # 앱 진입점 및 네비게이션 설정
├── index.ts                         # 앱 루트
├── src/
│   ├── features/                    # 기능별 모듈
│   │   ├── user-form/              # 사용자 정보 입력 폼
│   │   │   ├── components/         # 각 단계별 폼 컴포넌트
│   │   │   ├── hooks/
│   │   │   │   └── useStepForm.ts  # 다단계 폼 로직
│   │   │   ├── types/
│   │   │   │   ├── index.ts
│   │   │   │   └── schemas.ts      # Zod 스키마 정의
│   │   │   ├── utils/
│   │   │   │   └── formMachine.ts  # 폼 상태 머신
│   │   │   └── __tests__/
│   │   │       └── validation.test.ts
│   │   │
│   │   └── supplement-advisor/     # AI 영양제 추천
│   │       ├── api/
│   │       │   ├── index.ts        # API 엔드포인트
│   │       │   ├── queries.ts      # React Query 훅
│   │       │   ├── mockData.ts     # 개발용 목 데이터
│   │       │   ├── responseParser.ts
│   │       │   └── retryLogic.ts
│   │       ├── components/
│   │       │   ├── Loading.tsx
│   │       │   ├── Error.tsx
│   │       │   └── Result.tsx
│   │       ├── types/
│   │       │   ├── schemas.ts      # 응답 타입 정의
│   │       │   └── errors.ts
│   │       └── __tests__/
│   │           └── schemas.test.ts
│   │
│   ├── screens/                    # 화면 컴포넌트
│   │   ├── UserFormScreen/
│   │   │   └── index.tsx
│   │   └── ResultScreen/
│   │       └── index.tsx
│   │
│   ├── shared/                     # 공통 모듈
│   │   ├── components/            # 재사용 가능한 UI 컴포넌트
│   │   ├── styles/
│   │   │   ├── theme.ts
│   │   │   └── constants.ts
│   │   └── types/
│   │       └── navigation.ts
│   │
│   └── lib/
│       └── queryClient.ts         # React Query 설정
│
├── assets/                        # 이미지 및 아이콘
├── package.json
├── tsconfig.json
├── jest.config.js
└── jest.setup.js
```

## 설치 및 실행

### 1. 저장소 클론 및 의존성 설치

```bash
# 저장소 클론
git clone [repository-url]
cd ai-supplement

# 의존성 설치
npm install

# 또는 yarn 사용
yarn install
```

### 2. 개발 서버 실행 (API 키 설정은 아래 섹션 참조)

#### 기본 실행 (QR 코드로 Expo Go 앱 연결)

```bash
npm start
```

이 명령어를 실행하면:

- 터미널에 QR 코드가 표시됩니다.
- Expo Go 앱으로 QR 코드를 스캔하여 실제 디바이스에서 테스트할 수 있습니다.
- 브라우저에서 Expo Dev Tools가 열립니다.

#### iOS 시뮬레이터에서 실행 (macOS only)

```bash
npm run ios
```

**주의사항**:

- Xcode와 iOS Simulator가 설치되어 있어야 합니다.
- 처음 실행 시 CocoaPods 설치로 인해 시간이 걸릴 수 있습니다.

#### Android 에뮬레이터에서 실행

```bash
npm run android
```

**주의사항**:

- Android Studio와 Android SDK가 설치되어 있어야 합니다.
- Android 에뮬레이터가 실행 중이어야 합니다.
- `ANDROID_HOME` 환경 변수가 설정되어 있어야 합니다.

```bash
# macOS/Linux에서 ANDROID_HOME 설정 예시
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## API 키 설정

이 앱은 OpenAI API를 사용하여 영양제를 추천합니다. API 키 설정은 **선택 사항**이며, 키가 없어도 Mock 데이터로 전체 기능을 테스트할 수 있습니다.

### Option 1: API 키 없이 테스트

API 키를 설정하지 않으면 **자동으로 Mock 데이터를 사용**하여 앱의 전체 플로우를 체험할 수 있습니다.

```bash
# 별도 설정 없이 바로 실행
npm start
```

### Option 2: OpenAI API 키 사용

실제 AI 추천 기능을 사용하려면 OpenAI API 키가 필요합니다.

#### 2-1. OpenAI API 키 발급

1. [OpenAI Platform](https://platform.openai.com/api-keys)에 접속합니다.
2. 계정 생성 또는 로그인합니다.
3. "Create new secret key" 버튼을 클릭하여 새 API 키를 생성합니다.
4. 생성된 키를 안전한 곳에 복사해둡니다. (한 번만 표시됩니다)

#### 2-2. .env 파일 생성

프로젝트에 제공된 `.env.example` 파일을 복사하여 `.env` 파일을 생성합니다:

```bash
# .env.example을 복사하여 .env 파일 생성
cp .env.example .env
```

또는 직접 생성:

```bash
# 프로젝트 루트에 .env 파일 생성
touch .env
```

#### 2-3. API 키 설정

`.env` 파일에 다음 내용을 입력합니다:

```bash
# .env 파일
EXPO_PUBLIC_OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**중요 사항**:

- `EXPO_PUBLIC_` 접두사는 반드시 포함되어야 합니다. (Expo의 환경 변수 규칙)
- API 키는 `sk-proj-`로 시작합니다.
- 따옴표는 사용하지 않습니다.
- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

#### 2-4. 앱 재시작

환경 변수 변경 사항을 적용하려면 개발 서버를 재시작해야 합니다:

```bash
# 개발 서버 종료 (Ctrl + C)
# 캐시 삭제 후 재시작
npm start -- --clear
```

### API 키 확인

앱을 실행하면 터미널에 다음과 같은 로그가 표시됩니다:

- **API 키 있음**: `🔵 OpenAI API 호출 시작...`
- **API 키 없음**: `⚠️ API Key가 없어 Mock Data를 사용합니다.`

### 비용 안내

- OpenAI GPT-4o-mini 모델 사용 시 약 1회당 $0.001 정도의 비용이 발생합니다.
- 새 계정 가입 시 무료 크레딧이 제공됩니다.
- 자세한 가격은 [OpenAI Pricing](https://openai.com/pricing)을 참고하세요.

## 빌드 방법

### Development Build (개발용)

개발 중에는 로컬 빌드를 사용하는 것이 가장 빠릅니다:

```bash
# iOS (macOS only)
npx expo run:ios

# Android
npx expo run:android
```

### 로컬 빌드 (고급)

EAS를 사용하지 않고 순수 React Native로 로컬 빌드:

```bash
# Expo prebuild로 네이티브 프로젝트 생성
npx expo prebuild

# iOS 빌드 (macOS only)
cd ios
pod install
cd ..
npx expo run:ios

# Android 빌드
npx expo run:android
```

## 테스트

```bash
# 전체 테스트 실행
npm test

# Watch 모드로 테스트 실행
npm run test:watch

# 커버리지 포함 테스트
npm run test:coverage
```

## 주요 구현 특징

### 1. 타입 안정성

- Zod를 활용한 런타임 타입 검증
- TypeScript로 컴파일 타임 타입 체크
- 엄격한 타입 정의로 버그 사전 방지

### 2. 폼 관리

- React Hook Form을 통한 효율적인 폼 상태 관리
- 단계별 유효성 검증
- 사용자 입력 데이터의 불변성 보장

### 3. 데이터 페칭 및 캐싱

- TanStack React Query를 활용한 서버 상태 관리
- 자동 재시도 로직
- 스마트 캐싱 전략 (10분 fresh, 30분 gc)

### 4. 에러 처리

- 커스텀 에러 타입 정의
- 사용자 친화적인 에러 메시지
- 재시도 및 복구 로직

### 5. 컴포넌트 설계

- 재사용 가능한 UI 컴포넌트 라이브러리
- 관심사의 분리 (Separation of Concerns)
- Feature-based 폴더 구조
