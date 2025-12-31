
import React from 'react';
import { HeaderProps } from '../types';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onLogoClick,
  onLoginClick,
  onLogout,
  onCreateListing,
  onMyFleetClick,
  onManageListingsClick,
  user
}) => {
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 h-[65px] bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 flex items-center px-6 lg:px-10 justify-between transition-colors">
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={onLogoClick}
      >
        <div className="bg-primary p-1.5 rounded-lg group-hover:scale-105 transition-transform">
          <span className="material-symbols-outlined text-white text-xl">construction</span>
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">{t('app_title')}</h2>
      </div>

      <nav className="hidden md:flex items-center gap-8">
        <button onClick={onMyFleetClick} className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal">{t('my_fleet')}</button>
        <button onClick={onManageListingsClick} className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal">{t('manage_listings')}</button>
      </nav>

      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">{darkMode ? 'light_mode' : 'dark_mode'}</span>
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={onCreateListing}
              className="hidden sm:flex bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold transition-all items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              List Item
            </button>
            <div className="relative group">
              <button className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-600 shadow-sm flex items-center justify-center">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-slate-500 dark:text-slate-400">{user.email?.charAt(0).toUpperCase()}</span>
                )}
              </button>
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
                <div className="py-1">
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">Sign out</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <button
              onClick={onLoginClick}
              className="text-slate-600 dark:text-slate-300 font-bold text-sm hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Log In
            </button>
            <button
              onClick={onLoginClick}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-lg text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
