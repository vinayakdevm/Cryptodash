import { Moon, Sun, TrendingUp, Star, Home } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import type { Currency } from '../types/crypto';

interface NavbarProps {
  currentView: 'welcome' | 'dashboard' | 'favorites';
  onViewChange: (view: 'welcome' | 'dashboard' | 'favorites') => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const currencies: { value: Currency; label: string; symbol: string }[] = [
  { value: 'usd', label: 'USD', symbol: '$' },
  { value: 'eur', label: 'EUR', symbol: '€' },
  { value: 'inr', label: 'INR', symbol: '₹' },
];

export function Navbar({ currentView, onViewChange, currency, onCurrencyChange }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => onViewChange('welcome')}
            >
              <TrendingUp className="w-8 h-8 text-emerald-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                CryptoDash
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => onViewChange('welcome')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'welcome'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Home className="w-4 h-4 inline mr-2" />
                Home
              </button>
              <button
                onClick={() => onViewChange('dashboard')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'dashboard'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Markets
              </button>
              <button
                onClick={() => onViewChange('favorites')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'favorites'
                    ? 'bg-emerald-500 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Star className="w-4 h-4 inline mr-2" />
                Watchlist
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {currencies.map((curr) => (
                <option key={curr.value} value={curr.value}>
                  {curr.symbol} {curr.label}
                </option>
              ))}
            </select>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
