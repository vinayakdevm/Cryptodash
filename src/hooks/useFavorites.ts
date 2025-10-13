import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'cryptodash-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (coinId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(coinId)) {
        next.delete(coinId);
      } else {
        next.add(coinId);
      }
      return next;
    });
  };

  const isFavorite = (coinId: string) => favorites.has(coinId);

  return { favorites, toggleFavorite, isFavorite };
}
