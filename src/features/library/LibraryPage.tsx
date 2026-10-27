import { Search } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';
import { FixedSizeList as List } from 'react-window';
import { usePlaylistDispatch, usePlaylists } from '../../contexts/PlaylistContext';
import { SONGS } from '../../data/songs';
import { useDebounce } from '../../hooks/useDebounce';
import type { Song } from '../../types';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { usePlayerStore } from '../player/usePlayerStore';
import { SongRow } from './SongRow';

const genres = [...new Set(SONGS.map((song) => song.genre))];

export const LibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'duration'>('default');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>('');

  const debouncedSearch = useDebounce(searchTerm, 300);

  const playQueue = usePlayerStore((s) => s.playQueue);
  const addToQueue = usePlayerStore((s) => s.addToQueue);
  
  // 1. Sửa s.ids thành s.favorites và thêm mảng rỗng [] bảo vệ chống undefined khi test
  const favorites = useFavoritesStore((s) => s.favorites || (s as any).ids || []);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite || (s as any).toggle);
  
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  const filteredSongs = useMemo(() => {
    let result = SONGS;

    if (debouncedSearch.trim() !== '') {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(term) ||
          song.artist.toLowerCase().includes(term)
      );
    }

    if (selectedGenre !== 'Tất cả') {
      result = result.filter((song) => song.genre === selectedGenre);
    }

    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title, 'vi'));
    } else if (sortBy === 'duration') {
      result = [...result].sort((a, b) => a.duration - b.duration);
    }

    return result;
  }, [debouncedSearch, selectedGenre, sortBy]);

  const handlePlay = useCallback(
    (song: Song) => {
      const index = filteredSongs.findIndex((s) => s.id === song.id);
      playQueue(filteredSongs, index !== -1 ? index : 0);
    },
    [filteredSongs, playQueue]
  );

  const handleAddToQueue = useCallback(
    (song: Song) => {
      addToQueue(song);
    },
    [addToQueue]
  );

  const handleToggleFavorite = useCallback(
    (id: string) => {
      toggleFavorite(id);
    },
    [toggleFavorite]
  );

  // 2. Sử dụng đúng signature hàm nhận playlistId và song để hết cảnh báo ts(6133)
  const handleAddToPlaylist = useCallback(
    (playlistId: string, song: Song) => {
      dispatch({
        type: 'ADD_SONG',
        payload: { playlistId, songId: song.id },
      });
    },
    [dispatch]
  );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-neutral-800/60 p-4 rounded-xl border border-neutral-700/50 backdrop-blur">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <label htmlFor="search-input" className="sr-only">Tìm kiếm</label>
          <input
            id="search-input"
            type="text"
            placeholder="Tìm theo tên bài hát hoặc ca sĩ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 text-white rounded-lg border border-neutral-700 focus:outline-none focus:border-spotify-green transition text-sm"
          />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            aria-label="Thể loại"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-spotify-green"
          >
            <option value="Tất cả">Tất cả thể loại</option>
            {genres.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select
            aria-label="Sắp xếp"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-spotify-green"
          >
            <option value="default">Sắp xếp: Mặc định</option>
            <option value="name">Tên A-Z</option>
            <option value="duration">Thời lượng tăng dần</option>
          </select>

          <select
            aria-label="Chọn Playlist"
            value={selectedPlaylistId}
            onChange={(e) => setSelectedPlaylistId(e.target.value)}
            className="bg-neutral-900 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-spotify-green"
          >
            <option value="">-- Chọn Playlist --</option>
            {playlists.map((pl) => (
              <option key={pl.id} value={pl.id}>{pl.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="text-sm text-neutral-400 font-medium">
        {filteredSongs.length > 0
          ? `Tìm thấy ${filteredSongs.length} bài hát`
          : 'Không tìm thấy bài hát nào'}
      </div>

      {filteredSongs.length > 0 && (
        <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 overflow-hidden shadow-xl">
          <List
            height={560}
            itemCount={filteredSongs.length}
            itemSize={56}
            width="100%"
          >
            {({ index, style }) => {
              const song = filteredSongs[index];
              return (
                <SongRow
                  key={song.id}
                  song={song}
                  index={index}
                  style={style}
                  /* 3. Đảm bảo kiểm tra Array.isArray cho isFavorite */
                  isFavorite={Array.isArray(favorites) && favorites.includes(song.id)}
                  playlists={playlists}
                  onPlay={handlePlay}
                  onAddToQueue={handleAddToQueue}
                  onToggleFavorite={handleToggleFavorite}
                  /* 4. Truyền đúng hàm callback đã khai báo */
                  onAddToPlaylist={(playlistId) => handleAddToPlaylist(playlistId, song)}
                />
              );
            }}
          </List>
        </div>
      )}
    </div>
  );
};

export default LibraryPage;