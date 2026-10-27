import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PlaylistProvider } from '../../contexts/PlaylistContext';
import PlaylistDetailPage from './PlaylistDetailPage';

describe('PlaylistDetailPage', () => {
  it('renders empty playlist state when playlist is not found', () => {
    render(
      <PlaylistProvider>
        <MemoryRouter initialEntries={['/playlists/invalid-id']}>
          <Routes>
            <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
          </Routes>
        </MemoryRouter>
      </PlaylistProvider>
    );

    expect(screen.getByText(/Không tìm thấy playlist/i)).toBeInTheDocument();
  });
});