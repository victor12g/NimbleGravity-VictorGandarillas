import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDebugApiEnabled = String(env.DEBUG_API || 'false').toLowerCase() === 'true';

  return {
    plugins: [react()],
    define: {
      __API_BASE_URL__: JSON.stringify(env.BASE_URL || ''),
      __DEBUG_API__: JSON.stringify(isDebugApiEnabled),
    },
  };
});
