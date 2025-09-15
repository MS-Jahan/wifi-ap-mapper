
import React from 'react';
import useTheme from '../hooks/useTheme';
import { SunIcon, MoonIcon } from './icons';

const ThemeToggle: React.FC = () => {
  const [theme, toggleTheme] = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-foreground dark:text-dark-foreground bg-secondary dark:bg-dark-secondary hover:bg-accent dark:hover:bg-dark-accent transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeToggle;
