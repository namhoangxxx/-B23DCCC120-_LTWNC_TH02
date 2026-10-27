import { describe, expect, it } from 'vitest';
import { playlistReducer, type Playlist } from './playlistReducer';

describe('playlistReducer', () => {
  it('tạo playlist mới', () => {
    const state: Playlist[] = [];
    const next = playlistReducer(state, { type: 'CREATE', payload: { name: 'Chill' } });
    expect(next.length).toBe(1);
    expect(next[0].name).toBe('Chill');
  });

  it('addSong không thêm trùng bài hát', () => {
    const state: Playlist[] = [{ id: 'pl-1', name: 'Chill', songIds: ['s1'] }];
    const next = playlistReducer(state, {
      type: 'ADD_SONG',
      payload: { playlistId: 'pl-1', songId: 's1' },
    });
    expect(next[0].songIds).toEqual(['s1']);
  });

  it('removeSong xóa bài hát khỏi playlist', () => {
    const state: Playlist[] = [{ id: 'pl-1', name: 'Chill', songIds: ['s1', 's2'] }];
    const next = playlistReducer(state, {
      type: 'REMOVE_SONG',
      payload: { playlistId: 'pl-1', songId: 's1' },
    });
    expect(next[0].songIds).toEqual(['s2']);
  });

  it('xóa playlist không tồn tại thì state giữ nguyên (toEqual)', () => {
    const state: Playlist[] = [{ id: 'pl-1', name: 'Chill', songIds: ['s1'] }];
    const next = playlistReducer(state, { type: 'REMOVE', payload: { id: 'pl-99' } });
    expect(next).toEqual(state);
  });
});