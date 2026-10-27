import { ArrowLeft, Play } from 'lucide-react';
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { usePlaylistDispatch, usePlaylists } from '../../contexts/PlaylistContext';
import { SONGS } from '../../data/songs';
import { formatDuration } from '../../utils/format';
import { usePlayerStore } from '../player/usePlayerStore';

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const playQueue = usePlayerStore((s) => s.playQueue);

  const playlist = playlists.find((pl) => pl.id === id);

  if (!playlist) {
    return (
      <div className="p-10 text-center space-y-4">
        <p className="text-neutral-400 font-semibold text-lg">Không tìm thấy playlist.</p>
        <Link to="/playlists" className="text-spotify-green underline text-sm">
          Quay lại danh sách playlist
        </Link>
      </div>
    );
  }

  const playlistSongs = SONGS.filter((song) => playlist.songIds.includes(song.id));

  const totalDurationSeconds = playlistSongs.reduce((sum, song) => sum + song.duration, 0);
  const totalMins = Math.floor(totalDurationSeconds / 60);
  const totalSecs = totalDurationSeconds % 60;

  const handlePlayAll = () => {
    if (playlistSongs.length > 0) {
      playQueue(playlistSongs, 0);
    }
  };

  const handleRemoveSong = (songId: string) => {
    dispatch({
      type: 'REMOVE_SONG',
      payload: { playlistId: playlist.id, songId },
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 pb-32">
      <Link to="/playlists" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white text-sm transition">
        <ArrowLeft size={16} /> Quay lại danh sách
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end bg-neutral-800/40 p-6 rounded-2xl border border-neutral-700/50 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{playlist.name}</h1>
          <p className="text-sm text-neutral-400 mt-2">
            Tổng thời lượng: {totalMins} phút {totalSecs} giây ({playlistSongs.length} bài)
          </p>
        </div>

        {playlistSongs.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="flex items-center gap-2 bg-spotify-green text-black font-semibold px-6 py-2.5 rounded-full hover:scale-105 transition shadow-lg"
          >
            <Play size={18} fill="currentColor" /> Phát tất cả
          </button>
        )}
      </div>

      <div className="bg-neutral-900/80 rounded-xl border border-neutral-800 divide-y divide-neutral-800">
        {playlistSongs.length === 0 ? (
          <div className="p-10 text-center text-neutral-500 text-sm">
            Playlist này chưa có bài hát nào. Hãy thêm từ Thư viện!
          </div>
        ) : (
          playlistSongs.map((song, index) => (
            <div
              key={song.id}
              className="flex items-center justify-between px-6 py-3.5 hover:bg-neutral-800/60 transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="text-neutral-500 font-mono w-6 text-sm">{index + 1}</span>
                <div>
                  <p className="font-semibold text-white truncate">{song.title}</p>
                  <p className="text-xs text-neutral-400 truncate">{song.artist}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-neutral-400 font-mono">
                <span>{formatDuration(song.duration)}</span>
                <button
                  onClick={() => handleRemoveSong(song.id)}
                  className="px-2.5 py-1 text-xs bg-neutral-800 hover:bg-red-900/40 hover:text-red-400 rounded border border-neutral-700 transition"
                >
                  Bỏ
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;