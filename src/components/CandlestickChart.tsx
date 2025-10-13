import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import { LoadingSpinner, ErrorState } from "./LoadingState";
import type { CandlestickData } from "../types/crypto";

interface CandlestickChartProps {
  coinId: string;
  days: number;
}

export function CandlestickChart({ coinId, days }: CandlestickChartProps) {
  const [data, setData] = useState<CandlestickData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const ohlcData: [number, number, number, number, number][] =
          await api.getCoinOHLC(coinId, days, controller.signal);

        if (!ohlcData || ohlcData.length === 0) {
          throw new Error("No chart data available");
        }

        const candlestickData: CandlestickData[] = ohlcData
          .filter((item) => item.every((n) => typeof n === "number" && !isNaN(n)))
          .map((item) => ({
            time: item[0],
            open: item[1],
            high: item[2],
            low: item[3],
            close: item[4],
          }));

        setData(candlestickData);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError("Failed to load chart data");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => controller.abort();
  }, [coinId, days]);

  // Early returns
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} onRetry={() => {}} />;
  if (!data.length)
    return (
      <div className="text-center py-10 text-slate-500 dark:text-slate-400">
        No candlestick data available.
      </div>
    );

  // --- Chart setup ---
  const maxPrice = Math.max(...data.map((d) => d.high));
  const minPrice = Math.min(...data.map((d) => d.low));
  const priceRange = maxPrice - minPrice || 1; // ✅ Prevent division by zero

  const chartHeight = 400;
  const chartWidth = Math.max(900, data.length * 10);
  const candleWidth = Math.max(
    3,
    Math.min(8, Math.floor(chartWidth / data.length) - 1)
  );

  const getY = (price: number) =>
    chartHeight - ((price - minPrice) / priceRange) * chartHeight + 30;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
        <svg
          width={Math.max(chartWidth, data.length * (candleWidth + 2))}
          height={chartHeight + 60}
          className="mx-auto"
        >
          <g transform={`translate(50, 20)`}>
            {data.map((candle, index) => {
              if (
                [candle.open, candle.close, candle.high, candle.low].some(
                  (v) => isNaN(v) || !isFinite(v)
                )
              )
                return null;

              const x = index * (candleWidth + 3);
              const isBullish = candle.close >= candle.open;
              const color = isBullish ? "#10b981" : "#ef4444";

              const openY = getY(candle.open);
              const closeY = getY(candle.close);
              const highY = getY(candle.high);
              const lowY = getY(candle.low);

              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.abs(closeY - openY) || 1;

              return (
                <motion.g
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.002 }}
                >
                  <line
                    x1={x + candleWidth / 2}
                    y1={highY}
                    x2={x + candleWidth / 2}
                    y2={lowY}
                    stroke={color}
                    strokeWidth={1.2}
                  />
                  <rect
                    x={x}
                    y={bodyTop}
                    width={candleWidth}
                    height={bodyHeight}
                    fill={color}
                    stroke={color}
                    strokeWidth={0.8}
                    rx={1}
                  />
                </motion.g>
              );
            })}
          </g>

          {/* --- X-Axis Labels --- */}
          <g transform={`translate(50, ${chartHeight + 30})`}>
            {data
              .filter((_, i) => i % Math.ceil(data.length / 8) === 0)
              .map((candle, index) => {
                const dataIndex = index * Math.ceil(data.length / 8);
                const x = dataIndex * (candleWidth + 3);
                const date = new Date(candle.time);
                const label = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });

                return (
                  <text
                    key={index}
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
