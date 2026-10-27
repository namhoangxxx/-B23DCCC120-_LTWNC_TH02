import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { PlaylistProvider } from '../../contexts/PlaylistContext';
import { PlaylistsPage } from './PlaylistsPage';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <PlaylistProvider>
      <MemoryRouter>{ui}</MemoryRouter>
    </PlaylistProvider>
  );
};

describe('PlaylistsPage', () => {
  it('bấm Tạo khi ô trống thì thấy "Tên playlist không được để trống"', async () => {
    renderWithProviders(<PlaylistsPage />);
    const createBtn = screen.getByRole('button', { name: 'Tạo' });

    await userEvent.click(createBtn);
    expect(screen.getByText('Tên playlist không được để trống')).toBeInTheDocument();
  });

  it('nhập tên rồi bấm Tạo thì tên xuất hiện trong danh sách', async () => {
    renderWithProviders(<PlaylistsPage />);
    const input = screen.getByPlaceholderText('Nhập tên playlist...');
    const createBtn = screen.getByRole('button', { name: 'Tạo' });

    await userEvent.type(input, 'Nhạc Luyện Code');
    await userEvent.click(createBtn);

    expect(screen.getByText('Nhạc Luyện Code')).toBeInTheDocument();
  });
});