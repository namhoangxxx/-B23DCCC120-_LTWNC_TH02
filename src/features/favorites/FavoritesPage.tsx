import React from 'react';
import { generateSongs } from '../../data/songs';
import { SongRow } from '../library/SongRow';
import { usePlayerStore } from '../player/usePlayerStore';
import { useFavoritesStore } from './useFavoritesStore';
/* Import đúng tên usePlaylists và usePlaylistDispatch */
import { Heart, Play } from 'lucide-react';
import { usePlaylistDispatch, usePlaylists } from '../../contexts/PlaylistContext';

const SONGS = generateSongs(10000);

export const FavoritesPage: React.FC = () => {
  const favoriteIds = useFavoritesStore((s) => s.favorites || (s as any).favoriteIds || []);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite || (s as any).toggle);
  const playQueue = usePlayerStore((s) => s.playQueue);
  
  /* Sử dụng 2 custom hook chuẩn từ PlaylistContext */
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();

  const favoriteSongs = SONGS.filter((song) => Array.isArray(favoriteIds) && favoriteIds.includes(song.id));

  const handlePlayAll = () => {
    if (favoriteSongs.length > 0) {
      playQueue(favoriteSongs, 0);
    }
  };

  return (
    <div className="p-6 pb-24 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/20 text-red-500 rounded-lg">
            <Heart size={28} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Bài hát yêu thích</h1>
            <p className="text-xs text-neutral-400">{favoriteSongs.length} bài hát</p>
          </div>
        </div>

        {favoriteSongs.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="flex items-center gap-2 bg-spotify-green text-black font-semibold px-4 py-2 rounded-full hover:scale-105 transition cursor-pointer"
          >
            <Play size={18} fill="currentColor" /> Phát tất cả
          </button>
        )}
      </div>

      {favoriteSongs.length === 0 ? (
        <div className="text-center py-16 text-neutral-400 bg-neutral-900/50 rounded-xl border border-neutral-800">
          <Heart size={48} className="mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">Chưa có bài hát yêu thích nào</p>
          <p className="text-xs text-neutral-500 mt-1">Bấm biểu tượng trái tim ở danh sách bài hát để thêm vào đây</p>
        </div>
      ) : (
        <div className="bg-neutral-900/60 rounded-xl border border-neutral-800/80 overflow-hidden">
          {favoriteSongs.map((song, index) => (
            <SongRow
              key={song.id}
              song={song}
              index={index}
              isFavorite={true}
              playlists={playlists}
              onPlay={() => playQueue(favoriteSongs, index)}
              onAddToQueue={(s) => usePlayerStore.getState().addToQueue(s)}
              onToggleFavorite={(id) => toggleFavorite(id)}
              onAddToPlaylist={(playlistId, s) => {
                dispatch({
                  type: 'ADD_SONG',
                  payload: { playlistId, songId: s.id },
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;