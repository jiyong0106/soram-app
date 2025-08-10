export default ({ config }: any) => {
  return {
    ...config, // 기본 Expo 설정을 상속

    // Expo 앱의 메타 정보
    expo: {
      name: "소람", // 앱 이름 (기기에서 표시됨)
      slug: "soram", // Expo에서 사용하는 고유 ID (프로젝트 슬러그)
      version: "1.0.0", // 앱 버전
      orientation: "portrait", // 화면 방향 고정 (세로)
      icon: "./assets/icons/logos/012.png", // 앱 아이콘 경로
      scheme: "soram", // 딥링크를 위한 URL 스킴 (ex: soram://)
      userInterfaceStyle: "automatic", // 다크모드/라이트모드 자동 감지
      newArchEnabled: true, // React Native New Architecture 사용 여부

      // iOS 관련 설정
      ios: {
        bundleIdentifier: "team.soram.soram",
        supportsTablet: false, // 태블릿 지원 여부 (false면 iPad 레이아웃 제한)
        icon: "./assets/icons/logos/012.png",
        infoPlist: {
          CFBundleDevelopmentRegion: "ko", //앱 기본 언어를 한국어로 지정.
          ITSAppUsesNonExemptEncryption: false, // 암호화 사용 x
        },
        splash: {
          image: "./assets/icons/logos/012.png",
          resizeMode: "cover",
          backgroundColor: "#ffffff",
        },
      },

      // Android 관련 설정
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/icons/logos/012.png", // 안드로이드 적응형 아이콘 이미지
          backgroundColor: "#ffffff", // 아이콘 배경 색
        },
        edgeToEdgeEnabled: true, // 상태바와 네비게이션바를 투명하게 처리 (엣지 투 엣지 모드)
      },

      // 웹 앱 관련 설정
      web: {
        bundler: "metro", // Expo 웹 번들러 (기본: metro)
        output: "static", // 정적 파일로 출력 (Next.js처럼 활용 가능)
        favicon: "./assets/icons/logos/012.png", // 웹 파비콘
      },

      // Expo 플러그인 목록
      plugins: [
        "expo-router", // 파일 기반 라우팅 지원
        "expo-font",
        [
          "expo-splash-screen",
          {
            image: "./assets/icons/logos/012.png", // 스플래시 이미지
            imageWidth: 200, // 이미지 너비
            resizeMode: "contain", // 이미지 리사이징 모드
            backgroundColor: "#ffffff", // 스플래시 배경색
          },
        ],
      ],

      // 실험적 기능 활성화
      experiments: {
        typedRoutes: true, // expo-router에서 타입 기반 라우팅 지원
      },

      // 추가 설정값들
      extra: {
        router: {
          origin: false, // `expo-router`에서 전체 URL이 아닌 경로만 사용
        },
        eas: {
          projectId: "5d53928d-b748-49ad-9512-9442d130e4b8", // EAS(Expo Application Services) 프로젝트 ID
        },
      },

      // Expo 오거나이제이션 소유자
      owner: "dev-society", // Expo 계정 또는 조직 이름 (expo.dev에서 관리)
    },
  };
};
