import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import {
  Text,
  TextInput,
  Button,
  useTheme,
  HelperText,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface ForgotPasswordScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { forgotPassword, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    setIsLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (e) {
      // Error handled in context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.background,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          Reset Password
        </Text>

        {sent ? (
          <>
            <Text
              style={[styles.successText, { color: theme.colors.onSurface }]}
            >
              ✅ Password reset email sent!
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Check your inbox and follow the link to reset your password.
            </Text>
            <Button
              mode="contained"
              onPress={() => navigation.navigate("Login")}
              style={styles.button}
            >
              Back to Login
            </Button>
          </>
        ) : (
          <>
            <Text
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Enter your email and we'll send you a link to reset your password.
            </Text>

            <View style={styles.form}>
              <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearError();
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />

              {error && (
                <HelperText type="error" visible={!!error}>
                  {error}
                </HelperText>
              )}

              <Button
                mode="contained"
                onPress={handleReset}
                loading={isLoading}
                disabled={isLoading || !email}
                style={styles.button}
              >
                Send Reset Link
              </Button>

              <Button
                mode="text"
                onPress={() => navigation.goBack()}
                style={styles.linkButton}
              >
                Back to Login
              </Button>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  successText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 8,
  },
  form: {
    width: "100%",
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    paddingVertical: 4,
  },
  linkButton: {
    marginTop: 8,
  },
});
