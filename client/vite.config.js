import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    resolve: {
        // To jest klucz do sukcesu: wymusza użycie wersji biblioteki,
        // która zawiera useQuery (wersja 'module' czyli ESM)
        mainFields: ['module', 'main'],
    },
    build: {
        commonjsOptions: {
            transformMixedEsModules: true,
        },
    },
})