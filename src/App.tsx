
import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { AppProvider } from '@/contexts/AppContext';
import { AudioProvider } from '@/contexts/AudioContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppLayout from './components/AppLayout';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './components/AdminPanel';
import { Toaster } from './components/ui/toaster';
import './App.css';

const queryClient = new QueryClient();

// Main App Content with Navigation
const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState<'main' | 'dashboard' | 'admin'>('main');

  // Check if user is admin (you can implement proper admin logic)
  const isAdmin = user?.username === 'admin' || user?.email === 'admin@betbingo.com';

  if (currentView === 'admin' && isAdmin) {
    return <AdminPanel />;
  }

  if (currentView === 'dashboard' && isAuthenticated) {
    return <UserDashboard />;
  }

  return (
    <AppLayout>
      {/* Navigation for authenticated users */}
      {isAuthenticated && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setCurrentView('main')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            🏠 Main
          </button>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            👤 Dashboard
          </button>
          {isAdmin && (
            <button
              onClick={() => setCurrentView('admin')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🔧 Admin
            </button>
          )}
        </div>
      )}
      
      {/* Main App Content */}
      <div className="min-h-screen">
        {/* Your existing AppLayout content will render here */}
      </div>
    </AppLayout>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <AudioProvider>
        <AppProvider>
          <BrowserRouter>
            <AppContent />
            <Toaster />
          </BrowserRouter>
        </AppProvider>
      </AudioProvider>
    </AuthProvider>
  );
};

export default App;
