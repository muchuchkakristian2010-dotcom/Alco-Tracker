import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DaysProvider } from "../src/state/DaysProvider";
import { colors, fonts } from "../src/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <DaysProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.paper },
            headerTitleStyle: { fontFamily: fonts.display, color: colors.ink },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="edit/[date]"
            options={{ presentation: "modal", animation: "slide_from_bottom" }}
          />
        </Stack>
      </DaysProvider>
    </SafeAreaProvider>
  );
}
