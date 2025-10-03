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
import type { Currency, Crypto } from './types/crypto';

function AppContent() {
  const [currentView, setCurrentView] = useState<'welcome' | 'dashboard' | 'favorites'>('welcome');
  const [currency, setCurrency] = useState<Currency>('usd');
  const [selectedCoin, setSelectedCoin] = useState<Crypto | null>(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {currentView === 'welcome' ? (
        <WelcomePage onGetStarted={() => setCurrentView('dashboard')} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'dashboard' && (
            <>
              <GlobalMarketStats currency={currency} />
              <TopMovers currency={currency} onCoinClick={setSelectedCoin} />
            </>
          )}

          <CryptoGrid
            currency={currency}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onCoinClick={setSelectedCoin}
            showOnlyFavorites={currentView === 'favorites'}
          />
        </div>
      )}

      <WatchlistWidget
        favorites={favorites}
        currency={currency}
        onCoinClick={setSelectedCoin}
        onRemoveFavorite={toggleFavorite}
      />

      <CoinDetailsModal
        coin={selectedCoin}
        currency={currency}
        onClose={() => setSelectedCoin(null)}
      />
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
