
export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

export type PlaylistAction =
  | { type: 'CREATE'; payload: { name: string } }
  | { type: 'RENAME'; payload: { id: string; name: string } }
  | { type: 'REMOVE'; payload: { id: string } }
  | { type: 'ADD_SONG'; payload: { playlistId: string; songId: string } }
  | { type: 'REMOVE_SONG'; payload: { playlistId: string; songId: string } };

export const initialPlaylistsState: Playlist[] = [];

export function playlistReducer(state: Playlist[], action: PlaylistAction): Playlist[] {
  switch (action.type) {
    case 'CREATE':
      return [
        ...state,
        { id: `pl-${Date.now()}`, name: action.payload.name, songIds: [] },
      ];

    case 'RENAME':
      return state.map((pl) =>
        pl.id === action.payload.id ? { ...pl, name: action.payload.name } : pl
      );

    case 'REMOVE':
      return state.filter((pl) => pl.id !== action.payload.id);

    case 'ADD_SONG':
      return state.map((pl) => {
        if (pl.id !== action.payload.playlistId) return pl;
        if (pl.songIds.includes(action.payload.songId)) return pl;
        return { ...pl, songIds: [...pl.songIds, action.payload.songId] };
      });

    case 'REMOVE_SONG':
      return state.map((pl) => {
        if (pl.id !== action.payload.playlistId) return pl;
        return {
          ...pl,
          songIds: pl.songIds.filter((id) => id !== action.payload.songId),
        };
      });

    default:
      return state;
  }
}