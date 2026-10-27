import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { PlaylistProvider } from '../../contexts/PlaylistContext';
import FavoritesPage from './FavoritesPage';
import { useFavoritesStore } from './useFavoritesStore';

describe('FavoritesPage', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [] });
  });

  it('hien thi thong bao khi danh sach yeu thich trong', () => {
    render(
      <PlaylistProvider>
        <MemoryRouter>
          <FavoritesPage />
        </MemoryRouter>
      </PlaylistProvider>
    );

    expect(screen.getByText(/Chưa có bài hát yêu thích/i)).toBeInTheDocument();
  });
});