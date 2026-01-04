import "react-native-gesture-handler";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { ChatProvider } from "./src/context/ChatContext";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { lightTheme, darkTheme } from "./src/theme/theme";

const ThemedApp: React.FC = () => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <ChatProvider>
        <AppNavigator />
        <StatusBar style={isDarkMode ? "light" : "dark"} />
      </ChatProvider>
    </PaperProvider>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ThemedApp />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
