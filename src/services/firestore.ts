import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  getDoc,
  updateDoc // ADD THIS IMPORT
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { ChatSession, Message } from '../types';

// ... (existing code for saveChatSession, getUserChatSessions, and getAIConfig)

// NEW FUNCTION: Update the AI config document
export const updateAIConfig = async (systemPrompt: string): Promise<void> => {
  try {
    const configDocRef = doc(db, 'aiConfig', 'default');
    await updateDoc(configDocRef, {
      systemPrompt: systemPrompt
    });
    console.log("AI system prompt updated successfully.");
  } catch (error) {
    console.error('Error updating AI config:', error);
    throw new Error('Failed to update AI system prompt.');
  }
};