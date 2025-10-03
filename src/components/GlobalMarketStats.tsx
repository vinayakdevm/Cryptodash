import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { api } from '../services/api';
import type { GlobalMarketData, Currency } from '../types/crypto';
import { LoadingSpinner, ErrorState } from './LoadingState';

interface GlobalMarketStatsProps {
  currency: Currency;
}

const currencySymbols: Record<Currency, string> = {
  usd: '$',
  eur: '€',
  inr: '₹',
};

export function GlobalMarketStats({ currency }: GlobalMarketStatsProps) {
  const [data, setData] = useState<GlobalMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const globalData = await api.getGlobalMarketData();
      setData(globalData);
    } catch (err) {
      setError('Failed to load global market data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  if (!data) return null;

  const marketCap = data.total_market_cap[currency];
  const volume = data.total_volume[currency];
  const btcDominance = data.market_cap_percentage.btc;
  const ethDominance = data.market_cap_percentage.eth;
  const change24h = data.market_cap_change_percentage_24h_usd;

  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return 'N/A';
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toFixed(2);
  };

  const stats = [
    {
      icon: DollarSign,
      label: 'Total Market Cap',
      value: `${currencySymbols[currency]}${formatNumber(marketCap)}`,
      change: change24h,
    },
    {
      icon: Activity,
      label: '24h Volume',
      value: `${currencySymbols[currency]}${formatNumber(volume)}`,
    },
    {
      icon: TrendingUp,
      label: 'BTC Dominance',
      value: `${btcDominance ? btcDominance.toFixed(1) : '0.0'}%`,
    },
    {
      icon: TrendingUp,
      label: 'ETH Dominance',
      value: `${ethDominance ? ethDominance.toFixed(1) : '0.0'}%`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
          className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <stat.icon className="w-5 h-5 text-emerald-500" />
            {stat.change !== undefined && (
              <div
                className={`flex items-center text-sm font-medium ${
                  stat.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {stat.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {stat.change ? Math.abs(stat.change).toFixed(2) : '0.00'}%
              </div>
            )}
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
