import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { api } from '../services/api';
import type { Crypto, Currency } from '../types/crypto';
import { LoadingSpinner } from './LoadingState';

interface TopMoversProps {
  currency: Currency;
  onCoinClick: (crypto: Crypto) => void;
}

const currencySymbols: Record<Currency, string> = {
  usd: '$',
  eur: '€',
  inr: '₹',
};

export function TopMovers({ currency, onCoinClick }: TopMoversProps) {
  const [coins, setCoins] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoins();
  }, [currency]);

  const loadCoins = async () => {
    try {
      setLoading(true);
      const data = await api.getCoins(currency, 1, 100);
      setCoins(data);
    } catch (err) {
      console.error('Failed to load coins for top movers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const topGainers = [...coins]
    .filter((c) => c.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  const topLosers = [...coins]
    .filter((c) => c.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  const MoverCard = ({ coin, isGainer }: { coin: Crypto; isGainer: boolean }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => onCoinClick(coin)}
      className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-3">
        <img src={coin.image} alt={coin.name} className="w-8 h-8" />
        <div>
          <div className="font-medium text-slate-800 dark:text-slate-100">
            {coin.name}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 uppercase">
            {coin.symbol}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium text-slate-800 dark:text-slate-100">
          {currencySymbols[currency]}{coin.current_price.toLocaleString()}
        </div>
        <div
          className={`flex items-center justify-end space-x-1 text-sm font-medium ${
            isGainer ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isGainer ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{coin.price_change_percentage_24h ? Math.abs(coin.price_change_percentage_24h).toFixed(2) : '0.00'}%</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800"
      >
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-6 h-6 text-green-500" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Top Gainers (24h)
          </h2>
        </div>
        <div className="space-y-2">
          {topGainers.map((coin) => (
            <MoverCard key={coin.id} coin={coin} isGainer={true} />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800"
      >
        <div className="flex items-center space-x-2 mb-4">
          <TrendingDown className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Top Losers (24h)
          </h2>
        </div>
        <div className="space-y-2">
          {topLosers.map((coin) => (
            <MoverCard key={coin.id} coin={coin} isGainer={false} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
