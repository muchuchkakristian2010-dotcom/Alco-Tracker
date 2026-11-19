import { Tabs } from "expo-router";
import { Platform } from "react-native";
import {
  CalendarTabIcon,
  SettingsTabIcon,
  StatsTabIcon,
  TodayTabIcon,
} from "../../src/components/Icons";
import { colors, fonts } from "../../src/theme";

const ACTIVE = colors.ink;
const INACTIVE = colors.mute;

function tabIcon(Icon: (p: { size?: number; color?: string }) => React.ReactElement) {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <Icon size={focused ? 23 : 21} color={color} />
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.paper, borderBottomColor: colors.line, borderBottomWidth: 1 },
        headerTitleStyle: { fontFamily: fonts.display, fontSize: 21, color: colors.ink },
        headerShadowVisible: false,
        tabBarActiveTintColor: ACTIVE,
        tabBarInactiveTintColor: INACTIVE,
        tabBarStyle: {
          backgroundColor: colors.paper,
          borderTopColor: colors.line,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 84 : 66,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 10, letterSpacing: 1.1, textTransform: "uppercase", fontWeight: "600" },
        sceneStyle: { backgroundColor: colors.paper },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Ясно", tabBarLabel: "Сегодня", tabBarIcon: tabIcon(TodayTabIcon) }}
      />
      <Tabs.Screen
        name="calendar"
        options={{ title: "Календарь", tabBarLabel: "Календарь", tabBarIcon: tabIcon(CalendarTabIcon) }}
      />
      <Tabs.Screen
        name="stats"
        options={{ title: "Статистика", tabBarLabel: "Статистика", tabBarIcon: tabIcon(StatsTabIcon) }}
      />
      <Tabs.Screen
        name="settings"
        options={{ title: "Настройки", tabBarLabel: "Настройки", tabBarIcon: tabIcon(SettingsTabIcon) }}
      />
    </Tabs>
  );
}
