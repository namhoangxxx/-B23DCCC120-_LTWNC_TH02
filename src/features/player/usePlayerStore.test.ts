import { beforeEach, describe, expect, it } from 'vitest';
import type { Song } from '../../types';
import { usePlayerStore } from './usePlayerStore';

const sampleSongs: Song[] = [
  { id: 's1', title: 'Mưa tháng Sáu 1', artist: 'Lê Minh', genre: 'Pop', duration: 150 },
  { id: 's2', title: 'Nắng tháng Sáu 1', artist: 'Quang Huy', genre: 'Indie', duration: 187 },
];

describe('usePlayerStore', () => {
  // Đặt lại store về mặc định trước mỗi test case theo đúng yêu cầu đề bài
  beforeEach(() => {
    usePlayerStore.setState({
      queue: [],
      currentIndex: -1,
      isPlaying: false,
      position: 0,
      isShuffle: false,
      repeatMode: 'off',
    });
  });

  it('playQueue đặt đúng hàng đợi và bắt đầu phát từ bài chỉ định', () => {
    usePlayerStore.getState().playQueue(sampleSongs, 0);
    const state = usePlayerStore.getState();
    expect(state.queue).toEqual(sampleSongs);
    expect(state.currentIndex).toBe(0);
    expect(state.isPlaying).toBe(true);
    expect(state.position).toBe(0);
  });

  it('tick ở giây cuối tự sang bài sau', () => {
    usePlayerStore.setState({
      queue: sampleSongs,
      currentIndex: 0,
      isPlaying: true,
      position: 149, // Giây cuối cùng của bài s1 (duration: 150)
    });

    usePlayerStore.getState().tick();
    const state = usePlayerStore.getState();

    expect(state.currentIndex).toBe(1); // Đã chuyển sang bài thứ 2
    expect(state.position).toBe(0); // Thời gian đặt lại 0
  });

  it('next ở bài cuối thì dừng phát (isPlaying là false)', () => {
    usePlayerStore.setState({
      queue: sampleSongs,
      currentIndex: 1, // Bài cuối cùng trong danh sách
      isPlaying: true,
      position: 100,
    });

    usePlayerStore.getState().next();
    const state = usePlayerStore.getState();

    expect(state.isPlaying).toBe(false); // Đã dừng phát
  });

  it('toggleRepeat chuyển đổi đúng thứ tự off -> all -> one -> off', () => {
    expect(usePlayerStore.getState().repeatMode).toBe('off');
    
    usePlayerStore.getState().toggleRepeat();
    expect(usePlayerStore.getState().repeatMode).toBe('all');

    usePlayerStore.getState().toggleRepeat();
    expect(usePlayerStore.getState().repeatMode).toBe('one');

    usePlayerStore.getState().toggleRepeat();
    expect(usePlayerStore.getState().repeatMode).toBe('off');
  });
});