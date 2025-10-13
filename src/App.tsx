import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { useFavorites } from './hooks/useFavorites';
import { Navbar } from './components/Navbar';
import { WelcomePage } from './components/WelcomePage';
import { GlobalMarketStats } from './components/GlobalMarketStats';
import { TopMovers } from './components/TopMovers';
import { CryptoGrid } from './components/CryptoGrid';
import { WatchlistWidget } from './components/WatchlistWidget';
import { CoinDetailsModal } from './components/CoinDetailsModal';
import { Footer } from './components/Footer';
import { GlobalLoader } from './components/GlobalLoader';

import type { Currency, Crypto } from './types/crypto';

function AppContent() {
  const [currentView, setCurrentView] = useState<'welcome' | 'dashboard' | 'favorites'>('welcome');
  const [currency, setCurrency] = useState<Currency>('usd');
  const [selectedCoin, setSelectedCoin] = useState<Crypto | null>(null);
  const { favorites, toggleFavorite } = useFavorites();
  const [globalLoading, setGlobalLoading] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors relative">
      {/* --- Global Loader --- */}
      <GlobalLoader loading={globalLoading} />

      {/* --- Navbar --- */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        currency={currency}
        onCurrencyChange={(val) => {
          setCurrency(val);
          setGlobalLoading(true);
          setTimeout(() => setGlobalLoading(false), 1500); // smooth loading on currency switch
        }}
      />

      {/* --- Welcome Page / Dashboard --- */}
      {currentView === 'welcome' ? (
        <WelcomePage onGetStarted={() => setCurrentView('dashboard')} />
      ) : (
        <div className="relative">
          <div className="market-background absolute inset-0 pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {/* --- Dashboard View --- */}
            {currentView === 'dashboard' && (
              <>
                <GlobalMarketStats
                  currency={currency}
                  setGlobalLoading={setGlobalLoading}
                />
                <TopMovers
                  currency={currency}
                  onCoinClick={(coin) => {
                    setSelectedCoin(coin);
                    setGlobalLoading(true);
                  }}
                  setGlobalLoading={setGlobalLoading}
                />
              </>
            )}

            {/* --- All Coins Grid / Favorites --- */}
            <CryptoGrid
  currency={currency}
  favorites={favorites}
  onToggleFavorite={toggleFavorite}
  onCoinClick={(coin) => {
    setSelectedCoin(coin);
    setGlobalLoading(true);
  }}
  showOnlyFavorites={currentView === 'favorites'}
  setGlobalLoading={setGlobalLoading} // ✅ this is now valid
/>

          </div>
        </div>
      )}

      {/* --- Floating Watchlist Widget --- */}
      <WatchlistWidget
        favorites={favorites}
        currency={currency}
        onCoinClick={(coin) => {
          setSelectedCoin(coin);
          setGlobalLoading(true);
        }}
        onRemoveFavorite={toggleFavorite}
      />

      {/* --- Coin Details Modal --- */}
      <CoinDetailsModal
  coin={selectedCoin}
  currency={currency}
  onClose={() => setSelectedCoin(null)}
  setGlobalLoading={setGlobalLoading}
/>


      {/* --- Footer --- */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
