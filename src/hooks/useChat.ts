import { useState, useEffect } from 'react';
import { ChatSession, Message } from '../types';
import { generateAIResponse } from '../services/openai';
import { saveChatSession, getUserChatSessions } from '../services/firestore';

export const useChat = (userId?: string) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUserSessions();
    } else {
      setSessions([]);
      setCurrentSession(null);
    }
  }, [userId]);

  const loadUserSessions = async () => {
    if (!userId) return;
    
    try {
      const userSessions = await getUserChatSessions(userId);
      setSessions(userSessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setCurrentSession(newSession);
    return newSession;
  };

  const sendMessage = async (content: string) => {
    if (!currentSession || !userId) return;

    const userMessage: Message = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    const updatedSession = {
      ...session,
      messages: [...session.messages, userMessage],
      title: session.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : session.title,
      updatedAt: new Date()
    };

    setCurrentSession(updatedSession);

    try {
      // Generate AI response
      setIsTyping(true);
      
      const conversationHistory = updatedSession.messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      const aiResponse = await generateAIResponse(conversationHistory);

      const aiMessage: Message = {
        id: 'msg-' + Date.now() + '-ai-' + Math.random().toString(36).substr(2, 9),
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      const finalSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, aiMessage],
        updatedAt: new Date()
      };

      setCurrentSession(finalSession);

      // Save to Firestore
      await saveChatSession(userId, finalSession);

      // Update local sessions
      const existingSessionIndex = sessions.findIndex(s => s.id === finalSession.id);
      const updatedSessions = existingSessionIndex >= 0
        ? sessions.map(session => session.id === finalSession.id ? finalSession : session)
        : [finalSession, ...sessions];
      
      setSessions(updatedSessions);

    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: 'msg-' + Date.now() + '-error-' + Math.random().toString(36).substr(2, 9),
        content: 'Sorry, I encountered an error. Please check your API configuration and try again.',
        sender: 'ai',
        timestamp: new Date()
      };

      const errorSession = {
        ...updatedSession,
        messages: [...updatedSession.messages, errorMessage],
        updatedAt: new Date()
      };

      setCurrentSession(errorSession);
    } finally {
      setIsTyping(false);
    }
  };

  const selectSession = (session: ChatSession) => {
    setCurrentSession(session);
  };

  return {
    sessions,
    currentSession,
    isTyping,
    createNewSession,
    sendMessage,
    setCurrentSession: selectSession,
    loadUserSessions
  };
};