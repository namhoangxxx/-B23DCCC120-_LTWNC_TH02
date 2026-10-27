import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { playlistReducer, type Playlist, type PlaylistAction } from '../features/playlists/playlistReducer';
import { withLogger } from '../features/playlists/withLogger';

const PlaylistStateContext = createContext<Playlist[] | undefined>(undefined);
const PlaylistDispatchContext = createContext<React.Dispatch<PlaylistAction> | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'music-playlists';

export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playlists, dispatch] = useReducer(
    withLogger(playlistReducer),
    [],
    () => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    }
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(playlists));
  }, [playlists]);

  return (
    <PlaylistStateContext.Provider value={playlists}>
      <PlaylistDispatchContext.Provider value={dispatch}>
        {children}
      </PlaylistDispatchContext.Provider>
    </PlaylistStateContext.Provider>
  );
};

export function usePlaylists() {
  const context = useContext(PlaylistStateContext);
  if (context === undefined) {
    throw new Error('usePlaylists phải được sử dụng bên trong PlaylistProvider');
  }
  return context;
}

export function usePlaylistDispatch() {
  const context = useContext(PlaylistDispatchContext);
  if (context === undefined) {
    throw new Error('usePlaylistDispatch phải được sử dụng bên trong PlaylistProvider');
  }
  return context;
}