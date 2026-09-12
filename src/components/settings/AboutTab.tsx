import { useState, useEffect } from 'react';
import { getVersion } from '@tauri-apps/api/app';
import { appLogDir } from '@tauri-apps/api/path';
import { openPath } from '@tauri-apps/plugin-opener';
import { FolderOpen } from 'lucide-react';
import { logger } from '../../lib/logger';
import logoImage from '../../assets/logo/logo-256.webp';

export default function AboutTab() {
  const [version, setVersion] = useState('');

  useEffect(() => {
    getVersion()
      .then(setVersion)
      .catch((err) => {
        logger.warn('Failed to get app version:', err);
      });
  }, []);

  const handleOpenLogs = async () => {
    try {
      const dir = await appLogDir();
      await openPath(dir);
    } catch (err) {
      logger.error('Failed to open logs folder:', err);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {/* App identity */}
      <div className="flex items-center gap-4">
        <img src={logoImage} alt="Waytune" className="h-12 w-12 rounded-xl" />
        <div>
          <h3 className="text-fluid-lg font-semibold text-text">Waytune</h3>
          <div className="mt-0.5 flex items-center gap-2">
            {version && (
              <>
                <span className="text-fluid-sm text-text-muted">v{version}</span>
                <span className="text-fluid-xs text-text-muted">·</span>
              </>
            )}
            <span className="text-fluid-xs text-text-muted">GPL-2.0</span>
          </div>
        </div>
      </div>

      {/* Open logs folder */}
      <div className="border-t border-border pt-4">
        <button
          onClick={handleOpenLogs}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-fluid-sm text-text-muted transition-colors hover:bg-surface-hover"
        >
          <FolderOpen className="h-4 w-4" />
          Open logs folder
        </button>
      </div>
    </div>
  );
}
