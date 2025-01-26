import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const defaultPORT = 7172;
export default defineConfig({
  plugins: [react()],
  server: {
    host: [`192.168.100.209:${defaultPORT}`, 'http://localhost'],
    port: defaultPORT,
  },
});