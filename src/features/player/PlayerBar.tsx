import {
    Music,
    Pause,
    Play,
    Repeat,
    Repeat1,
    Shuffle,
    SkipBack,
    SkipForward,
} from 'lucide-react';
import React, { useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import { usePlayerStore } from './usePlayerStore';

export const PlayerBar: React.FC = () => {
  // 1. Lấy state & action từ Zustand store
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const isShuffle = usePlayerStore((s) => s.isShuffle);
  const repeatMode = usePlayerStore((s) => s.repeatMode);

  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const prev = usePlayerStore((s) => s.prev);
  const tick = usePlayerStore((s) => s.tick);
  const toggleShuffle = usePlayerStore((s) => s.toggleShuffle);
  const toggleRepeat = usePlayerStore((s) => s.toggleRepeat);

  // 2. Đồng hồ đếm giây (chỉ chạy khi isPlaying = true)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      tick();
    }, 1000);
    return () => clearInterval(interval);
  }, [isPlaying, tick]);

  // 3. Phím tắt Space điều khiển Phát/Tạm dừng (Bỏ qua khi gõ trong ô nhập)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInputting =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'SELECT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.getAttribute('contenteditable') === 'true';

      if (e.code === 'Space' && !isInputting) {
        e.preventDefault(); // Ngăn cuộn trang web
        togglePlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  const currentSong = currentIndex >= 0 ? queue[currentIndex] : null;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-neutral-800 px-6 py-3 flex items-center justify-between z-50 backdrop-blur-md">
      {/* Thông tin bài hát đang phát */}
      <div className="flex items-center gap-3 w-1/4">
        <div className="w-12 h-12 bg-neutral-800 rounded flex items-center justify-center text-spotify-green border border-neutral-700">
          <Music size={24} />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-white truncate">
            {currentSong ? currentSong.title : 'Chưa phát bài nào'}
          </p>
          <p className="text-xs text-neutral-400 truncate">
            {currentSong ? currentSong.artist : 'Chọn một bài hát từ thư viện'}
          </p>
        </div>
      </div>

      {/* Điều khiển nhạc & Thanh tiến trình */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xl">
        <div className="flex items-center gap-4">
          {/* Nút Shuffle */}
          <button
            onClick={toggleShuffle}
            aria-label="Phát ngẫu nhiên"
            className={`p-1.5 transition ${
              isShuffle ? 'text-spotify-green font-bold' : 'text-neutral-400 hover:text-white'
            }`}
            title={isShuffle ? 'Tắt ngẫu nhiên' : 'Bật ngẫu nhiên'}
          >
            <Shuffle size={18} />
          </button>

          {/* Nút Trước */}
          <button
            onClick={prev}
            className="text-neutral-400 hover:text-white transition"
            aria-label="Trước"
          >
            <SkipBack size={20} />
          </button>

          {/* Nút Phát / Tạm dừng (Cực kỳ rõ nét) */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Tạm dừng' : 'Phát'}
            className="w-10 h-10 bg-[#1DB954] hover:bg-[#1ed760] rounded-full flex items-center justify-center text-black font-bold hover:scale-105 transition shadow-lg shrink-0 cursor-pointer"
            title={isPlaying ? 'Tạm dừng (Space)' : 'Phát (Space)'}
          >
            {isPlaying ? (
              <Pause size={20} fill="#000000" color="#000000" />
            ) : (
              <Play size={20} fill="#000000" color="#000000" className="ml-0.5" />
            )}
          </button>

          {/* Nút Sau */}
          <button
            onClick={next}
            className="text-neutral-400 hover:text-white transition"
            aria-label="Sau"
          >
            <SkipForward size={20} />
          </button>

          {/* Nút Repeat */}
          <button
            onClick={toggleRepeat}
            aria-label="Lặp lại"
            className={`p-1.5 transition ${
              repeatMode !== 'off' ? 'text-spotify-green font-bold' : 'text-neutral-400 hover:text-white'
            }`}
            title={`Chế độ lặp: ${repeatMode}`}
          >
            {repeatMode === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
          </button>
        </div>

        {/* Thanh tiến trình & tua thời gian */}
        <ProgressBar />
      </div>

      {/* Số bài hát trong hàng đợi */}
      <div className="w-1/4 flex justify-end">
        <span className="text-xs text-neutral-400 font-mono bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700">
          Hàng đợi: {queue.length} bài
        </span>
      </div>
    </footer>
  );
};