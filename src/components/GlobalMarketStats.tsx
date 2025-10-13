import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  Coins,
  BarChart3,
} from "lucide-react";
import { api } from "../services/api";
import type { GlobalMarketData, Currency } from "../types/crypto";
import { LoadingSpinner, ErrorState } from "./LoadingState";

interface GlobalMarketStatsProps {
  currency: Currency;
  setGlobalLoading?: Dispatch<SetStateAction<boolean>>; // ✅ now properly used
}

const currencySymbols: Record<Currency, string> = {
  usd: "$",
  eur: "€",
  inr: "₹",
};

export function GlobalMarketStats({ currency, setGlobalLoading }: GlobalMarketStatsProps) {
  const [data, setData] = useState<GlobalMarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
  
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        setGlobalLoading?.(true); // ✅ Show loader globally
  
        const globalData = await api.getGlobalMarketData(controller.signal);
        setData(globalData);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError("Failed to load global market data");
        }
      } finally {
        setLoading(false);
        setGlobalLoading?.(false); // ✅ Hide loader in all cases
      }
    };
  
    loadData();
  
    return () => controller.abort(); // ✅ Prevent race condition / stale update
  }, [currency]); // ✅ Removed setGlobalLoading to prevent useless re-renders
  

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!data) return null;

  // --- Extract data safely ---
  const marketCap = data.total_market_cap[currency];
  const volume = data.total_volume[currency];
  const btcDominance = data.market_cap_percentage.btc;
  const ethDominance = data.market_cap_percentage.eth;
  const change24h = data.market_cap_change_percentage_24h_usd;
  const activeCoins = (data as any).active_cryptocurrencies ?? 0;
  const markets = (data as any).markets ?? 0;
  const isPositive = change24h >= 0;

  // --- Number formatter ---
  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return "N/A";
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toFixed(2);
  };

  const stats = [
    {
      icon: DollarSign,
      label: "Total Market Cap",
      value: `${currencySymbols[currency]}${formatNumber(marketCap)}`,
      change: change24h,
    },
    {
      icon: Activity,
      label: "24h Volume",
      value: `${currencySymbols[currency]}${formatNumber(volume)}`,
    },
    {
      icon: TrendingUp,
      label: "BTC Dominance",
      value: `${btcDominance?.toFixed(1)}%`,
    },
    {
      icon: TrendingUp,
      label: "ETH Dominance",
      value: `${ethDominance?.toFixed(1)}%`,
    },
    {
      icon: Coins,
      label: "Active Cryptocurrencies",
      value: formatNumber(activeCoins),
    },
    {
      icon: BarChart3,
      label: "Active Markets",
      value: formatNumber(markets),
    },
  ];

  return (
    <div className="relative mb-10">
      {/* Dynamic background glow */}
      <div
        className={`absolute inset-0 blur-3xl opacity-40 transition-all duration-700 ${
          isPositive ? "bg-green-400/30" : "bg-red-400/30"
        }`}
      />

      {/* Stats Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{
              scale: 1.04,
              y: -4,
              boxShadow: "0 8px 25px rgba(16,185,129,0.15)",
            }}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 
                       p-6 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 
                       shadow-sm hover:shadow-lg backdrop-blur-xl transition-all"
          >
            {/* Accent bar */}
            <div
              className={`absolute top-0 left-0 w-1 h-full ${
                stat.label.includes("BTC") || stat.label.includes("ETH")
                  ? "bg-amber-500"
                  : isPositive
                  ? "bg-emerald-500"
                  : "bg-rose-500"
              }`}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <stat.icon className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {stat.label}
                </span>
              </div>

              {/* Market Cap change badge */}
              {stat.change !== undefined && (
                <div
                  className={`flex items-center text-sm font-medium ${
                    stat.change >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stat.change >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(stat.change).toFixed(2)}%
                </div>
              )}
            </div>

            {/* Main Value */}
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
              {stat.value}
            </div>

            {/* Label */}
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {stat.label}
            </div>

            {/* Subtle hover gradient */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-tr from-emerald-400 to-cyan-400 rounded-2xl" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
