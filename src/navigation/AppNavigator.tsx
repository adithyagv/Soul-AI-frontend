import React, { useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Text, Button, Switch, Divider, useTheme } from "react-native-paper";
import { ChatScreen } from "../screens/ChatScreen";
import { AnalyticsScreen } from "../screens/AnalyticsScreen";
import { useChat } from "../context/ChatContext";
import { useTheme as useAppTheme } from "../context/ThemeContext";
import { SessionItem } from "../components/SessionItem";

const Drawer = createDrawerNavigator();

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useAppTheme();
  const {
    sessions,
    currentSession,
    loadSessions,
    selectSession,
    createNewChat,
    deleteSession,
  } = useChat();

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return (
    <DrawerContentScrollView
      {...props}
      style={{ backgroundColor: theme.colors.background }}
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>
          🧠 Soul AI
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { color: theme.colors.onSurfaceVariant },
          ]}
        >
          Your emotional companion
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

      <Text
        style={[styles.sectionTitle, { color: theme.colors.onSurfaceVariant }]}
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
            style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
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

      <View style={styles.themeToggle}>
        <Text style={{ color: theme.colors.onSurface }}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </DrawerContentScrollView>
  );
};

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="Chat" component={ChatScreen} />
        <Drawer.Screen name="Analytics" component={AnalyticsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
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
    maxHeight: 300,
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
});
