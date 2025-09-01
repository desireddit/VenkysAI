import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

// Check if username is already taken
export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
  try {
    const usernameDoc = await getDoc(doc(db, 'usernames', username.toLowerCase()));
    return !usernameDoc.exists();
  } catch (error) {
    console.error('Error checking username:', error);
    return false;
  }
};

// Register new user
export const registerUser = async (credentials: RegisterCredentials): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
  try {
    const { username, email, password } = credentials;

    // Validation
    if (username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }

    // Check username availability
    const isUsernameAvailable = await checkUsernameAvailability(username);
    if (!isUsernameAvailable) {
      return { success: false, error: 'Username already exists. Please choose a different one.' };
    }

    // Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      id: firebaseUser.uid,
      username,
      email,
      createdAt: new Date()
    };

    // Save user profile
    await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
    
    // Reserve username
    await setDoc(doc(db, 'usernames', username.toLowerCase()), {
      userId: firebaseUser.uid,
      createdAt: new Date()
    });

    return { success: true, user: userProfile };
  } catch (error: any) {
    console.error('Registration error:', error);
    
    let errorMessage = 'Registration failed';
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'Email already in use. Please use a different email.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password is too weak. Please use a stronger password.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    }
    
    return { success: false, error: errorMessage };
  }
};

// Login user
export const loginUser = async (credentials: LoginCredentials): Promise<{ success: boolean; error?: string; user?: UserProfile }> => {
  try {
    const { email, password } = credentials;

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      return { success: false, error: 'User profile not found' };
    }

    const userData = userDoc.data();
    const userProfile: UserProfile = {
      id: firebaseUser.uid,
      username: userData.username,
      email: userData.email,
      createdAt: userData.createdAt.toDate()
    };

    return { success: true, user: userProfile };
  } catch (error: any) {
    console.error('Login error:', error);
    
    let errorMessage = 'Login failed';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email address.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    }
    
    return { success: false, error: errorMessage };
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: UserProfile | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userProfile: UserProfile = {
            id: firebaseUser.uid,
            username: userData.username,
            email: userData.email,
            createdAt: userData.createdAt.toDate()
          };
          callback(userProfile);
        } else {
          callback(null);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};