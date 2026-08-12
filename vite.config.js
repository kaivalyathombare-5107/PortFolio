import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Note: the /api serverless functions are not served by `vite dev` on
// their own. For local testing that includes the API (login, saving
// data, uploads), run `vercel dev` instead — it serves the Vite frontend
// and the /api functions together on one port.
export default defineConfig({
  plugins: [react()],
});
