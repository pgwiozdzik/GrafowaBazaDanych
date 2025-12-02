import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // To jest kluczowa naprawa: wymuszamy wskazanie na główny plik index.js,
            // który zawiera zarówno Core jak i React Hooks (useQuery).
            '@apollo/client': path.resolve(process.cwd(), 'node_modules', '@apollo/client', 'index.js')
        }
    }
})