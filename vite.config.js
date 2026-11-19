import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // 1. PIN Security: Desktop fallback '0000', or production PIN
  const pin = env.PIN || env.VITE_PIN || process.env.PIN || process.env.VITE_PIN || '0000';

  // 2. Built-in Single-User Cloud Sync (Upstash Redis)
  const upstashUrl =
    env.UPSTASH_REDIS_REST_URL ||
    env.KV_REST_API_URL ||
    env.VITE_UPSTASH_REDIS_REST_URL ||
    process.env.UPSTASH_REDIS_REST_URL ||
    process.env.KV_REST_API_URL ||
    process.env.VITE_UPSTASH_REDIS_REST_URL ||
    'https://precious-catfish-207117.upstash.io';

  const upstashToken =
    env.UPSTASH_REDIS_REST_TOKEN ||
    env.KV_REST_API_TOKEN ||
    env.VITE_UPSTASH_REDIS_REST_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN ||
    process.env.KV_REST_API_TOKEN ||
    process.env.VITE_UPSTASH_REDIS_REST_TOKEN ||
    '';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_PIN': JSON.stringify(pin),
      'import.meta.env.VITE_UPSTASH_REDIS_REST_URL': JSON.stringify(upstashUrl),
      'import.meta.env.VITE_UPSTASH_REDIS_REST_TOKEN': JSON.stringify(upstashToken),
    },
  };
});
