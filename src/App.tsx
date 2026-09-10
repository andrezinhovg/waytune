import { useEffect, useState } from 'react';
import Setup from './components/Setup';
import MainScreen from './components/MainScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { usePlayerStore } from './stores/player-store';
import { getPlaylists, getChannels, getActiveProfileId } from './lib/tauri';
import { logger } from './lib/logger';
import { useTheme } from './hooks/useTheme';

export default function App() {
  useTheme();
  // Per-field selectors, not a bare usePlayerStore(): the bare form subscribes
  // App (and the whole MainScreen tree under it) to every store mutation,
  // re-rendering on each of the ~100 setChannelEpg writes per EPG refresh.
  const isSetupComplete = usePlayerStore((s) => s.isSetupComplete);
  const setIsSetupComplete = usePlayerStore((s) => s.setIsSetupComplete);
  const setPlaylists = usePlayerStore((s) => s.setPlaylists);
  const setChannels = usePlayerStore((s) => s.setChannels);
  const setCurrentPlaylist = usePlayerStore((s) => s.setCurrentPlaylist);
  const setActiveProfileId = usePlayerStore((s) => s.setActiveProfileId);
  const [isCheckingSetup, setIsCheckingSetup] = useState(true);

  useEffect(() => {
    // Check if user has any playlists on app start
    async function checkSetup() {
      try {
        const playlists = await getPlaylists();

        if (playlists.length > 0) {
          setPlaylists(playlists);

          // Load active profile instead of first playlist
          const activeId = await getActiveProfileId();
          const activePlaylist = activeId
            ? playlists.find((p) => p.id === activeId) || playlists[0]
            : playlists[0];

          setActiveProfileId(activePlaylist.id!);
          setCurrentPlaylist(activePlaylist);

          const channels = await getChannels(activePlaylist.id);
          setChannels(channels);
          setIsSetupComplete(true);
        }
      } catch (err) {
        logger.error('Failed to check setup:', err);
      } finally {
        setIsCheckingSetup(false);
      }
    }

    checkSetup();
  }, [setIsSetupComplete, setPlaylists, setChannels, setCurrentPlaylist, setActiveProfileId]);

  if (isCheckingSetup) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
          <p className="text-fluid-lg font-medium text-text-muted">Loading playlist...</p>
        </div>
      </div>
    );
  }

  return <ErrorBoundary>{isSetupComplete ? <MainScreen /> : <Setup />}</ErrorBoundary>;
}
