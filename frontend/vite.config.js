import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // <-- frontend runs on port 3000
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // <-- backend runs on port 8000
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
