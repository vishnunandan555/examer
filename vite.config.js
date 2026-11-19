import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Allows user to set either PIN or VITE_PIN in github env / codespace / vercel / .env
  // Defaults to '0000' for local desktop development
  const pin = env.PIN || env.VITE_PIN || process.env.PIN || process.env.VITE_PIN || '0000';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_PIN': JSON.stringify(pin),
    },
  };
});
