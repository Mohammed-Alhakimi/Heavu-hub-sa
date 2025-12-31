
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchScreen from './components/SearchScreen';
import DetailScreen from './components/DetailScreen';
import { ViewState, EquipmentListing } from './types';
import { MOCK_LISTINGS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('search');
  const [selectedListing, setSelectedListing] = useState<EquipmentListing | null>(null);
  const [darkMode, setDarkMode] = useState(false);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoBack = () => {
    setView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen transition-colors duration-200">
      <Header 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)} 
        onLogoClick={handleGoBack}
      />
      
      <main className="flex-1">
        {view === 'search' && (
          <SearchScreen onListingClick={handleListingClick} />
        )}
        
        {view === 'detail' && selectedListing && (
          <DetailScreen 
            listing={selectedListing} 
            onBack={handleGoBack} 
          />
        )}
      </main>

      <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-[960px] mx-auto px-5 py-10 flex flex-col gap-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[#4e7397]">
            <a className="text-base font-normal leading-normal min-w-[120px] hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="text-base font-normal leading-normal min-w-[120px] hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="text-base font-normal leading-normal min-w-[120px] hover:text-primary transition-colors" href="#">Help Center</a>
          </div>
          <p className="text-[#4e7397] text-base font-normal leading-normal">© 2023 Heavy Hub Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
