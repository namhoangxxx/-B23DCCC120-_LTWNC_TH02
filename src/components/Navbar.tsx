import { Heart, Library, ListMusic, Moon, Music2, Sun } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
      isActive
        ? 'bg-spotify-green text-black shadow-md'
        : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
    }`;

  return (
    <header className="bg-black/90 border-b border-neutral-800 px-6 py-4 sticky top-0 z-40 backdrop-blur-md flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Music2 className="text-spotify-green" size={28} />
        <span className="font-bold text-lg text-white tracking-wide">Mini Music</span>
      </div>

      <nav className="flex items-center gap-2">
        <NavLink to="/" end className={linkClass}>
          <Library size={18} /> Thư viện
        </NavLink>
        <NavLink to="/favorites" className={linkClass}>
          <Heart size={18} /> Yêu thích
        </NavLink>
        <NavLink to="/playlists" className={linkClass}>
          <ListMusic size={18} /> Playlist
        </NavLink>
      </nav>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 transition border border-neutral-700 text-xs flex items-center gap-1.5"
      >
        {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        <span>{theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}</span>
      </button>
    </header>
  );
};