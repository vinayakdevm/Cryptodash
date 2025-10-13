import { Moon, Sun, TrendingUp, Star, Home } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import type { Currency } from "../types/crypto";


interface NavbarProps {
  currentView: "welcome" | "dashboard" | "favorites";
  onViewChange: (view: "welcome" | "dashboard" | "favorites") => void;
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const currencies: { value: Currency; label: string; symbol: string }[] = [
  { value: "usd", label: "USD", symbol: "$" },
  { value: "eur", label: "EUR", symbol: "€" },
  { value: "inr", label: "INR", symbol: "₹" },
];

export function Navbar({
  currentView,
  onViewChange,
  currency,
  onCurrencyChange,
}: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: "welcome", label: "Home", icon: Home },
    { id: "dashboard", label: "Markets", icon: TrendingUp },
    { id: "favorites", label: "Watchlist", icon: Star },
  ] as const;

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* === Left: Logo === */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => onViewChange("welcome")}
          >
            <div className="relative">
              <TrendingUp className="w-8 h-8 text-emerald-500 drop-shadow-md" />
              <div className="absolute inset-0 blur-md bg-emerald-400/30 rounded-full"></div>
            </div>
            <span className="text-2xl font-extrabold bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              CryptoDash
            </span>
          </motion.div>

          {/* === Center: Navigation === */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => onViewChange(id)}
                whileHover={{ y: -2 }}
                className={`relative px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all
                  ${
                    currentView === id
                      ? "text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-md"
                      : "text-slate-700 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-teal-400"
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}

                {/* Animated underline for active tab */}
                {currentView === id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* === Right: Controls === */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <motion.select
              whileHover={{ scale: 1.03 }}
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as Currency)}
              className="px-3 py-1.5 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm font-medium shadow-sm transition-all"
            >
              {currencies.map((curr) => (
                <option key={curr.value} value={curr.value}>
                  {curr.symbol} {curr.label}
                </option>
              ))}
            </motion.select>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.9, rotate: -10 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-300 transition-all shadow-sm"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon className="w-5 h-5 text-slate-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-80"></div>
    </motion.nav>
  );
}
