
import React from 'react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ darkMode, onToggleDarkMode, onLogoClick }) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark px-6 lg:px-10 py-3 shadow-sm transition-colors">
      <div 
        className="flex items-center gap-4 text-slate-900 dark:text-white cursor-pointer group"
        onClick={onLogoClick}
      >
        <div className="size-8 text-primary flex items-center justify-center bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined !text-[28px]">agriculture</span>
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-[-0.015em]">Heavy Hub</h2>
      </div>

      <div className="flex flex-1 justify-end gap-6 items-center">
        <nav className="hidden md:flex items-center gap-8">
          <a className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">My Fleet</a>
          <a className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors text-sm font-medium leading-normal" href="#">Manage Listings</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleDarkMode}
            className="p-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined">{darkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
          
          <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          
          <div 
            className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-slate-100 dark:border-slate-700 cursor-pointer hover:border-primary transition-colors" 
            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDJM3M85NkN2JN7Ol_y8YfASD3qHwUdfi2l4uoEqLwq6VHIXcGwJ4ZwYBc4QSgqFQS92ouqdoWgcNGKRJ7PyGbOFE1vkjtaeknoehYuAxyjSyvvWjfYLYHcioal7UxWNIEq9T0ZY8Wa_QBHRq7agQzLR-xIPW8dcgH7Ni8pqYlLXeM8NjYFBqKOVThH1-vTf6wocCMsRb2BU8wUaSdewbcvQ7XITTh5SbgI9AnXWtGvj7-98YoHMvVLzWpe9xuIRMsUeIMQn8H6ZbtA")' }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
