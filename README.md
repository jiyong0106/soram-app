# 소람

토픽 기반 익명 매칭 앱

---

## 📱 App (Expo)

### 🛠️ 기술 스택

- **React Native** - 크로스플랫폼 프레임워크
- **Expo** - 개발 도구 및 빌드 시스템
- **TypeScript** - 타입 안정성
- **Expo Router** - 파일 기반 라우팅
- **tanstack query** - 서버 상태 관리
- **Zustand** - 전역 상태 관리
- **Socket.io Client** - 실시간 통신
- **React Hook Form** - 폼 관리
- **Lottie** - 애니메이션
- **Expo Notifications** - 푸시 알림

### 📁 프로젝트 구조

```
soram-app/
  ├─ app/                    # Expo Router 페이지
  │  ├─ (tabs)/             # 탭 네비게이션
  │  │  ├─ topic/           # 토픽 탭
  │  │  ├─ chat/            # 채팅 탭
  │  │  ├─ activity/        # 활동 탭
  │  │  ├─ profile/         # 프로필 탭
  │  │  └─ setting/         # 설정 탭
  │  ├─ (auth)/             # 인증 플로우
  │  ├─ (signup)/           # 회원가입 플로우
  │  ├─ topic/              # 토픽 상세
  │  ├─ chat/               # 채팅 상세
  │  ├─ activity/           # 활동 내역
  │  ├─ profile/            # 프로필 상세
  │  ├─ setting/            # 설정 상세
  │  └─ alerts/             # 알림
  ├─ components/            # UI 컴포넌트
  │  ├─ common/             # 공통 컴포넌트
  │  ├─ topic/              # 토픽 관련
  │  ├─ chat/               # 채팅 관련
  │  ├─ activity/           # 활동 관련
  │  ├─ profile/            # 프로필 관련
  │  ├─ signup/             # 회원가입 관련
  │  └─ settings/           # 설정 관련
  └─ utils/                 # 유틸리티
     ├─ api/                # API 함수
     ├─ hooks/              # 커스텀 훅
     ├─ store/              # Zustand 스토어
     ├─ types/              # TypeScript 타입
     └─ util/               # 유틸 함수
```

### ✨ 주요 기능

#### 1️⃣ 토픽 기반 매칭 시스템

- **질문 기반 탐색**: 토픽별 질문에 답변하며 공통 관심사 찾기
- **답변 리스트 조회**: 같은 질문에 답변한 사용자들 확인

#### 2️⃣ 실시간 채팅 & 연결 요청

- **Socket.io 기반 실시간 채팅**: 1:1 메시지 및 연결 요청
- **연결 요청 관리**: 송신/수신 요청 상태 관리
- **채팅 신고 기능**: 부적절한 대화 신고 및 차단

#### 3️⃣ 회원가입 & 프로필 관리

- **맞춤형 회원가입 플로우**: 성별, 생일, 지역, 성격, 관심사 입력
- **프로필 답변 관리**: 자신의 답변 및 관심사 표시
- **푸시 알림**: Expo Notifications로 실시간 알림

### 🎯 프로젝트 핵심

#### 1️⃣ 토큰 관리 최적화

- **Access/Refresh Token 분리**: Access Token + Refresh Token으로 역할 분리
- **자동 갱신**: Axios Interceptor로 401 발생 시 자동 토큰 갱신
- **보안 저장**: Expo SecureStore(OS 레벨 보안) + Zustand persist 결합
- **깜빡임 방지**: `onRehydrateStorage` 훅으로 토큰 복원 완료 시점 제어, 로그인 화면 깜빡임 없이 자연스러운 앱 진입

#### 2️⃣ 실시간 통신 (Socket.io)

- **단일 소켓 인스턴스**: 전역 소켓 하나로 리소스 절약, JWT 기반 `/chat` 네임스페이스 인증
- **인증 대기 메커니즘**: Promise 기반으로 소켓 인증 완료 후 이벤트 발행 보장
- **React Query 캐시 조작**: 서버 재요청 없이 캐시 쿼리키 사용해 채팅 목록 실시간 갱신
- **실시간 메시지**: `joinRoom`/`leaveRoom`/`newMessage` 이벤트로 채팅 및 읽음 상태 동기화

## 👥 팀 구성

- **Frontend 1명**
- **Backend 1명**

---
