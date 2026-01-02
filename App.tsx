
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import SearchScreen from './components/SearchScreen';
import DetailScreen from './components/DetailScreen';
import LoginScreen from './components/Auth/LoginScreen';
import SignUpScreen from './components/Auth/SignUpScreen';
import CreateListingScreen from './components/Listings/CreateListingScreen';
import MyFleetScreen from './components/Listings/MyFleetScreen';
import AdminPanelScreen from './components/Admin/AdminPanelScreen';
import { EquipmentListing, ViewState } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const [view, setView] = useState<ViewState>('search');
  const [selectedListing, setSelectedListing] = useState<EquipmentListing | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const { t } = useTranslation();
  const { currentUser, userRole, logout } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleListingClick = (listing: EquipmentListing) => {
    setSelectedListing(listing);
    setView('detail');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setSelectedListing(null);
    setView('search');
  };

  const handleLoginClick = () => {
    setView('login');
  };

  const handleAuthSuccess = () => {
    setView('search');
  };

  const handleCreateListingClick = () => {
    if (!currentUser) {
      setView('login');
    } else if (userRole === 'dealer' || userRole === 'admin') {
      setView('create-listing');
    }
  };

  const handleMyFleetClick = () => {
    if (!currentUser) {
      setView('login');
    } else if (userRole === 'dealer' || userRole === 'admin') {
      setView('my-fleet');
    }
  };

  const handleAdminPanelClick = () => {
    if (!currentUser) {
      setView('login');
    } else if (userRole === 'admin') {
      setView('admin-panel');
    }
  };

  // Render Auth Screens
  if (view === 'login') {
    return <LoginScreen onNavigateToSignUp={() => setView('signup')} onLoginSuccess={handleAuthSuccess} />;
  }

  if (view === 'signup') {
    return <SignUpScreen onNavigateToLogin={() => setView('login')} onSignUpSuccess={handleAuthSuccess} />;
  }

  if (view === 'create-listing') {
    return <CreateListingScreen onSuccess={() => setView('my-fleet')} onCancel={() => setView('search')} />;
  }

  if (view === 'my-fleet') {
    return <MyFleetScreen onBack={() => setView('search')} onCreateListing={() => setView('create-listing')} />;
  }

  if (view === 'admin-panel') {
    return <AdminPanelScreen onBack={() => setView('search')} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onLogoClick={() => setView('search')}
        onLoginClick={handleLoginClick}
        user={currentUser}
        userRole={userRole}
        onLogout={logout}
        onCreateListing={handleCreateListingClick}
        onMyFleetClick={handleMyFleetClick}
        onAdminPanelClick={handleAdminPanelClick}
      />

      <main className="pt-[65px]">
        {view === 'search' && (
          <SearchScreen
            onListingClick={handleListingClick}
            isAuthenticated={!!currentUser}
            onRestrictedAction={() => setView('login')}
          />
        )}

        {view === 'detail' && selectedListing && (
          <DetailScreen
            listing={selectedListing}
            onBack={handleBack}
            isAuthenticated={!!currentUser}
            onRestrictedAction={() => setView('login')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-surface-dark border-t border-slate-200 dark:border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl">
              <span className="material-symbols-outlined text-primary">construction</span>
            </div>
            <span className="font-black text-lg tracking-tight">Heavy Hub</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-sm text-slate-500">
            <span>Copyright © HeavyHub. All rights reserved.</span>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};



const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
