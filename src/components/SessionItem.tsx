import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, IconButton, useTheme } from "react-native-paper";
import { Session } from "../api/solApi";
import { emotionEmojis } from "../theme/theme";

interface SessionItemProps {
  session: Session;
  isActive: boolean;
  onPress: () => void;
  onDelete: () => void;
}

export const SessionItem: React.FC<SessionItemProps> = ({
  session,
  isActive,
  onPress,
  onDelete,
}) => {
  const theme = useTheme();
  const emoji = session.dominant_emotion
    ? emotionEmojis[session.dominant_emotion] || "💬"
    : "💬";

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "None" || dateStr === "null") {
      return "Now";
    }
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return "Now";
    }
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isActive
            ? theme.colors.primaryContainer
            : theme.colors.surface,
        },
      ]}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <View style={styles.content}>
        <Text
          style={[styles.title, { color: theme.colors.onSurface }]}
          numberOfLines={1}
        >
          {session.title || "Untitled Chat"}
        </Text>
        <Text style={[styles.meta, { color: theme.colors.onSurfaceVariant }]}>
          {formatDate(session.updated_at)} • {session.message_count || 0} msgs
        </Text>
      </View>
      <IconButton
        icon="delete-outline"
        size={20}
        onPress={onDelete}
        iconColor={theme.colors.error}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  meta: {
    fontSize: 12,
    marginTop: 2,
  },
});
