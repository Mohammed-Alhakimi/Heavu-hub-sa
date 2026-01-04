
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
  onAdminPanelClick,
  onProfileClick,
  user,
  userProfile,
  userRole
}) => {
  const { t } = useTranslation();

  // Check if user can create listings (dealer or admin)
  const canCreateListing = userRole === 'dealer' || userRole === 'admin';

  return (
    <header className="fixed top-0 left-0 right-0 h-[65px] bg-white/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 flex items-center px-6 lg:px-10 justify-between transition-colors">
      <div
        className="flex items-center gap-2 cursor-pointer group"
        onClick={onLogoClick}
      >
        <img
          src="/logo.png"
          alt="Heavy Hub"
          className="h-10 w-auto group-hover:scale-105 transition-transform"
        />
      </div>

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
            {/* List Item button - only for dealers/admins */}
            {canCreateListing && (
              <button
                onClick={onCreateListing}
                className="hidden sm:flex bg-primary hover:bg-primary-dark text-slate-900 px-4 py-2 rounded-lg text-sm font-bold transition-all items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                List Item
              </button>
            )}
            <div className="relative group">
              <button className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-600 shadow-sm flex items-center justify-center">
                {userProfile?.photoURL || user.photoURL ? (
                  <img src={userProfile?.photoURL || user.photoURL} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-slate-500 dark:text-slate-400">{userProfile?.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}</span>
                )}
              </button>
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-black text-slate-900 dark:text-white truncate">{userProfile?.displayName || 'User'}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                  <p className="text-xs text-primary font-medium capitalize mt-1 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
                    {userRole || 'User'}
                  </p>
                </div>
                <div className="py-1">
                  <button
                    onClick={onProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">person_edit</span>
                    Edit Profile
                  </button>
                  {/* My Fleet - only for dealers and admins */}
                  {(userRole === 'dealer' || userRole === 'admin') && (
                    <button
                      onClick={onMyFleetClick}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                      My Fleet
                    </button>
                  )}
                  {/* Admin Panel - only for admins */}
                  {userRole === 'admin' && (
                    <button
                      onClick={onAdminPanelClick}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                      Admin Panel
                    </button>
                  )}
                  {/* Divider if there are menu items above */}
                  {(userRole === 'dealer' || userRole === 'admin') && (
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                  )}
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign out
                  </button>
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
