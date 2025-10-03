import { motion } from 'framer-motion';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import type { Crypto, Currency } from '../types/crypto';

interface CryptoCardProps {
  crypto: Crypto;
  currency: Currency;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (crypto: Crypto) => void;
}

const currencySymbols: Record<Currency, string> = {
  usd: '$',
  eur: '€',
  inr: '₹',
};

export function CryptoCard({ crypto, currency, isFavorite, onToggleFavorite, onClick }: CryptoCardProps) {
  const isPositive = crypto.price_change_percentage_24h >= 0;

  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return 'N/A';
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toFixed(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all cursor-pointer"
      onClick={() => onClick(crypto)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img src={crypto.image} alt={crypto.name} className="w-10 h-10" />
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
              {crypto.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 uppercase">
              {crypto.symbol}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(crypto.id);
          }}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <Star
            className={`w-5 h-5 ${
              isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-slate-400'
            }`}
          />
        </button>
      </div>

      <div className="space-y-2">
        <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {currencySymbols[currency]}{crypto.current_price.toLocaleString()}
        </div>

        <div className="flex items-center justify-between">
          <div
            className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
              isPositive
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {crypto.price_change_percentage_24h ? Math.abs(crypto.price_change_percentage_24h).toFixed(2) : '0.00'}%
            </span>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            #{crypto.market_cap_rank}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="text-xs text-slate-500 dark:text-slate-400">Market Cap</div>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {currencySymbols[currency]}{formatNumber(crypto.market_cap)}
          </div>
        </div>

        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400">24h Volume</div>
          <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {currencySymbols[currency]}{formatNumber(crypto.total_volume)}
          </div>
        </div>

        {crypto.sparkline_in_7d && (
          <div className="pt-2">
            <svg className="w-full h-12" viewBox="0 0 100 30" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke={isPositive ? '#10b981' : '#ef4444'}
                strokeWidth="2"
                points={crypto.sparkline_in_7d.price
                  .map((price, i) => {
                    const x = (i / (crypto.sparkline_in_7d!.price.length - 1)) * 100;
                    const min = Math.min(...crypto.sparkline_in_7d!.price);
                    const max = Math.max(...crypto.sparkline_in_7d!.price);
                    const y = 30 - ((price - min) / (max - min)) * 30;
                    return `${x},${y}`;
                  })
                  .join(' ')}
              />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}
