import React, { useState } from "react";
import { useWindowDimensions } from "react-native";
import { TabView } from "react-native-tab-view";
import TopicTabBarLists from "../topic/TopicTabBarLists";

// 재사용 가능한 탭 라우트 기본 타입
export type TabRoute = {
  key: string;
  title?: string;
  // 필요 시 확장을 위한 임의 필드 허용
  [extraField: string]: unknown;
};

interface GenericTabBarProps<TRoute extends { key: string }> {
  // 탭 라우트 목록
  routes: TRoute[];
  // 각 라우트별로 그릴 씬
  renderScene: (props: { route: TRoute }) => React.ReactNode;
  // 초기 인덱스 (비제어)
  initialIndex?: number;
  // 인덱스 변경 콜백 (외부 동기화용)
  onIndexChange?: (index: number) => void;
  // 커스텀 탭바 주입 포인트
  renderTabBar?: (props: any) => React.ReactNode;
  // TabView 옵션
  lazy?: boolean;
  swipeEnabled?: boolean;
}

const TopTabBar = <TRoute extends { key: string }>({
  routes,
  renderScene,
  initialIndex = 0,
  onIndexChange,
  renderTabBar,
  lazy = true,
  swipeEnabled = true,
}: GenericTabBarProps<TRoute>) => {
  const layout = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);

  // 내부 상태 업데이트 + 외부에 변경 알림
  const handleIndexChange = (nextIndex: number) => {
    setCurrentIndex(nextIndex);
    if (onIndexChange) onIndexChange(nextIndex);
  };

  // title 보정: label/title/key 중 하나를 TabBar가 읽을 수 있도록 title 채우기
  const normalizedRoutes = routes.map((r) => ({
    ...r,
    title: (r as any).title ?? (r as any).label ?? r.key,
  })) as TRoute[];

  return (
    <TabView<TRoute>
      navigationState={{ index: currentIndex, routes: normalizedRoutes }}
      onIndexChange={handleIndexChange}
      renderScene={renderScene as any}
      initialLayout={{ width: layout.width }}
      lazy={lazy}
      swipeEnabled={swipeEnabled}
      renderTabBar={
        renderTabBar ?? ((props) => <TopicTabBarLists {...props} />)
      }
    />
  );
};

export default TopTabBar;
