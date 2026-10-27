import type { Playlist, PlaylistAction } from './playlistReducer';

export function withLogger(
  reducer: (state: Playlist[], action: PlaylistAction) => Playlist[]
) {
  return (state: Playlist[], action: PlaylistAction): Playlist[] => {
    const nextState = reducer(state, action);
    if (import.meta.env.DEV) {
      console.log(`%c Action: ${action.type}`, 'color: #1DB954; font-weight: bold;');
      console.log('State trước:', state);
      console.log('State sau:', nextState);
    }
    return nextState;
  };
}