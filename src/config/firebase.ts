// Firebase configuration for Soul AI
// IMPORTANT: Replace these with your Firebase project credentials
import { initializeApp } from "firebase/app";
// @ts-expect-error - getReactNativePersistence is available at runtime in React Native
import { initializeAuth, getReactNativePersistence, Auth } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDscU78TjvBGLmC8rLVIXSTeQh51M5q1Dc",
  authDomain: "soul-ai-60893.firebaseapp.com",
  projectId: "soul-ai-60893",
  storageBucket: "soul-ai-60893.firebasestorage.app",
  messagingSenderId: "342596422288",
  appId: "1:342596422288:web:cf3bb79f06cd35f9e7e615",
  measurementId: "G-BNLP68V3VH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth: Auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export { app, auth };
