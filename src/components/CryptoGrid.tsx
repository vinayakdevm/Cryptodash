import { useState, useEffect, useMemo } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { CryptoCard } from './CryptoCard';
import { GridSkeleton, ErrorState } from './LoadingState';
import type { Crypto, Currency, SortOption } from '../types/crypto';

interface CryptoGridProps {
  currency: Currency;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onCoinClick: (crypto: Crypto) => void;
  showOnlyFavorites?: boolean;
}

export function CryptoGrid({
  currency,
  favorites,
  onToggleFavorite,
  onCoinClick,
  showOnlyFavorites = false,
}: CryptoGridProps) {
  const [coins, setCoins] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('market_cap');
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    loadCoins();
  }, [currency]);

  const loadCoins = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCoins(currency);
      setCoins(data);
    } catch (err) {
      setError('Failed to load cryptocurrency data');
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedCoins = useMemo(() => {
    let filtered = coins;

    if (showOnlyFavorites) {
      filtered = filtered.filter((coin) => favorites.has(coin.id));
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      let aValue: number, bValue: number;

      switch (sortBy) {
        case 'market_cap':
          aValue = a.market_cap;
          bValue = b.market_cap;
          break;
        case 'price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'price_change_24h':
          aValue = a.price_change_percentage_24h;
          bValue = b.price_change_percentage_24h;
          break;
        case 'volume':
          aValue = a.total_volume;
          bValue = b.total_volume;
          break;
        default:
          return 0;
      }

      return sortAsc ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [coins, searchQuery, sortBy, sortAsc, showOnlyFavorites, favorites]);

  if (loading) return <GridSkeleton />;
  if (error) return <ErrorState message={error} onRetry={loadCoins} />;

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or symbol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="market_cap">Market Cap</option>
            <option value="price">Price</option>
            <option value="price_change_24h">24h Change</option>
            <option value="volume">Volume</option>
          </select>

          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowUpDown className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {filteredAndSortedCoins.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            {showOnlyFavorites
              ? 'No favorites yet. Star some coins to see them here!'
              : 'No coins found matching your search.'}
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        </div>
      )}
    </div>
  );
}
