import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // To naprawia błędy z bibliotekami używającymi CommonJS (jak Apollo w niektórych wersjach)
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
})