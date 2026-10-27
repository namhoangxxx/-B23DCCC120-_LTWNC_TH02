import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Song } from '../../types';
import { SongRow } from './SongRow';

const mockSong: Song = {
  id: 's1',
  title: 'Mưa tháng Sáu 1',
  artist: 'Lê Minh',
  genre: 'Pop',
  duration: 150,
};

describe('SongRow', () => {
  it('hiển thị tên bài hát và thời lượng 02:30', () => {
    render(
      <SongRow
        song={mockSong}
        index={0}
        isFavorite={false}
        playlists={[]}
        onPlay={vi.fn()}
        onAddToQueue={vi.fn()}
        onToggleFavorite={vi.fn()}
        onAddToPlaylist={vi.fn()}
      />
    );

    expect(screen.getByText('Mưa tháng Sáu 1')).toBeInTheDocument();
    expect(screen.getByText('02:30')).toBeInTheDocument();
  });

  it('bấm nút Phát (tìm bằng getByRole) thì hàm mock vi.fn() được gọi với đúng bài hát', () => {
    const onPlayMock = vi.fn();
    render(
      <SongRow
        song={mockSong}
        index={0}
        isFavorite={false}
        playlists={[]}
        onPlay={onPlayMock}
        onAddToQueue={vi.fn()}
        onToggleFavorite={vi.fn()}
        onAddToPlaylist={vi.fn()}
      />
    );

    const playBtn = screen.getByRole('button', { name: 'Phát' });
    fireEvent.click(playBtn);
    expect(onPlayMock).toHaveBeenCalledWith(mockSong);
  });
});