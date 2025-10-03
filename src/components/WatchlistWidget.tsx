import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, TrendingUp, TrendingDown } from 'lucide-react';
import { api } from '../services/api';
import type { Crypto, Currency } from '../types/crypto';

interface WatchlistWidgetProps {
  favorites: Set<string>;
  currency: Currency;
  onCoinClick: (crypto: Crypto) => void;
  onRemoveFavorite: (id: string) => void;
}

const currencySymbols: Record<Currency, string> = {
  usd: '$',
  eur: '€',
  inr: '₹',
};

export function WatchlistWidget({
  favorites,
  currency,
  onCoinClick,
  onRemoveFavorite,
}: WatchlistWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coins, setCoins] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favorites.size > 0) {
      loadFavoriteCoins();
    }
  }, [favorites, currency]);

  const loadFavoriteCoins = async () => {
    try {
      setLoading(true);
      const allCoins = await api.getCoins(currency, 1, 250);
      const favoriteCoins = allCoins.filter((coin) => favorites.has(coin.id));
      setCoins(favoriteCoins);
    } catch (err) {
      console.error('Failed to load favorite coins');
    } finally {
      setLoading(false);
    }
  };

  if (favorites.size === 0) return null;

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-full shadow-2xl flex items-center justify-center"
      >
        <Star className="w-6 h-6 fill-white" />
        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
          {favorites.size}
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Watchlist
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="text-center py-8 text-slate-500">Loading...</div>
                ) : coins.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    No coins in watchlist
                  </div>
                ) : (
                  <div className="space-y-3">
                    {coins.map((coin) => {
                      const isPositive = coin.price_change_percentage_24h >= 0;
                      return (
                        <motion.div
                          key={coin.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            onCoinClick(coin);
                            setIsOpen(false);
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <img src={coin.image} alt={coin.name} className="w-10 h-10" />
                              <div>
                                <div className="font-semibold text-slate-800 dark:text-slate-100">
                                  {coin.name}
                                </div>
                                <div className="text-sm text-slate-500 uppercase">
                                  {coin.symbol}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFavorite(coin.id);
                              }}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
                            >
                              <X className="w-4 h-4 text-slate-400" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                              {currencySymbols[currency]}{coin.current_price.toLocaleString()}
                            </div>
                            <div
                              className={`flex items-center space-x-1 ${
                                isPositive ? 'text-green-500' : 'text-red-500'
                              }`}
                            >
                              {isPositive ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              <span className="font-medium">
                                {coin.price_change_percentage_24h ? Math.abs(coin.price_change_percentage_24h).toFixed(2) : '0.00'}%
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
