import { TrendingUp, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span className="text-lg font-bold text-slate-900 dark:text-white">CryptoDash</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Real-time cryptocurrency tracking and market analysis platform.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Features</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Live Price Updates</li>
              <li>Market Statistics</li>
              <li>Favorites Watchlist</li>
              <li>Interactive Charts</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Resources</h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Market Data by CoinGecko</li>
              <li>Real-time Updates</li>
              <li>Multi-Currency Support</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {currentYear} CryptoDash. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-slate-600 dark:text-slate-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>for crypto enthusiasts</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
