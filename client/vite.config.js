import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        commonjsOptions: {
            // To jest kluczowe dla Apollo Clienta w Vite.
            // Pozwala Vite zrozumieć "mieszane" moduły biblioteki.
            transformMixedEsModules: true,
        },
    },
    // Opcjonalnie: wymuszamy, żeby Vite nie próbował sam analizować głęboko
    optimizeDeps: {
        include: ['@apollo/client'],
    },
})