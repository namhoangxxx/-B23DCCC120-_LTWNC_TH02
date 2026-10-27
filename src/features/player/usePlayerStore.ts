import { create } from 'zustand';
import type { Song } from '../../types';
import { devtools } from 'zustand/middleware';

export type RepeatMode = 'off' | 'all' | 'one';

export interface PlayerState {
  queue: Song[];
  currentIndex: number;
  isPlaying: boolean;
  position: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  playQueue: (songs: Song[], startIndex: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  addToQueue: (song: Song) => void;
  tick: () => void;
  seek: (position: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
}

export const usePlayerStore = create<PlayerState>()(devtools((set, get) => ({
  queue: [],
  currentIndex: -1,
  isPlaying: false,
  position: 0,
  isShuffle: false,
  repeatMode: 'off',

  playQueue: (songs, startIndex) => {
    if (songs.length === 0 || startIndex < 0 || startIndex >= songs.length) return;
    set({
      queue: songs,
      currentIndex: startIndex,
      isPlaying: true,
      position: 0,
    });
  },

  togglePlay: () => {
    const { currentIndex } = get();
    if (currentIndex === -1) return;
    set((state) => ({ isPlaying: !state.isPlaying }));
  },

  toggleShuffle: () => {
    set((state) => ({ isShuffle: !state.isShuffle }));
  },

  toggleRepeat: () => {
    set((state) => {
      const nextMode: Record<RepeatMode, RepeatMode> = {
        off: 'all',
        all: 'one',
        one: 'off',
      };
      return { repeatMode: nextMode[state.repeatMode] };
    });
  },

  next: () => {
    const { queue, currentIndex, isShuffle, repeatMode } = get();
    if (queue.length === 0) return;
    // Chế độ Repeat One (Lặp lại 1 bài)
    if (repeatMode === 'one') {
      set({ position: 0, isPlaying: true });
      return;
    }

    // Chế độ Shuffle (Ngẫu nhiên)
    if (isShuffle) {
      let nextIndex = Math.floor(Math.random() * queue.length);
      if (queue.length > 1 && nextIndex === currentIndex) {
        nextIndex = (currentIndex + 1) % queue.length;
      }
      set({ currentIndex: nextIndex, position: 0, isPlaying: true });
      return;
    }

    // Chế độ phát thông thường hoặc Repeat All
    if (currentIndex < queue.length - 1) {
      set({ currentIndex: currentIndex + 1, position: 0, isPlaying: true });
    } else if (repeatMode === 'all') {
      set({ currentIndex: 0, position: 0, isPlaying: true });
    } else {
      set({ isPlaying: false });
    }
  },

  prev: () => {
    const { queue, currentIndex, position, repeatMode } = get();
    if (position > 3) {
      set({ position: 0 });
    } else if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, position: 0, isPlaying: true });
    } else if (repeatMode === 'all') {
      set({ currentIndex: queue.length - 1, position: 0, isPlaying: true });
    } else {
      set({ position: 0 });
    }
  },

  addToQueue: (song) => {
    const { queue } = get();
    if (queue.some((s) => s.id === song.id)) return;
    set({ queue: [...queue, song] });
  },

  tick: () => {
    const { queue, currentIndex, position, isPlaying } = get();
    if (!isPlaying || currentIndex === -1) return;

    const currentSong = queue[currentIndex];
    if (!currentSong) return;

    if (position + 1 >= currentSong.duration) {
      get().next();
    } else {
      set({ position: position + 1 });
    }
  },

  seek: (newPosition) => {
    const { queue, currentIndex } = get();
    if (currentIndex === -1 || !queue[currentIndex]) return;
    const maxDuration = queue[currentIndex].duration;
    const clampedPosition = Math.max(0, Math.min(newPosition, maxDuration));
    set({ position: clampedPosition });
  },
}), { name: 'PlayerStore' }));