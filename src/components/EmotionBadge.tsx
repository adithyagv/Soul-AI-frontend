import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { emotionColors, emotionEmojis } from "../theme/theme";

interface EmotionBadgeProps {
  emotion: string;
  confidence?: number;
  size?: "small" | "medium" | "large";
}

export const EmotionBadge: React.FC<EmotionBadgeProps> = ({
  emotion,
  confidence,
  size = "medium",
}) => {
  const theme = useTheme();
  const color = emotionColors[emotion] || emotionColors.neutral;
  const emoji = emotionEmojis[emotion] || emotionEmojis.neutral;

  const fontSize = size === "small" ? 14 : size === "large" ? 24 : 18;
  const badgeSize = size === "small" ? 28 : size === "large" ? 48 : 36;

  return (
    <View style={[styles.container, { backgroundColor: color + "30" }]}>
      <Text style={{ fontSize }}>{emoji}</Text>
      {confidence !== undefined && (
        <Text
          style={[
            styles.confidence,
            { color: theme.colors.onSurfaceVariant, fontSize: fontSize * 0.6 },
          ]}
        >
          {Math.round(confidence * 100)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  confidence: {
    fontWeight: "600",
  },
});
