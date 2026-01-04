import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, IconButton, useTheme } from "react-native-paper";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [text, setText] = useState("");
  const theme = useTheme();

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText("");
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outlineVariant,
        },
      ]}
    >
      <TextInput
        mode="outlined"
        placeholder="Type a message..."
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSend}
        style={styles.input}
        disabled={disabled}
        dense
      />
      <IconButton
        icon="send"
        mode="contained"
        onPress={handleSend}
        disabled={disabled || !text.trim()}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  button: {
    margin: 0,
  },
});
