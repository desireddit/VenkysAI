import { useState, useEffect } from 'react';
import { ChatSession, Message } from '../types';
import { generateAIResponse } from '../services/openai';
import { saveChatSession, getUserChatSessions, getAIConfig, updateAIConfig } from '../services/firestore'; // ADD 'updateAIConfig'
import { auth } from '../config/firebase'; // ADD THIS IMPORT

// This is the special prefix for admin messages
const ADMIN_TAG = "VenkyBushra1322:";

// IMPORTANT: REPLACE THIS WITH YOUR REAL FIREBASE USER ID
const ADMIN_UID = "eW6TFpNW8aS2Oa94jN445jrIkVp1"; 

export const useChat = (userId?: string) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  
  // ... (existing useEffect and other functions)

  const sendMessage = async (content: string) => {
    if (!currentSession || !userId || !systemPrompt) return;

    // Check for admin override first
    if (content.startsWith(ADMIN_TAG) && userId === ADMIN_UID) {
      console.log("Admin override detected. Updating AI config.");
      const newPrompt = content.substring(ADMIN_TAG.length).trim();
      if (newPrompt) {
        try {
          // Update the system prompt in Firestore
          await updateAIConfig(newPrompt);
          // Update the local state to see the change immediately
          setSystemPrompt(newPrompt);
        } catch (error) {
          console.error("Failed to update system prompt:", error);
          alert("Failed to update AI personality. Check your console for details.");
        }
      }
      return; // Stop here, don't generate an AI response
    }

    // ... (rest of the existing sendMessage function)
    const userMessage: Message = {
      id: 'msg-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
      content,
      sender: 'user',
      timestamp: new Date()
    };

    const updatedSession = {
      ...currentSession, // Renamed 'session' to 'currentSession' for clarity
      messages: [...currentSession.messages, userMessage],
      title: currentSession.messages.length === 0 ? content.slice(0, 30) + (content.length > 30 ? '...' : '') : currentSession.title,
      updatedAt: new Date()
    };
    // ... (rest of the code is the same)
  };
    // ... (rest of the existing useChat hook)
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