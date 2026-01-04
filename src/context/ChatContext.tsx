import React, { createContext, useContext, useState, useCallback } from "react";
import { solApi, Session, Message, ChatResponse } from "../api/solApi";

interface ChatContextType {
  sessions: Session[];
  currentSession: Session | null;
  messages: Message[];
  isLoading: boolean;
  loadSessions: () => Promise<void>;
  selectSession: (session: Session) => Promise<void>;
  createNewChat: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const data = await solApi.getSessions();
      setSessions(data);
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  }, []);

  const selectSession = useCallback(async (session: Session) => {
    setCurrentSession(session);
    try {
      const msgs = await solApi.getSessionMessages(session.id);
      setMessages(msgs);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setMessages([]);
    }
  }, []);

  const createNewChat = useCallback(async () => {
    // Don't create session yet - let the first message create it with proper title
    setCurrentSession(null);
    setMessages([]);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: Message = { role: "user", content };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Create a nice title from the message (truncate at word boundary)
      const createTitle = (text: string): string => {
        const cleaned = text.trim();
        if (cleaned.length <= 40) return cleaned;
        const truncated = cleaned.slice(0, 40);
        const lastSpace = truncated.lastIndexOf(" ");
        return lastSpace > 20
          ? truncated.slice(0, lastSpace) + "..."
          : truncated + "...";
      };

      try {
        // Create a session first if none exists
        let sessionId = currentSession?.id;
        if (!sessionId) {
          try {
            const newSession = await solApi.createSession(createTitle(content));
            setCurrentSession(newSession);
            setSessions((prev) => [newSession, ...prev]);
            sessionId = newSession.id;
          } catch (sessionError) {
            console.error("Failed to create session:", sessionError);
          }
        }

        const response: ChatResponse = await solApi.sendMessage(
          content,
          sessionId
        );

        const assistantMessage: Message = {
          role: "assistant",
          content: response.response,
        };

        // Update user message with emotion (with null checks)
        setMessages((prev) => {
          const updated = [...prev];
          const lastUserIdx = updated.length - 1;
          if (
            updated[lastUserIdx]?.role === "user" &&
            response.emotion_analysis
          ) {
            updated[lastUserIdx] = {
              ...updated[lastUserIdx],
              emotion: response.emotion_analysis.primary_emotion,
              confidence: response.emotion_analysis.confidence,
              valence: response.emotion_analysis.valence,
              arousal: response.emotion_analysis.arousal,
            };
          }
          return [...updated, assistantMessage];
        });

        // Refresh sessions to update message count
        loadSessions();
      } catch (error) {
        console.error("Failed to send message:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, I couldn't connect to the server. Please try again.",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [currentSession, loadSessions]
  );

  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await solApi.deleteSession(sessionId);
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        if (currentSession?.id === sessionId) {
          setCurrentSession(null);
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to delete session:", error);
      }
    },
    [currentSession]
  );

  return (
    <ChatContext.Provider
      value={{
        sessions,
        currentSession,
        messages,
        isLoading,
        loadSessions,
        selectSession,
        createNewChat,
        sendMessage,
        deleteSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
