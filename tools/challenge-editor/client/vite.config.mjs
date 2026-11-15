import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
  return {
    plugins: [react()],
    resolve: { dedupe: ['react', 'react-dom'] },
    // Preserve the existing editor API setting without exposing other variables.
    define: {
      global: 'globalThis',
      'process.env.REACT_APP_CHALLENGE_EDITOR_API_LOCATION': JSON.stringify(
        env.REACT_APP_CHALLENGE_EDITOR_API_LOCATION || 'http://localhost:3200'
      )
    },
    build: { outDir: 'build' }
  };
});
