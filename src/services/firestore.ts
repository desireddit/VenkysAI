import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { ChatSession, Message } from '../types';

// Save chat session to Firestore
export const saveChatSession = async (userId: string, session: ChatSession): Promise<void> => {
  try {
    const sessionRef = doc(db, 'chatSessions', session.id);
    
    const sessionData = {
      ...session,
      userId,
      createdAt: Timestamp.fromDate(session.createdAt),
      updatedAt: serverTimestamp(),
      messages: session.messages.map(msg => ({
        ...msg,
        timestamp: Timestamp.fromDate(msg.timestamp)
      }))
    };

    await setDoc(sessionRef, sessionData);
  } catch (error) {
    console.error('Error saving chat session:', error);
    throw error;
  }
};

// Get user's chat sessions from Firestore
export const getUserChatSessions = async (userId: string): Promise<ChatSession[]> => {
  try {
    const sessionsQuery = query(
      collection(db, 'chatSessions'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    const querySnapshot = await getDocs(sessionsQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        messages: data.messages.map((msg: any) => ({
          ...msg,
          timestamp: msg.timestamp.toDate()
        }))
      } as ChatSession;
    });
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }
};