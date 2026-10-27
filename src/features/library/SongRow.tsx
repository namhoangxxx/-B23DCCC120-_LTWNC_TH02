import { Heart, ListPlus, Play, Plus } from 'lucide-react';
import React, { useState } from 'react';
import type { Song } from '../../types';
import { formatDuration } from '../../utils/format';
import type { Playlist } from '../playlists/playlistReducer';

interface SongRowProps {
  song: Song;
  index: number;
  isFavorite: boolean;
  playlists: Playlist[];
  onPlay: (song: Song) => void;
  onAddToQueue: (song: Song) => void;
  onToggleFavorite: (id: string) => void;
  onAddToPlaylist: (playlistId: string, song: Song) => void;
  style?: React.CSSProperties;
}

export const SongRow: React.FC<SongRowProps> = React.memo(({
  song,
  index,
  isFavorite,
  playlists,
  onPlay,
  onAddToQueue,
  onToggleFavorite,
  onAddToPlaylist,
  style,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div
      style={style}
      className="group flex items-center px-4 py-2 hover:bg-neutral-800/80 rounded-md transition-colors text-sm border-b border-neutral-800/40 relative"
    >
      <span className="w-10 text-neutral-400 font-mono">{index + 1}</span>
      
      <div className="flex-1 min-w-0 pr-4">
        <p className="font-semibold text-white truncate">{song.title}</p>
        <p className="text-xs text-neutral-400 truncate">{song.artist}</p>
      </div>

      <div className="w-24 hidden md:block text-xs text-neutral-400">
        <span className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700">
          {song.genre}
        </span>
      </div>

      <div className="w-16 text-right font-mono text-xs text-neutral-400 pr-4">
        {formatDuration(song.duration)}
      </div>

      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100">
        <button
          aria-label="Phát"
          onClick={() => onPlay(song)}
          className="p-2 text-spotify-green hover:scale-110 transition"
          title="Phát bài hát"
        >
          <Play size={18} fill="currentColor" />
        </button>

        <button
          aria-label="Thêm vào hàng đợi"
          onClick={() => onAddToQueue(song)}
          className="p-2 text-neutral-300 hover:text-white hover:scale-110 transition"
          title="+ Hàng đợi"
        >
          <Plus size={18} />
        </button>

        <button
          aria-label={isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
          onClick={() => onToggleFavorite(song.id)}
          className={`p-2 transition hover:scale-110 ${
            isFavorite ? 'text-spotify-green fill-spotify-green' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* Nút + Playlist thông minh mở Popup */}
        <div className="relative">
          <button
            aria-label="+ Playlist"
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-200 border border-neutral-700 transition"
          >
            <ListPlus size={14} /> + Playlist
          </button>

          {showMenu && (
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-50 p-1">
              <p className="text-[10px] text-neutral-400 px-2 py-1 font-semibold uppercase">Thêm vào Playlist</p>
              {playlists.length === 0 ? (
                <p className="text-xs text-neutral-500 px-2 py-1">Chưa có playlist nào</p>
              ) : (
                playlists.map((pl) => (
                  <button
                    key={pl.id}
                    onClick={() => {
                      onAddToPlaylist(pl.id, song);
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 text-xs text-neutral-200 hover:bg-spotify-green hover:text-black rounded transition truncate"
                  >
                    {pl.name}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

SongRow.displayName = 'SongRow';