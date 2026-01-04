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

interface SignupScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { signup, error, clearError, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  const handleSignup = async () => {
    setLocalError("");
    if (password !== confirmPassword) {
      setLocalError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    try {
      await signup(email, password, name);
    } catch (e) {
      // Error handled in context
    }
  };

  const displayError = localError || error;

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
          Create Account
        </Text>
        <Text
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          Start your journey with Soul AI
        </Text>

        <View style={styles.form}>
          <TextInput
            mode="outlined"
            label="Name"
            value={name}
            onChangeText={(text) => {
              setName(text);
              clearError();
            }}
            autoCapitalize="words"
            style={styles.input}
          />

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

          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearError();
              setLocalError("");
            }}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
          />

          <TextInput
            mode="outlined"
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setLocalError("");
            }}
            secureTextEntry={!showPassword}
            style={styles.input}
          />

          {displayError && (
            <HelperText type="error" visible={!!displayError}>
              {displayError}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleSignup}
            loading={isLoading}
            disabled={
              isLoading || !name || !email || !password || !confirmPassword
            }
            style={styles.button}
          >
            Create Account
          </Button>

          <View style={styles.loginContainer}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>
              Already have an account?{" "}
            </Text>
            <Button
              mode="text"
              compact
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Button>
          </View>
        </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
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
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
});
