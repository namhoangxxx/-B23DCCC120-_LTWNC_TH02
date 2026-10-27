import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { PlaylistProvider } from '../../contexts/PlaylistContext';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import LibraryPage from './LibraryPage';

describe('LibraryPage', () => {
  beforeEach(() => {
    useFavoritesStore.setState({ favorites: [] });
    usePlayerStore.setState({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
    });
  });

  it('renders library header and search input', () => {
    render(
      <PlaylistProvider>
        <MemoryRouter>
          <LibraryPage />
        </MemoryRouter>
      </PlaylistProvider>
    );

    // Khớp đúng placeholder thực tế trong component
    expect(screen.getByPlaceholderText(/Tìm theo tên bài hát hoặc ca sĩ/i)).toBeInTheDocument();
  });
});