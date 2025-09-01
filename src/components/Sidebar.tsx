import React from 'react';
import { Plus, MessageSquare, LogOut, Trash2 } from 'lucide-react';
import { ChatSession, User } from '../types';

interface SidebarProps {
  user: User;
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  onNewChat: () => void;
  onSelectSession: (session: ChatSession) => void;
  onSignOut: () => void;
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  sessions,
  currentSession,
  onNewChat,
  onSelectSession,
  onSignOut,
  isOpen
}) => {
  return (
    <div className={`fixed left-0 top-0 h-full bg-white/5 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 z-40 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    } w-80 lg:translate-x-0 lg:relative lg:w-80`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center ring-2 ring-white/20">
              <span className="text-white font-bold text-sm">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{user.username}</p>
              <p className="text-gray-400 text-sm truncate">{user.email}</p>
            </div>
          </div>
          
          <button
            onClick={onNewChat}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:from-purple-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat sessions */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-gray-400 text-sm font-medium mb-3 uppercase tracking-wider">Recent Chats</h3>
          <div className="space-y-2">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session)}
                className={`w-full text-left p-3 rounded-xl transition-all duration-200 group hover:bg-white/10 ${
                  currentSession?.id === session.id 
                    ? 'bg-white/10 border border-white/20' 
                    : 'border border-transparent'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{session.title}</p>
                    <p className="text-gray-400 text-sm">
                      {session.messages.length} messages
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onSignOut}
            className="w-full text-red-400 hover:text-red-300 py-2 px-3 rounded-lg hover:bg-red-500/10 transition-all duration-200 flex items-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};