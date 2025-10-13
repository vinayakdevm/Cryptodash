import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { api } from "../services/api";
import { CandlestickChart } from "./CandlestickChart";
import { LoadingSpinner, ErrorState } from "./LoadingState";
import type { Crypto, CoinDetails, Currency } from "../types/crypto";
import type { Dispatch, SetStateAction } from "react";

interface CoinDetailsModalProps {
  coin: Crypto | null;
  currency: Currency;
  onClose: () => void;
  setGlobalLoading?: Dispatch<SetStateAction<boolean>>; // ✅ Added line
}

const currencySymbols: Record<Currency, string> = {
  usd: "$",
  eur: "€",
  inr: "₹",
};

export function CoinDetailsModal({
  coin,
  currency,
  onClose,
  setGlobalLoading,
}: CoinDetailsModalProps) {
  const [details, setDetails] = useState<CoinDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartDays, setChartDays] = useState<7 | 30>(7);

  useEffect(() => {
    if (!coin) return;
    const controller = new AbortController();
  
    const loadDetails = async () => {
      try {
        setGlobalLoading?.(true); // ✅ turn ON the global loader (optional safe call)
        setLoading(true);
        setError(null);
    
        const data = await api.getCoinDetails(coin.id, controller.signal);
        setDetails(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError('Failed to load coin details');
        }
      } finally {
        setLoading(false);
        setGlobalLoading?.(false); // ✅ turn OFF loader in all cases (even errors/aborts)
      }
    };
    
  
    loadDetails();
    return () => controller.abort();
  }, [coin]);
  

  const loadDetails = async () => {
    if (!coin) return;
    try {
      setLoading(true);
      setError(null);
      const data = await api.getCoinDetails(coin.id);
      setDetails(data);
    } catch {
      setError("Failed to load coin details");
    } finally {
      setLoading(false);
    }
  };

  if (!coin) return null;

  const isPositive = coin.price_change_percentage_24h >= 0;

  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return "N/A";
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  return (
    <AnimatePresence>
      {coin && (
        <>
          {/* --- Backdrop --- */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* --- Modal Container --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-6xl max-h-[90vh] bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-700">
              {/* --- Header --- */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-12 h-12 rounded-full border border-slate-300 dark:border-slate-700"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                      {coin.name}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 uppercase">
                      {coin.symbol}
                    </p>
                  </div>
                </div>

                {/* Animated close button */}
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                </motion.button>
              </div>

              {/* --- Content --- */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {loading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                  </div>
                ) : error ? (
                  <ErrorState message={error} onRetry={loadDetails} />
                ) : (
                  <>
                    {/* --- Quick Stats --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[
                        {
                          label: "Current Price",
                          value: `${currencySymbols[currency]}${coin.current_price.toLocaleString()}`,
                          trend: isPositive,
                          change: coin.price_change_percentage_24h?.toFixed(2),
                        },
                        {
                          label: "Market Cap",
                          value: `${currencySymbols[currency]}${formatNumber(coin.market_cap)}`,
                          extra: `Rank #${coin.market_cap_rank}`,
                        },
                        {
                          label: "24h Volume",
                          value: `${currencySymbols[currency]}${formatNumber(
                            coin.total_volume
                          )}`,
                        },
                        {
                          label: "Circulating Supply",
                          value: formatNumber(coin.circulating_supply),
                          extra: coin.symbol.toUpperCase(),
                        },
                      ].map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4"
                        >
                          <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                            {stat.label}
                          </div>
                          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                            {stat.value}
                          </div>
                          {stat.trend !== undefined && (
                            <div
                              className={`flex items-center space-x-1 mt-1 ${
                                stat.trend
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {stat.trend ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              <span className="font-medium">
                                {stat.change}%
                              </span>
                            </div>
                          )}
                          {stat.extra && (
                            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                              {stat.extra}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* --- Price Ranges --- */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        ["24h High", coin.high_24h],
                        ["24h Low", coin.low_24h],
                        ["All-Time High", coin.ath],
                        ["All-Time Low", coin.atl],
                      ].map(([label, value], i) => (
                        <div key={i}>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {label}
                          </div>
                          <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {currencySymbols[currency]}
                            {Number(value).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* --- Description --- */}
                    {details?.description?.en && (
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">
                          About {coin.name}
                        </h3>
                        <div
                          className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400"
                          dangerouslySetInnerHTML={{
                            __html:
                              details.description.en
                                .split(". ")
                                .slice(0, 3)
                                .join(". ") + ".",
                          }}
                        />
                      </div>
                    )}

                    {/* --- Chart --- */}
<div>
  <div className="flex items-center justify-between mb-4">
  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
  Price Chart ({chartDays}D)
</h3>


    <div className="flex gap-2">
      {[7, 30].map((d) => (
        <button
          key={d}
          onClick={() => setChartDays(d as 7 | 30)}
          className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
            chartDays === d
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {d}D
        </button>
      ))}
    </div>
  </div>

  <motion.div
    key={chartDays}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.4 }}
  >
    <CandlestickChart coinId={coin.id} days={chartDays} />
  </motion.div>
</div>

                    {/* --- Links --- */}
                    {details?.links && (
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">
                          Links
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {details.links.homepage[0] && (
                            <a
                              href={details.links.homepage[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                            >
                              <span>Website</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {details.links.blockchain_site[0] && (
                            <a
                              href={details.links.blockchain_site[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
                            >
                              <span>Explorer</span>
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
