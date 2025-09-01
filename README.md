# Venky's AI Chat Website

A beautiful, modern AI chat application with Google authentication and Firebase integration.

## Features

- 🤖 Real AI responses powered by OpenAI GPT
- 🔐 Google Authentication via Firebase
- 💾 Chat session persistence with Firestore
- 📱 Responsive design for all devices
- ✨ Smooth animations and micro-interactions
- 🎨 Modern glassmorphism UI design

## Setup Instructions

### 1. OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Google sign-in provider
   - Add your domain to authorized domains
4. Enable Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Set up security rules (see below)
5. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll down to "Your apps" section
   - Click on the web app icon or create a new web app
   - Copy the configuration object

### 3. Environment Variables

1. Copy `.env.example` to `.env`
2. Fill in your OpenAI API key and Firebase configuration:

```env
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Security Rules

In your Firebase Console, go to Firestore Database > Rules and set:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chatSessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 5. Run the Application

```bash
npm install
npm run dev
```

## Usage

1. Sign in with your Google account
2. Start a new chat or continue previous conversations
3. Enjoy intelligent responses powered by OpenAI
4. Your chat history is automatically saved to Firebase

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Authentication**: Firebase Auth with Google provider
- **Database**: Firestore for chat session storage
- **AI**: OpenAI GPT-3.5-turbo for intelligent responses
- **Icons**: Lucide React
- **Build Tool**: Vite

## Security Notes

- API keys are handled client-side for demo purposes
- In production, consider using Firebase Functions for OpenAI API calls
- Firestore rules ensure users can only access their own chat sessions
- Environment variables keep sensitive data secure