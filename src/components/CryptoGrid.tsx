import { useState, useEffect, useMemo, useRef } from "react";
import { Search, ArrowUpDown, TrendingUp, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../services/api";
import { CryptoCard } from "./CryptoCard";
import { GridSkeleton, ErrorState } from "./LoadingState";
import type { Crypto, Currency, SortOption } from "../types/crypto";
import type { Dispatch, SetStateAction } from 'react';

interface CryptoGridProps {
  currency: Currency;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onCoinClick: (crypto: Crypto) => void;
  showOnlyFavorites?: boolean;
  setGlobalLoading?: Dispatch<SetStateAction<boolean>>; // ✅ Add this line
}

const exampleCoins = ["Bitcoin", "Ethereum", "Solana", "Dogecoin", "Tron", "Mantle"];

export function CryptoGrid({
  currency,
  favorites,
  onToggleFavorite,
  onCoinClick,
  setGlobalLoading,
  showOnlyFavorites = false,
}: CryptoGridProps) {
  const [coins, setCoins] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("market_cap");
  const [sortAsc, setSortAsc] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [animatedPlaceholder, setAnimatedPlaceholder] = useState(exampleCoins[0]);


  const inputRef = useRef<HTMLInputElement>(null);

  // 🔤 Fancy typewriter animation for placeholder
useEffect(() => {
  let letterIndex = 0;
  let currentText = "";
  let typingForward = true;

  const interval = setInterval(() => {
    const word = exampleCoins[placeholderIndex];

    if (typingForward) {
      // Typing letters one by one
      currentText = word.slice(0, letterIndex + 1);
      letterIndex++;
      if (letterIndex === word.length) {
        typingForward = false;
        setTimeout(() => {}, 1000); // pause before backspacing
      }
    } else {
      // Backspacing
      currentText = word.slice(0, letterIndex - 1);
      letterIndex--;
      if (letterIndex === 0) {
        typingForward = true;
        setPlaceholderIndex((prev) => (prev + 1) % exampleCoins.length);
      }
    }

    setAnimatedPlaceholder(currentText);
  }, 120); // typing speed

  return () => clearInterval(interval);
}, [placeholderIndex]);


  
  useEffect(() => {
    const controller = new AbortController();
  
    const loadCoins = async () => {
      try {
        setLoading(true);
        setGlobalLoading?.(true); // optional global loader for full-page feedback
  
        // ✅ Pass the AbortSignal to cancel pending fetch if user switches quickly
        const data = await api.getCoins(currency, 1, 100, controller.signal);
        setCoins(data);
      } catch (err) {
        // Type-safe error handling
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Coin fetch error:', err);
          setError('Failed to load cryptocurrency data');
        }
      } finally {
        setLoading(false);
        setGlobalLoading?.(false);
      }
    };
  
    loadCoins();
  
    // ✅ Cleanup when currency changes or component unmounts
    return () => controller.abort();
  }, [currency, setGlobalLoading]);
  
  

  // 🔄 Debounce search query to prevent excessive filtering
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCoins(currency);
      setCoins(data);
    } catch (err) {
      setError("Failed to load cryptocurrency data");
    } finally {
      setLoading(false);
    }
  };

  // Filter + sort logic
  const filteredAndSortedCoins = useMemo(() => {
    let filtered = coins;

    if (showOnlyFavorites) filtered = filtered.filter((coin) => favorites.has(coin.id));

    if (debouncedQuery) {
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      let aValue: number, bValue: number;
      switch (sortBy) {
        case "market_cap":
          aValue = a.market_cap;
          bValue = b.market_cap;
          break;
        case "price":
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case "price_change_24h":
          aValue = a.price_change_percentage_24h;
          bValue = b.price_change_percentage_24h;
          break;
        case "volume":
          aValue = a.total_volume;
          bValue = b.total_volume;
          break;
        default:
          return 0;
      }
      return sortAsc ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [coins, debouncedQuery, sortBy, sortAsc, showOnlyFavorites, favorites]);

  // Suggestion logic
  const suggestions = useMemo(() => {
    if (!coins.length) return [];
    if (!debouncedQuery) {
      return coins.slice(0, 6); // Show top 6 popular coins initially
    }
    return coins
      .filter(
        (coin) =>
          coin.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(debouncedQuery.toLowerCase())
      )
      .slice(0, 8);
  }, [coins, debouncedQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;
    if (e.key === "ArrowDown") {
      setActiveSuggestion((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      setActiveSuggestion((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      const selected = suggestions[activeSuggestion];
      if (selected) {
        setSearchQuery(selected.name);
        setShowSuggestions(false);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  if (loading) return <GridSkeleton />;
  if (error) return <ErrorState message={error} onRetry={loadCoins} />;

  return (
    <div>
      {/* --- Search and Sort --- */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            placeholder={`Search coins... e.g. ${animatedPlaceholder}`}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all"
          />

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-20 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg max-h-64 overflow-y-auto"
              >
                {suggestions.map((coin, index) => (
                  <li
                    key={coin.id}
                    className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition-colors ${
                      index === activeSuggestion
                        ? "bg-emerald-100 dark:bg-emerald-900/30"
                        : "hover:bg-slate-100 dark:hover:bg-slate-700/40"
                    }`}
                    onMouseDown={() => {
                      setSearchQuery(coin.name);
                      setShowSuggestions(false);
                      inputRef.current?.blur();
                    }}
                  >
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="font-medium text-slate-800 dark:text-slate-100">
                      {coin.name}
                    </span>
                    <span className="text-xs text-slate-500 uppercase">
                      {coin.symbol}
                    </span>
                    <span className="ml-auto text-xs text-slate-400">
                      #{coin.market_cap_rank}
                    </span>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Sorting */}
        <div className="flex gap-2 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
          >
            <option value="market_cap">Market Cap</option>
            <option value="price">Price</option>
            <option value="price_change_24h">24h Change</option>
            <option value="volume">Volume</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSortAsc(!sortAsc)}
            className={`px-4 py-3 rounded-xl border transition-colors ${
              sortAsc
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
            }`}
          >
            <ArrowUpDown className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* --- Coins Grid --- */}
      {filteredAndSortedCoins.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            {showOnlyFavorites
              ? "No favorites yet. Star some coins to see them here!"
              : "No coins found matching your search."}
          </p>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredAndSortedCoins.map((coin) => (
            <CryptoCard
              key={coin.id}
              crypto={coin}
              currency={currency}
              isFavorite={favorites.has(coin.id)}
              onToggleFavorite={onToggleFavorite}
              onClick={onCoinClick}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
