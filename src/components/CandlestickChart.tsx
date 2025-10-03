import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { LoadingSpinner, ErrorState } from './LoadingState';
import type { CandlestickData } from '../types/crypto';

interface CandlestickChartProps {
  coinId: string;
  days: number;
}

export function CandlestickChart({ coinId, days }: CandlestickChartProps) {
  const [data, setData] = useState<CandlestickData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [coinId, days]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const ohlcData = await api.getCoinOHLC(coinId, days);
      const candlestickData: CandlestickData[] = ohlcData.map((item) => ({
        time: item[0],
        open: item[1],
        high: item[2],
        low: item[3],
        close: item[4],
      }));
      setData(candlestickData);
    } catch (err) {
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  if (data.length === 0) return null;

  const maxPrice = Math.max(...data.map((d) => d.high));
  const minPrice = Math.min(...data.map((d) => d.low));
  const priceRange = maxPrice - minPrice;
  const chartHeight = 400;
  const chartWidth = 800;
  const candleWidth = Math.max(4, Math.floor(chartWidth / data.length) - 2);

  const getY = (price: number) => {
    return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <svg
          width={Math.max(chartWidth, data.length * (candleWidth + 2))}
          height={chartHeight + 60}
          className="mx-auto"
        >
          <g transform={`translate(0, 20)`}>
            {data.map((candle, index) => {
              const x = index * (candleWidth + 2);
              const isGreen = candle.close >= candle.open;
              const color = isGreen ? '#10b981' : '#ef4444';

              const openY = getY(candle.open);
              const closeY = getY(candle.close);
              const highY = getY(candle.high);
              const lowY = getY(candle.low);

              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.abs(closeY - openY) || 1;

              return (
                <motion.g
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.01 }}
                >
                  <line
                    x1={x + candleWidth / 2}
                    y1={highY}
                    x2={x + candleWidth / 2}
                    y2={lowY}
                    stroke={color}
                    strokeWidth={1}
                  />

                  <rect
                    x={x}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    stroke={color}
                    strokeWidth={1}
                  />
                </motion.g>
              );
            })}
          </g>

          <g transform={`translate(0, ${chartHeight + 30})`}>
            <line
              x1={0}
              y1={0}
              x2={Math.max(chartWidth, data.length * (candleWidth + 2))}
              y2={0}
              stroke="currentColor"
              className="text-slate-300 dark:text-slate-600"
              strokeWidth={1}
            />
            {data.filter((_, i) => i % Math.ceil(data.length / 8) === 0).map((candle, index) => {
              const dataIndex = index * Math.ceil(data.length / 8);
              const x = dataIndex * (candleWidth + 2);
              const date = new Date(candle.time);
              const label = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <text
                  key={dataIndex}
                  x={x}
                  y={15}
                  fontSize={10}
                  fill="currentColor"
                  className="text-slate-500 dark:text-slate-400"
                  textAnchor="middle"
                >
                  {label}
                </text>
              );
            })}
          </g>

          <g>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const price = minPrice + priceRange * ratio;
              const y = 20 + chartHeight - chartHeight * ratio;

              return (
                <g key={ratio}>
                  <line
                    x1={0}
                    y1={y}
                    x2={Math.max(chartWidth, data.length * (candleWidth + 2))}
                    y2={y}
                    stroke="currentColor"
                    className="text-slate-200 dark:text-slate-700"
                    strokeWidth={1}
                    strokeDasharray="4"
                  />
                  <text
                    x={-10}
                    y={y + 4}
                    fontSize={10}
                    fill="currentColor"
                    className="text-slate-500 dark:text-slate-400"
                    textAnchor="end"
                  >
                    ${price.toFixed(2)}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded" />
          <span className="text-slate-600 dark:text-slate-400">Bullish</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-red-500 rounded" />
          <span className="text-slate-600 dark:text-slate-400">Bearish</span>
        </div>
      </div>
    </div>
  );
}
