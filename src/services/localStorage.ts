import { ChatSession } from '../types';

const CHAT_SESSIONS_KEY = 'venky_ai_chat_sessions';

export const saveChatSession = (userId: string, session: ChatSession): void => {
  try {
    const allSessions = getAllChatSessions();
    const userSessions = allSessions[userId] || [];
    
    const existingIndex = userSessions.findIndex(s => s.id === session.id);
    if (existingIndex >= 0) {
      userSessions[existingIndex] = session;
    } else {
      userSessions.unshift(session);
    }
    
    allSessions[userId] = userSessions;
    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(allSessions));
  } catch (error) {
    console.error('Error saving chat session:', error);
  }
};

export const getUserChatSessions = (userId: string): ChatSession[] => {
  try {
    const allSessions = getAllChatSessions();
    const userSessions = allSessions[userId] || [];
    
    // Convert date strings back to Date objects
    return userSessions.map(session => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }
};

export const deleteChatSession = (userId: string, sessionId: string): void => {
  try {
    const allSessions = getAllChatSessions();
    const userSessions = allSessions[userId] || [];
    
    allSessions[userId] = userSessions.filter(session => session.id !== sessionId);
    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(allSessions));
  } catch (error) {
    console.error('Error deleting chat session:', error);
  }
};

const getAllChatSessions = (): Record<string, ChatSession[]> => {
  try {
    const sessions = localStorage.getItem(CHAT_SESSIONS_KEY);
    return sessions ? JSON.parse(sessions) : {};
  } catch (error) {
    console.error('Error parsing chat sessions:', error);
    return {};
  }
};