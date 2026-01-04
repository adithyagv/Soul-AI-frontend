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
        outlineStyle={{ borderRadius: 20 }}
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
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  button: {
    margin: 0,
  },
});
