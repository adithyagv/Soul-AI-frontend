// NotificationService.ts - Expo Push Notification handling

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

const API_BASE_URL = "http://192.168.0.171:8000";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationPreferences {
  enabled: boolean;
  checkin_frequency_hours: number;
  quiet_hours_start: number | null;
  quiet_hours_end: number | null;
}

class NotificationService {
  private expoPushToken: string | null = null;

  /**
   * Request notification permissions and get push token
   */
  async registerForPushNotifications(): Promise<string | null> {
    if (!Device.isDevice) {
      console.log("Push notifications only work on physical devices");
      return null;
    }

    // Check existing permissions
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permissions if not granted
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notification permission not granted");
      return null;
    }

    // Get Expo push token
    try {
      const tokenData = await Notifications.getExpoPushTokenAsync();
      this.expoPushToken = tokenData.data;
      console.log("Expo Push Token:", this.expoPushToken);
      return this.expoPushToken;
    } catch (error) {
      console.error("Failed to get push token:", error);
      return null;
    }
  }

  /**
   * Register push token with backend
   */
  async registerTokenWithBackend(userId: string): Promise<boolean> {
    if (!this.expoPushToken) {
      const token = await this.registerForPushNotifications();
      if (!token) return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/push-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          token: this.expoPushToken,
          platform: Platform.OS,
        }),
      });

      if (response.ok) {
        console.log("Push token registered with backend");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to register push token:", error);
      return false;
    }
  }

  /**
   * Unregister push token on logout
   */
  async unregisterToken(userId: string): Promise<void> {
    if (!this.expoPushToken) return;

    try {
      await fetch(
        `${API_BASE_URL}/api/push-token?user_id=${userId}&token=${this.expoPushToken}`,
        { method: "DELETE" }
      );
      this.expoPushToken = null;
      console.log("Push token unregistered");
    } catch (error) {
      console.error("Failed to unregister push token:", error);
    }
  }

  /**
   * Get notification preferences
   */
  async getPreferences(
    userId: string
  ): Promise<NotificationPreferences | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notification-preferences/${userId}`
      );
      if (response.ok) {
        return response.json();
      }
      return null;
    } catch (error) {
      console.error("Failed to get notification preferences:", error);
      return null;
    }
  }

  /**
   * Update notification preferences
   */
  async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/notification-preferences/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preferences),
        }
      );
      return response.ok;
    } catch (error) {
      console.error("Failed to update preferences:", error);
      return false;
    }
  }

  /**
   * Add listener for notification received while app is foregrounded
   */
  addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  /**
   * Add listener for notification interactions (when user taps notification)
   */
  addNotificationResponseListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }

  /**
   * Get the current push token
   */
  getToken(): string | null {
    return this.expoPushToken;
  }
}

export const notificationService = new NotificationService();
