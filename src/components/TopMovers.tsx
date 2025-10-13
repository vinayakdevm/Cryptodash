import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { api } from "../services/api";
import type { Crypto, Currency } from "../types/crypto";
import { LoadingSpinner } from "./LoadingState";
import type { Dispatch, SetStateAction } from "react";

interface TopMoversProps {
  currency: Currency;
  onCoinClick: (crypto: Crypto) => void;
  setGlobalLoading?: Dispatch<SetStateAction<boolean>>; // ✅ Add this line
}

const currencySymbols: Record<Currency, string> = {
  usd: "$",
  eur: "€",
  inr: "₹",
};

export function TopMovers({ currency, onCoinClick, setGlobalLoading }: TopMoversProps) {
  const [coins, setCoins] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCoins();
  }, [currency]);

  const loadCoins = async () => {
    try {
      setLoading(true);
      setGlobalLoading?.(true); // ✅
      const data = await api.getCoins(currency, 1, 100);
      setCoins(data);
    } catch (err) {
      console.error("Failed to load coins for top movers", err);
    } finally {
      setLoading(false);
      setGlobalLoading?.(false); // ✅
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

  const Sparkline = ({ prices, isGainer }: { prices?: number[]; isGainer: boolean }) => {
    if (!prices || prices.length === 0) return null;

    const points = useMemo(() => {
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      return prices
        .map((price, i) => {
          const x = (i / (prices.length - 1)) * 100;
          const y = 30 - ((price - min) / (max - min)) * 30;
          return `${x},${y}`;
        })
        .join(" ");
    }, [prices]);

    return (
      <svg className="w-full h-8 mt-1" viewBox="0 0 100 30" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`grad-${isGainer ? "up" : "down"}`} x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor={isGainer ? "#10b981" : "#ef4444"}
              stopOpacity="0.4"
            />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M0,30 L${points} L100,30 Z`}
          fill={`url(#grad-${isGainer ? "up" : "down"})`}
        />
        <polyline
          fill="none"
          stroke={isGainer ? "#10b981" : "#ef4444"}
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />
      </svg>
    );
  };

  const MoverCard = ({
    coin,
    isGainer,
  }: {
    coin: Crypto;
    isGainer: boolean;
  }) => (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -2,
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
      }}
      transition={{ type: "spring", stiffness: 200 }}
      onClick={() => onCoinClick(coin)}
      className={`
        relative p-4 rounded-xl border cursor-pointer overflow-hidden transition-all
        ${
          isGainer
            ? "bg-gradient-to-br from-sky-50 to-cyan-100 dark:from-sky-950/20 dark:to-cyan-900/20 border-cyan-200 dark:border-cyan-800"
            : "bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800"
        }
      `}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={coin.image}
            alt={coin.name}
            className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
          />
          <div>
            <div className="font-semibold text-slate-800 dark:text-slate-100">
              {coin.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 uppercase">
              #{coin.market_cap_rank} • {coin.symbol}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold text-slate-800 dark:text-slate-100">
            {currencySymbols[currency]}
            {coin.current_price.toLocaleString()}
          </div>
          <div
            className={`flex items-center justify-end gap-1 text-sm font-medium ${
              isGainer ? "text-green-500" : "text-red-500"
            }`}
          >
            {isGainer ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownRight className="w-4 h-4" />
            )}
            {coin.price_change_percentage_24h
              ? Math.abs(coin.price_change_percentage_24h).toFixed(2)
              : "0.00"}
            %
          </div>
        </div>
      </div>

      {/* Sparkline */}
      {coin.sparkline_in_7d && (
        <Sparkline
          prices={coin.sparkline_in_7d.price}
          isGainer={isGainer}
        />
      )}
    </motion.div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
      {/* Top Gainers */}
      <motion.div
        initial={{ opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="relative p-6 rounded-2xl border bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-900/20 border-emerald-300/40 dark:border-emerald-800/40 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-emerald-500" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Top Gainers (24h)
          </h2>
        </div>
        <div className="space-y-3">
          {topGainers.map((coin) => (
            <MoverCard key={coin.id} coin={coin} isGainer={true} />
          ))}
        </div>
      </motion.div>

      {/* Top Losers */}
      <motion.div
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 150 }}
        className="relative p-6 rounded-2xl border bg-gradient-to-br from-rose-50 to-red-100 dark:from-rose-950/30 dark:to-red-900/20 border-rose-300/40 dark:border-rose-800/40 shadow-lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingDown className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Top Losers (24h)
          </h2>
        </div>
        <div className="space-y-3">
          {topLosers.map((coin) => (
            <MoverCard key={coin.id} coin={coin} isGainer={false} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
