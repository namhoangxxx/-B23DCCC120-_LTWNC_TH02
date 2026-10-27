import React from 'react';
import { formatDuration } from '../../utils/format';
import { usePlayerStore } from './usePlayerStore';

export const ProgressBar: React.FC = () => {
  const position = usePlayerStore((s) => s.position);
  const queue = usePlayerStore((s) => s.queue);
  const currentIndex = usePlayerStore((s) => s.currentIndex);
  const seek = usePlayerStore((s) => s.seek);

  const currentSong = queue[currentIndex];
  const duration = currentSong ? currentSong.duration : 0;
  const percentage = duration > 0 ? (position / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = Math.floor((clickX / width) * duration);
    seek(newTime);
  };

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <span className="text-xs font-mono text-neutral-400 w-10 text-right">
        {formatDuration(position)}
      </span>
      <div
        onClick={handleSeek}
        className="flex-1 bg-neutral-700 h-2 rounded-full overflow-hidden relative cursor-pointer group py-1"
        title="Bấm để tua bài hát"
      >
        <div
          className="bg-spotify-green group-hover:bg-spotify-accent h-full transition-all duration-100 ease-linear rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-mono text-neutral-400 w-10">
        {formatDuration(duration)}
      </span>
    </div>
  );
};