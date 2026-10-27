import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PlayerBar } from './PlayerBar';

describe('PlayerBar', () => {
  it('hien thi thong bao Chua phat bai nao khi hang doi trong', () => {
    render(<PlayerBar />);
    expect(screen.getByText('Chưa phát bài nào')).toBeInTheDocument();
  });
});