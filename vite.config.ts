import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
    build: {
        // ✅ SEGURANÇA: Desabilitar source maps em produção
        sourcemap: false,

        // ✅ Minificação agressiva
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
            mangle: true,
        },

        // ✅ Configurações adicionais de segurança
        reportCompressedSize: false,

        rollupOptions: {
            output: {
                // ✅ Code splitting - separar vendor code
                manualChunks: {
                    'react-vendor': ['react', 'react-dom'],
                    'router': ['react-router-dom'],
                    'antd': ['antd'],
                },
                // ✅ Nomes de arquivos com hash para cache busting
                chunkFileNames: 'js/[name]-[hash].js',
                entryFileNames: 'js/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',
            },
        },
    },
})