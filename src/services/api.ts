import type { Crypto, CoinDetails, ChartData, Currency, GlobalMarketData } from "../types/crypto";

const BASE_URL = "/api/coingecko"; // ✅ Proxy path instead of full URL

export const api = {
  // ✅ Fetch list of coins with sparkline
  async getCoins(currency: string, page = 1, perPage = 100, signal?: AbortSignal) {
    const res = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true`,
      { signal }
    );
    if (!res.ok) throw new Error("Failed to fetch coins");
    return res.json();
  },

  // ✅ Fetch details for a specific coin
  async getCoinDetails(id: string, signal?: AbortSignal): Promise<CoinDetails> {
    const res = await fetch(`${BASE_URL}/coins/${id}`, { signal });
    if (!res.ok) throw new Error("Failed to fetch coin details");
    return res.json();
  },

  // ✅ Fetch global market data
  async getGlobalMarketData(signal?: AbortSignal): Promise<GlobalMarketData> {
    const res = await fetch(`${BASE_URL}/global`, { signal });
    if (!res.ok) throw new Error("Failed to fetch global market data");
    const data = await res.json();
    return data.data;
  },

  // ✅ Fetch standard line-chart data (market_chart)
  async getCoinChartData(
    id: string,
    days: number = 30,
    currency: Currency = "usd",
    signal?: AbortSignal
  ): Promise<ChartData> {
    const res = await fetch(
      `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`,
      { signal }
    );
    if (!res.ok) throw new Error("Failed to fetch chart data");
    return res.json();
  },

  // ✅ Fetch OHLC (candlestick) data
  async getCoinOHLC(
    id: string,
    days: number,
    signal?: AbortSignal
  ): Promise<[number, number, number, number, number][]> {
    const res = await fetch(`${BASE_URL}/coins/${id}/ohlc?vs_currency=usd&days=${days}`, { signal });
    if (!res.ok) throw new Error("Failed to fetch OHLC data");
    return res.json();
  },

  // ✅ Fetch trending coins
  async getTrendingCoins(signal?: AbortSignal): Promise<any> {
    const res = await fetch(`${BASE_URL}/search/trending`, { signal });
    if (!res.ok) throw new Error("Failed to fetch trending coins");
    return res.json();
  },
};
