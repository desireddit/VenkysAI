import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Sidebar } from './components/Sidebar';
import { ChatInterface } from './components/ChatInterface';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';

function App() {
  const { user, loading, signIn, signUp, signOut, error } = useAuth();
  const { sessions, currentSession, isTyping, createNewSession, sendMessage, setCurrentSession } = useChat(user?.id);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onSignIn={signIn} onSignUp={signUp} loading={loading} error={error} />;
  }

  const handleNewChat = () => {
    createNewSession();
    setSidebarOpen(false);
  };

  const handleSelectSession = (session: any) => {
    setCurrentSession(session);
    setSidebarOpen(false);
  };

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        user={user}
        sessions={sessions}
        currentSession={currentSession}
        onNewChat={handleNewChat}
        onSelectSession={handleSelectSession}
        onSignOut={signOut}
        isOpen={sidebarOpen}
      />

      <ChatInterface
        user={user}
        currentSession={currentSession}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  );
}

export default App;