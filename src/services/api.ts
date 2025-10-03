import type { Crypto, CoinDetails, GlobalMarketData, ChartData, Currency } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const api = {
  async getCoins(currency: Currency = 'usd', page: number = 1, perPage: number = 100): Promise<Crypto[]> {
    const response = await fetch(
      `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=24h`
    );
    if (!response.ok) throw new Error('Failed to fetch coins');
    return response.json();
  },

  async getCoinDetails(id: string): Promise<CoinDetails> {
    const response = await fetch(
      `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );
    if (!response.ok) throw new Error('Failed to fetch coin details');
    return response.json();
  },

  async getGlobalMarketData(): Promise<GlobalMarketData> {
    const response = await fetch(`${BASE_URL}/global`);
    if (!response.ok) throw new Error('Failed to fetch global market data');
    const data = await response.json();
    return data.data;
  },

  async getCoinChartData(id: string, days: number = 30, currency: Currency = 'usd'): Promise<ChartData> {
    const response = await fetch(
      `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
    );
    if (!response.ok) throw new Error('Failed to fetch chart data');
    return response.json();
  },

  async getCoinOHLC(id: string, days: number = 30): Promise<number[][]> {
    const response = await fetch(
      `${BASE_URL}/coins/${id}/ohlc?vs_currency=usd&days=${days}`
    );
    if (!response.ok) throw new Error('Failed to fetch OHLC data');
    return response.json();
  },

  async getTrendingCoins(): Promise<any> {
    const response = await fetch(`${BASE_URL}/search/trending`);
    if (!response.ok) throw new Error('Failed to fetch trending coins');
    return response.json();
  }
};
