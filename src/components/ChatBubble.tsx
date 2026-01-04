import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Surface, useTheme } from "react-native-paper";
import { Message } from "../api/solApi";

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const theme = useTheme();
  const isUser = message.role === "user";

  return (
    <View
      style={[
        styles.container,
        isUser ? styles.userContainer : styles.aiContainer,
      ]}
    >
      <Surface
        style={[
          styles.bubble,
          {
            backgroundColor: isUser
              ? theme.colors.primaryContainer
              : theme.colors.surfaceVariant,
          },
        ]}
        elevation={1}
      >
        <Text
          style={[
            styles.text,
            {
              color: isUser
                ? theme.colors.onPrimaryContainer
                : theme.colors.onSurfaceVariant,
            },
          ]}
        >
          {message.content}
        </Text>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 12,
    maxWidth: "80%",
  },
  userContainer: {
    alignSelf: "flex-end",
  },
  aiContainer: {
    alignSelf: "flex-start",
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  emotionContainer: {
    marginTop: 8,
    alignSelf: "flex-end",
  },
});
