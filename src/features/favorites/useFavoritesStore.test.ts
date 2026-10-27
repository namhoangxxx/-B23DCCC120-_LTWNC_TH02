import { beforeEach, describe, expect, it } from 'vitest';
import { useFavoritesStore } from './useFavoritesStore';

describe('useFavoritesStore', () => {
  beforeEach(() => {
    // Đặt lại state về mảng rỗng trước mỗi test
    useFavoritesStore.setState({ favorites: [] });
  });

  it('thêm và xóa bài hát khỏi danh sách yêu thích', () => {
    const store = useFavoritesStore.getState();
    // Tự động gọi toggleFavorite hoặc toggle tùy theo tên action trong store của bạn
    const toggleFn = store.toggleFavorite || store.toggle;

    // Lần 1: Thêm vào favorites
    toggleFn('song-1');
    expect(useFavoritesStore.getState().favorites).toContain('song-1');

    // Lần 2: Xóa khỏi favorites
    toggleFn('song-1');
    expect(useFavoritesStore.getState().favorites).not.toContain('song-1');
  });
});