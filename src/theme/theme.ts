import { MD3LightTheme, MD3DarkTheme } from "react-native-paper";

export const emotionColors: Record<string, string> = {
  joy: "#FFD700",
  sadness: "#4169E1",
  anger: "#DC143C",
  fear: "#8B008B",
  disgust: "#228B22",
  surprise: "#FF8C00",
  neutral: "#808080",
};

export const emotionEmojis: Record<string, string> = {
  joy: "😊",
  sadness: "😢",
  anger: "😠",
  fear: "😨",
  disgust: "🤢",
  surprise: "😲",
  neutral: "😐",
};

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#6200EE",
    secondary: "#03DAC6",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    surfaceVariant: "#E8E8E8",
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#BB86FC",
    secondary: "#03DAC6",
    background: "#121212",
    surface: "#1E1E1E",
    surfaceVariant: "#2D2D2D",
  },
};
