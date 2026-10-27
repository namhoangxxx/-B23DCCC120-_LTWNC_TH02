import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('đổi giá trị, trước 300ms vẫn giữ giá trị cũ, sau 300ms ra giá trị mới', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'mưa', delay: 300 } }
    );

    rerender({ value: 'mưa hạ', delay: 300 });
    expect(result.current).toBe('mưa');

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('mưa hạ');
  });
});