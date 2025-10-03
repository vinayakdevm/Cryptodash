import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react';
import { api } from '../services/api';
import { CandlestickChart } from './CandlestickChart';
import { LoadingSpinner, ErrorState } from './LoadingState';
import type { Crypto, CoinDetails, Currency } from '../types/crypto';

interface CoinDetailsModalProps {
  coin: Crypto | null;
  currency: Currency;
  onClose: () => void;
}

const currencySymbols: Record<Currency, string> = {
  usd: '$',
  eur: '€',
  inr: '₹',
};

export function CoinDetailsModal({ coin, currency, onClose }: CoinDetailsModalProps) {
  const [details, setDetails] = useState<CoinDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartDays, setChartDays] = useState<30 | 90>(30);

  useEffect(() => {
    if (coin) {
      loadDetails();
    }
  }, [coin]);

  const loadDetails = async () => {
    if (!coin) return;

    try {
      setLoading(true);
      setError(null);
      const data = await api.getCoinDetails(coin.id);
      setDetails(data);
    } catch (err) {
      setError('Failed to load coin details');
    } finally {
      setLoading(false);
    }
  };

  if (!coin) return null;

  const isPositive = coin.price_change_percentage_24h >= 0;

  const formatNumber = (num: number | null | undefined) => {
    if (num == null) return 'N/A';
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  return (
    <AnimatePresence>
      {coin && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={coin.image} alt={coin.name} className="w-12 h-12" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {coin.name}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 uppercase">
                    {coin.symbol}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {loading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorState message={error} onRetry={loadDetails} />
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        Current Price
                      </div>
                      <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {currencySymbols[currency]}{coin.current_price.toLocaleString()}
                      </div>
                      <div
                        className={`flex items-center space-x-1 mt-1 ${
                          isPositive ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        <span className="font-medium">
                          {coin.price_change_percentage_24h ? Math.abs(coin.price_change_percentage_24h).toFixed(2) : '0.00'}%
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        Market Cap
                      </div>
                      <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {currencySymbols[currency]}{formatNumber(coin.market_cap)}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Rank #{coin.market_cap_rank}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        24h Volume
                      </div>
                      <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {currencySymbols[currency]}{formatNumber(coin.total_volume)}
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
                      <div className="text-sm text-slate-500 dark:text-slate-400 mb-1">
                        Circulating Supply
                      </div>
                      <div className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {formatNumber(coin.circulating_supply)}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {coin.symbol.toUpperCase()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">24h High</div>
                      <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {currencySymbols[currency]}{coin.high_24h.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">24h Low</div>
                      <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {currencySymbols[currency]}{coin.low_24h.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">All-Time High</div>
                      <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {currencySymbols[currency]}{coin.ath.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">All-Time Low</div>
                      <div className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        {currencySymbols[currency]}{coin.atl.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {details?.description?.en && (
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">
                        About {coin.name}
                      </h3>
                      <div
                        className="text-slate-600 dark:text-slate-400 prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: details.description.en.split('. ').slice(0, 3).join('. ') + '.',
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        Price Chart
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setChartDays(30)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            chartDays === 30
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          30D
                        </button>
                        <button
                          onClick={() => setChartDays(90)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            chartDays === 90
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          90D
                        </button>
                      </div>
                    </div>
                    <CandlestickChart coinId={coin.id} days={chartDays} />
                  </div>

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
                </div>
              )}
            </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
