import { describe, expect, it } from 'vitest';
import { generateSongs } from './songs';

describe('generateSongs', () => {
  it('generateSongs(10000) có 10000 phần tử, id không trùng, duration từ 150-300', () => {
    const songs = generateSongs(10000);
    expect(songs.length).toBe(10000);

    const ids = new Set(songs.map((s) => s.id));
    expect(ids.size).toBe(10000);

    songs.forEach((song) => {
      expect(song.duration).toBeGreaterThanOrEqual(150);
      expect(song.duration).toBeLessThanOrEqual(300);
    });
  });
});