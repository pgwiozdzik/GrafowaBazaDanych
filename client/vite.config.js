import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // Wymuszamy użycie głównego pliku CJS, który zawiera useQuery.
            // Używamy process.cwd(), aby poprawnie znaleźć ścieżkę na serwerze Railway.
            '@apollo/client': path.resolve(process.cwd(), 'node_modules', '@apollo/client', 'main.cjs')
        }
    }
})