import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { Text, ActivityIndicator, useTheme, Appbar } from "react-native-paper";
import { useChat } from "../context/ChatContext";
import { ChatBubble } from "../components/ChatBubble";
import { ChatInput } from "../components/ChatInput";
import { Message } from "../api/solApi";
import { DrawerNavigationProp } from "@react-navigation/drawer";

interface ChatScreenProps {
  navigation: DrawerNavigationProp<any>;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { messages, isLoading, sendMessage, currentSession } = useChat();
  const flatListRef = useRef<FlatList>(null);

  // Scroll to end when messages change or keyboard opens
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100
      );
    }
  }, [messages]);

  // Listen for keyboard show event to scroll list
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        setTimeout(
          () => flatListRef.current?.scrollToEnd({ animated: true }),
          100
        );
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const renderMessage = ({ item }: { item: Message }) => (
    <ChatBubble message={item} />
  );

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyEmoji]}>🧠</Text>
      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
        Welcome to Soul AI
      </Text>
      <Text
        style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}
      >
        I'm here to listen and help. Share what's on your mind.
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior="padding"
    >
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title={currentSession?.title || "Soul AI"} />
      </Appbar.Header>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.messageList}
        ListEmptyComponent={EmptyState}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" />
          <Text style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8 }}>
            Soul is thinking...
          </Text>
        </View>
      )}

      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
  },
});
