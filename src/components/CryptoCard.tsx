import { motion } from "framer-motion";
import { Star, TrendingUp, TrendingDown } from "lucide-react";
import type { Crypto, Currency } from "../types/crypto";
import { useMemo } from "react";

interface CryptoCardProps {
  crypto: Crypto;
  currency: Currency;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClick: (crypto: Crypto) => void;
}

const currencySymbols: Record<Currency, string> = {
  usd: "$",
  eur: "€",
  inr: "₹",
};

export function CryptoCard({
  crypto,
  currency,
  isFavorite,
  onToggleFavorite,
  onClick,
}: CryptoCardProps) {
  const isPositive = crypto.price_change_percentage_24h >= 0;

  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return "N/A";
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toFixed(2);
  };

  const sparklinePoints = useMemo(() => {
    if (!crypto.sparkline_in_7d) return "";
    const prices = crypto.sparkline_in_7d.price;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return prices
      .map((price, i) => {
        const x = (i / (prices.length - 1)) * 100;
        const y = 30 - ((price - min) / (max - min)) * 30;
        return `${x},${y}`;
      })
      .join(" ");
  }, [crypto.sparkline_in_7d]);

  return (
    <motion.div
      onClick={() => onClick(crypto)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{
        y: -6,
        scale: 1.03,
        boxShadow: "0 0 25px rgba(6,182,212,0.25)",
      }}
      transition={{ type: "spring", stiffness: 250 }}
      className="
        relative rounded-2xl p-6 border cursor-pointer overflow-hidden shadow-xl transition-all
        bg-gradient-to-br from-slate-100 to-white dark:from-slate-800/70 dark:to-slate-900/70
        border-slate-300 dark:border-slate-700/60
        hover:border-cyan-400 backdrop-blur-xl
      "
    >
      {/* --- Glow Layer --- */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{
          background: isPositive
            ? "radial-gradient(circle at 50% 35%, rgba(34,197,94,0.25), transparent 70%)"
            : "radial-gradient(circle at 50% 35%, rgba(239,68,68,0.25), transparent 70%)",
        }}
      />

      {/* --- Card Content --- */}
      <div className="relative z-10 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-10 h-10 rounded-full border border-slate-400 dark:border-slate-600 shadow-md"
            />
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white tracking-wide">
                {crypto.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">
                {crypto.symbol}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(crypto.id);
            }}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700/60 rounded-lg transition-colors"
          >
            <Star
              className={`w-5 h-5 transition-all duration-200 ${
                isFavorite
                  ? "fill-yellow-400 text-yellow-400 scale-110"
                  : "text-slate-400"
              }`}
            />
          </button>
        </div>

        {/* Price + Rank */}
        <div>
          <motion.div
            key={crypto.current_price}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-slate-900 dark:text-white"
          >
            {currencySymbols[currency]}
            {crypto.current_price.toLocaleString()}
          </motion.div>

          <div className="flex items-center justify-between mt-2">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium ${
                isPositive
                  ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {crypto.price_change_percentage_24h?.toFixed(2)}%
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-400">
              #{crypto.market_cap_rank}
            </div>
          </div>
        </div>

        {/* Market Cap + Volume */}
        <div className="mt-3 border-t border-slate-200 dark:border-slate-700 pt-2">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>Market Cap</span>
            <span>24h Volume</span>
          </div>
          <div className="flex justify-between text-sm font-medium text-slate-700 dark:text-slate-200">
            <span>
              {currencySymbols[currency]}
              {formatNumber(crypto.market_cap)}
            </span>
            <span>
              {currencySymbols[currency]}
              {formatNumber(crypto.total_volume)}
            </span>
          </div>
        </div>

        {/* Sparkline */}
        {crypto.sparkline_in_7d && (
          <div className="mt-4 h-14">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 30"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id={`gradient-${crypto.id}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={isPositive ? "#16a34a" : "#dc2626"}
                    stopOpacity="0.4"
                  />
                  <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path
                d={(() => {
                  const prices = crypto.sparkline_in_7d!.price;
                  const min = Math.min(...prices);
                  const max = Math.max(...prices);
                  const coords = prices
                    .map((p, i) => {
                      const x = (i / (prices.length - 1)) * 100;
                      const y = 30 - ((p - min) / (max - min)) * 30;
                      return `${x},${y}`;
                    })
                    .join(" ");
                  return `M0,30 L${coords} L100,30 Z`;
                })()}
                fill={`url(#gradient-${crypto.id})`}
              />
              <polyline
                fill="none"
                stroke={isPositive ? "#16a34a" : "#dc2626"}
                strokeWidth="2"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={sparklinePoints}
              />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );
}
