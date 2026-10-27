import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  [x: string]: any;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  toggle: (id: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (id: string) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((fId) => fId !== id)
            : [...state.favorites, id],
        })),
      toggle: (id: string) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((fId) => fId !== id)
            : [...state.favorites, id],
        })),
    }),
    { name: 'favorites-storage' }
  )
);