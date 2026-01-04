import React, { useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  NavigationContainer,
  NavigationContainerRef,
} from "@react-navigation/native";
import { Text, Button, Switch, Divider, useTheme } from "react-native-paper";
import * as Notifications from "expo-notifications";
import { ChatScreen } from "../screens/ChatScreen";
import { AnalyticsScreen } from "../screens/AnalyticsScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { SignupScreen } from "../screens/SignupScreen";
import { ForgotPasswordScreen } from "../screens/ForgotPasswordScreen";
import { useChat } from "../context/ChatContext";
import { useTheme as useAppTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { SessionItem } from "../components/SessionItem";
import { Logo } from "../components/Logo";
import { solApi } from "../api/solApi";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Navigation reference for handling notification taps
export const navigationRef = React.createRef<NavigationContainerRef<any>>();

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const { user, logout, isAuthenticated } = useAuth();
  const {
    sessions,
    currentSession,
    loadSessions,
    selectSession,
    createNewChat,
    deleteSession,
  } = useChat();

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    }
  }, [loadSessions, isAuthenticated]);

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Logo size={40} />
          <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>
            Soul AI
          </Text>
        </View>
        <Text
          style={[styles.userName, { color: theme.colors.onSurfaceVariant }]}
        >
          {isAuthenticated ? user?.displayName || user?.email : "Guest Mode"}
        </Text>
      </View>

      <Button
        mode="contained"
        icon="plus"
        onPress={() => {
          createNewChat();
          props.navigation.closeDrawer();
        }}
        style={styles.newChatButton}
      >
        New Chat
      </Button>

      <Divider style={styles.divider} />

      {isAuthenticated ? (
        <>
          <Text
            style={[
              styles.sectionTitle,
              { color: theme.colors.onSurfaceVariant },
            ]}
          >
            Recent Chats
          </Text>

          <ScrollView style={styles.sessionList}>
            {sessions.map((session) => (
              <SessionItem
                key={session.id}
                session={session}
                isActive={currentSession?.id === session.id}
                onPress={() => {
                  selectSession(session);
                  props.navigation.navigate("Chat");
                  props.navigation.closeDrawer();
                }}
                onDelete={() => deleteSession(session.id)}
              />
            ))}
            {sessions.length === 0 && (
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                No chat history yet
              </Text>
            )}
          </ScrollView>

          <Divider style={styles.divider} />

          <Button
            mode="text"
            icon="chart-bar"
            onPress={() => props.navigation.navigate("Analytics")}
            style={styles.menuButton}
          >
            Analytics
          </Button>
        </>
      ) : (
        <View style={styles.guestInfo}>
          <Text
            style={[styles.guestText, { color: theme.colors.onSurfaceVariant }]}
          >
            Login to save your chats and view analytics
          </Text>
        </View>
      )}

      <View style={styles.themeToggle}>
        <Text style={{ color: theme.colors.onSurface }}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <Divider style={styles.divider} />

      {isAuthenticated ? (
        <Button
          mode="text"
          icon="logout"
          onPress={logout}
          textColor={theme.colors.error}
          style={styles.menuButton}
        >
          Logout
        </Button>
      ) : (
        <Button
          mode="contained"
          icon="login"
          onPress={() => props.navigation.navigate("Login")}
          style={styles.menuButton}
        >
          Login / Sign Up
        </Button>
      )}
    </DrawerContentScrollView>
  );
};

// Main App Drawer - for all users (guests and authenticated)
const MainDrawer = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="Chat" component={ChatScreen} />
      <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
      <Drawer.Screen name="Login" component={LoginScreen} />
      <Drawer.Screen name="Signup" component={SignupScreen} />
      <Drawer.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Drawer.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const { isLoading } = useAuth();
  const { selectSessionById } = useChat();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  // Handle notification tap - extracted for reuse
  const handleNotificationResponse = async (
    response: Notifications.NotificationResponse
  ) => {
    const data = response.notification.request.content.data as any;

    if (data?.type === "chat" && data?.session_id) {
      console.log("Notification tapped - opening session:", data.session_id);

      // Select the session by ID (will load messages)
      await selectSessionById(data.session_id);

      // Delay to allow React state to update before navigation
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Navigate to Chat screen
      if (navigationRef.current) {
        navigationRef.current.navigate("Chat");
      }
    }
  };

  useEffect(() => {
    // Check for notification that launched the app (cold start)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        console.log("App launched from notification:", response);
        handleNotificationResponse(response);
      }
    });

    // Listen for notification responses (when app is already open)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

    return () => {
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [selectSessionById]);

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <MainDrawer />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginLeft: 12,
  },
  userName: {
    fontSize: 14,
    marginTop: 8,
  },
  newChatButton: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  divider: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    marginLeft: 20,
    marginBottom: 8,
  },
  sessionList: {
    maxHeight: 250,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
  },
  menuButton: {
    justifyContent: "flex-start",
    paddingLeft: 8,
  },
  themeToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  guestInfo: {
    padding: 20,
  },
  guestText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
  },
});
