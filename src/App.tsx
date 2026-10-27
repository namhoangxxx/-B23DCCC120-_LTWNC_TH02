import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { PlaylistProvider } from './contexts/PlaylistContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LibraryPage from './features/library/LibraryPage';
import { PlayerBar } from './features/player/PlayerBar';

const FavoritesPage = lazy(() => import('./features/favorites/FavoritesPage'));
const PlaylistsPage = lazy(() => import('./features/playlists/PlaylistsPage'));
const PlaylistDetailPage = lazy(() => import('./features/playlists/PlaylistDetailPage'));

export function App() {
  return (
    <ThemeProvider>
      <PlaylistProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<p className="p-6 text-center text-neutral-400">Đang tải trang...</p>}>
                <Routes>
                  <Route path="/" element={<LibraryPage />} />
                  <Route path="/favorites" element={<FavoritesPage />} />
                  <Route path="/playlists" element={<PlaylistsPage />} />
                  <Route path="/playlists/:id" element={<PlaylistDetailPage />} />
                </Routes>
              </Suspense>
            </main>
            <PlayerBar />
          </div>
        </BrowserRouter>
      </PlaylistProvider>
    </ThemeProvider>
  );
}

export default App;