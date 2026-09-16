import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // <-- gunakan './' agar semua file CSS & JS dapat dimuat di subfolder GitHub Pages
});
