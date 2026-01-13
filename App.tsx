
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
import ProfileEditScreen from './components/ProfileEditScreen';
import HowItWorksScreen from './components/HowItWorksScreen';
import Footer from './components/Footer';
import LegalModals from './components/LegalModals';
import { EquipmentListing, ViewState } from './types';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const [view, setView] = useState<ViewState>('search');
  const [selectedListing, setSelectedListing] = useState<EquipmentListing | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState<'about' | 'faq' | 'privacy' | 'terms' | null>(null);
  const { t } = useTranslation();
  const { currentUser, profile, userRole, logout } = useAuth();

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
    return <div className="page-transition-modal"><LoginScreen onNavigateToSignUp={() => setView('signup')} onLoginSuccess={handleAuthSuccess} /></div>;
  }

  if (view === 'signup') {
    return <div className="page-transition-modal"><SignUpScreen onNavigateToLogin={() => setView('login')} onSignUpSuccess={handleAuthSuccess} /></div>;
  }

  if (view === 'create-listing') {
    return <div className="page-transition"><CreateListingScreen onSuccess={() => setView('my-fleet')} onCancel={() => setView('search')} /></div>;
  }

  if (view === 'my-fleet') {
    return <div className="page-transition"><MyFleetScreen onBack={() => setView('search')} onCreateListing={() => setView('create-listing')} /></div>;
  }

  if (view === 'admin-panel') {
    return <div className="page-transition"><AdminPanelScreen onBack={() => setView('search')} onListingClick={handleListingClick} /></div>;
  }

  if (view === 'profile') {
    return <div className="page-transition"><ProfileEditScreen onBack={() => setView('search')} onSuccess={() => setView('search')} /></div>;
  }

  if (view === 'how-it-works') {
    return (
      <div className="page-transition">
        <HowItWorksScreen
          onBack={() => setView('search')}
          onCreateListing={handleCreateListingClick}
          onBrowseMachinery={() => setView('search')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100">
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onLogoClick={() => setView('search')}
        onLoginClick={handleLoginClick}
        user={currentUser}
        userProfile={profile}
        userRole={userRole}
        onLogout={logout}
        onCreateListing={handleCreateListingClick}
        onMyFleetClick={handleMyFleetClick}
        onAdminPanelClick={handleAdminPanelClick}
        onProfileClick={() => setView('profile')}
      />

      <main className="pt-[65px]">
        {view === 'search' && (
          <div key="search" className="page-transition">
            <SearchScreen
              onListingClick={handleListingClick}
              isAuthenticated={!!currentUser}
              onRestrictedAction={() => setView('login')}
            />
          </div>
        )}

        {view === 'detail' && selectedListing && (
          <div key="detail" className="page-transition-detail">
            <DetailScreen
              listing={selectedListing}
              onBack={handleBack}
              isAuthenticated={!!currentUser}
              onRestrictedAction={() => setView('login')}
            />
          </div>
        )}
      </main>

      <Footer
        userRole={userRole}
        onCreateListing={handleCreateListingClick}
        onHowItWorksClick={() => setView('how-it-works')}
        onAboutClick={() => setActiveModal('about')}
        onFAQClick={() => setActiveModal('faq')}
        onPrivacyClick={() => setActiveModal('privacy')}
        onTermsClick={() => setActiveModal('terms')}
      />

      <LegalModals
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        type={activeModal || 'privacy'}
      />
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
