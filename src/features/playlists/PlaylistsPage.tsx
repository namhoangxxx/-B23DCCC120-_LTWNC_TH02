import { FolderPlus, ListMusic, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylistDispatch, usePlaylists } from '../../contexts/PlaylistContext';

export const PlaylistsPage: React.FC = () => {
  const playlists = usePlaylists();
  const dispatch = usePlaylistDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();

    if (!trimmed) {
      setError('Tên playlist không được để trống');
      return;
    }

    const exists = playlists.some(
      (pl) => pl.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      setError('Tên playlist đã tồn tại');
      return;
    }

    dispatch({ type: 'CREATE', payload: { name: trimmed } });
    setName('');
    setError('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 pb-32">
      <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-700/50">
        <h1 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <FolderPlus className="text-spotify-green" /> Tạo Playlist Mới
        </h1>
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Nhập tên playlist..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (error) setError('');
            }}
            className="flex-1 bg-neutral-900 border border-neutral-700 px-4 py-2.5 rounded-lg text-white text-sm focus:outline-none focus:border-spotify-green"
          />
          <button
            type="submit"
            className="bg-spotify-green text-black font-semibold px-6 py-2.5 rounded-lg hover:scale-105 transition text-sm"
          >
            Tạo
          </button>
        </form>
        {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((pl) => (
          <div
            key={pl.id}
            className="bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 p-5 rounded-xl flex flex-col justify-between transition group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-neutral-800 rounded-lg text-spotify-green">
                  <ListMusic size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-spotify-green transition">
                    {pl.name}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {pl.songIds.length} bài hát
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE', payload: { id: pl.id } })}
                className="text-neutral-500 hover:text-red-500 transition p-1"
                aria-label="Xóa playlist"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <Link
              to={`/playlists/${pl.id}`}
              className="mt-4 inline-block text-center w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-white font-medium rounded-lg transition"
            >
              Xem Chi Tiết
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsPage;