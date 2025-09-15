import React from 'react';
import ThemeToggle from './ThemeToggle';
import { WifiIcon, GitHubIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-card dark:bg-dark-card border-b border-border dark:border-dark-border sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <WifiIcon className="h-6 w-6 text-primary dark:text-dark-primary" />
          <h1 className="text-xl font-bold text-foreground dark:text-dark-foreground">
            WiFi AP Mapper
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/MS-Jahan/wifi-ap-mapper"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-foreground dark:text-dark-foreground bg-secondary dark:bg-dark-secondary hover:bg-accent dark:hover:bg-dark-accent transition-colors"
            aria-label="View source code on GitHub"
          >
            <GitHubIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;