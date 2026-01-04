import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Card,
  useTheme,
  Appbar,
  Chip,
  ProgressBar,
} from "react-native-paper";
import { solApi, AnalyticsData } from "../api/solApi";
import { emotionEmojis, emotionColors } from "../theme/theme";
import { DrawerNavigationProp } from "@react-navigation/drawer";

interface AnalyticsScreenProps {
  navigation: DrawerNavigationProp<any>;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await solApi.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getValenceLabel = (valence: number) => {
    if (valence > 0.6) return "Positive";
    if (valence < 0.4) return "Negative";
    return "Neutral";
  };

  if (loading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
          <Appbar.Content title="Analytics" />
        </Appbar.Header>
        <View style={styles.centerContent}>
          <Text>Loading analytics...</Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => navigation.openDrawer()} />
        <Appbar.Content title="Your Analytics" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Overall Stats */}
        <Card style={styles.card}>
          <Card.Title title="Overview" />
          <Card.Content>
            <View style={styles.statRow}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {analytics?.total_messages || 0}
                </Text>
                <Text style={styles.statLabel}>Messages</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>
                  {getValenceLabel(analytics?.average_valence || 0.5)}
                </Text>
                <Text style={styles.statLabel}>Mood Trend</Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Emotion Breakdown */}
        <Card style={styles.card}>
          <Card.Title title="Emotion Breakdown" />
          <Card.Content>
            {analytics?.emotion_counts &&
              Object.entries(analytics.emotion_counts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([emotion, count]) => (
                  <View key={emotion} style={styles.emotionRow}>
                    <Text style={styles.emotionLabel}>
                      {emotionEmojis[emotion] || "❓"} {emotion}
                    </Text>
                    <ProgressBar
                      progress={count / (analytics.total_messages || 1)}
                      color={emotionColors[emotion] || theme.colors.primary}
                      style={styles.progressBar}
                    />
                    <Text style={styles.emotionCount}>{count}</Text>
                  </View>
                ))}
            {(!analytics?.emotion_counts ||
              Object.keys(analytics.emotion_counts).length === 0) && (
              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                No emotion data yet. Start chatting!
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Active Concerns */}
        <Card style={styles.card}>
          <Card.Title title="Topics You've Mentioned" />
          <Card.Content>
            <View style={styles.chipContainer}>
              {analytics?.active_concerns?.slice(0, 6).map((concern, index) => (
                <Chip key={index} style={styles.chip} compact>
                  {concern.concern}
                </Chip>
              ))}
              {(!analytics?.active_concerns ||
                analytics.active_concerns.length === 0) && (
                <Text style={{ color: theme.colors.onSurfaceVariant }}>
                  No tracked concerns yet.
                </Text>
              )}
            </View>
          </Card.Content>
        </Card>

        {/* Emotion Guide */}
        <Card style={styles.card}>
          <Card.Title title="Emotion Guide" />
          <Card.Content>
            <View style={styles.guideGrid}>
              {Object.entries(emotionEmojis).map(([emotion, emoji]) => (
                <View
                  key={emotion}
                  style={[
                    styles.guideItem,
                    { backgroundColor: emotionColors[emotion] + "20" },
                  ]}
                >
                  <Text style={styles.guideEmoji}>{emoji}</Text>
                  <Text style={styles.guideLabel}>{emotion}</Text>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginBottom: 16,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  emotionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  emotionLabel: {
    width: 100,
    fontSize: 14,
    textTransform: "capitalize",
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  emotionCount: {
    width: 30,
    textAlign: "right",
    fontSize: 14,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginBottom: 4,
  },
  guideGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  guideItem: {
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    width: "30%",
  },
  guideEmoji: {
    fontSize: 24,
  },
  guideLabel: {
    fontSize: 12,
    marginTop: 4,
    textTransform: "capitalize",
  },
});
