const API_BASE_URL = "http://192.168.0.171:8000";

export interface Session {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  dominant_emotion: string | null;
}

export interface Message {
  id?: number;
  session_id?: string;
  role: "user" | "assistant";
  content: string;
  emotion?: string;
  confidence?: number;
  valence?: number;
  arousal?: number;
  timestamp?: string;
}

export interface ChatResponse {
  response: string;
  emotion_analysis: {
    primary_emotion: string;
    confidence: number;
    valence: number;
    arousal: number;
    all_emotions: Record<string, number>;
  };
  session_id: string;
}

export interface AnalyticsData {
  total_messages: number;
  emotion_counts: Record<string, number>;
  average_valence: number;
  average_arousal: number;
  daily_trends: Array<{
    date: string;
    avg_valence: number;
    message_count: number;
  }>;
  active_concerns: Array<{
    concern: string;
    first_mentioned: string;
    times_mentioned: number;
  }>;
}

class SolApi {
  private baseUrl: string;
  private userId: string = "default_user";

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  async healthCheck(): Promise<{ status: string; model_loaded: boolean }> {
    const response = await fetch(`${this.baseUrl}/health`);
    return response.json();
  }

  async sendMessage(
    message: string,
    sessionId?: string
  ): Promise<ChatResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        session_id: sessionId,
        user_id: this.userId,
      }),
    });
    if (!response.ok) throw new Error("Failed to send message");
    return response.json();
  }

  async getSessions(): Promise<Session[]> {
    const response = await fetch(
      `${this.baseUrl}/api/sessions?user_id=${this.userId}`
    );
    if (!response.ok) return [];
    return response.json();
  }

  async createSession(title?: string): Promise<Session> {
    const response = await fetch(`${this.baseUrl}/api/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: this.userId,
        title: title || "New Chat",
      }),
    });
    return response.json();
  }

  async getSessionMessages(sessionId: string): Promise<Message[]> {
    const response = await fetch(
      `${this.baseUrl}/api/sessions/${sessionId}/messages`
    );
    if (!response.ok) return [];
    return response.json();
  }

  async deleteSession(sessionId: string): Promise<void> {
    await fetch(`${this.baseUrl}/api/sessions/${sessionId}`, {
      method: "DELETE",
    });
  }

  async getAnalytics(): Promise<AnalyticsData> {
    const response = await fetch(
      `${this.baseUrl}/api/analytics/${this.userId}`
    );
    if (!response.ok) {
      return {
        total_messages: 0,
        emotion_counts: {},
        average_valence: 0.5,
        average_arousal: 0.5,
        daily_trends: [],
        active_concerns: [],
      };
    }
    return response.json();
  }
}

export const solApi = new SolApi();
