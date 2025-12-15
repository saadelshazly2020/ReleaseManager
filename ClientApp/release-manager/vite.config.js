import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
//import tailwindcss from '@tailwindcss/postcss'; // Import the new package

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        hmr: {
            overlay: false  // Disable the error overlay
        }
    },
    esbuild: {
        loader: 'jsx',
        include: /src\/.*\.jsx?$/,
        exclude: [],
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
    resolve: {
       alias: [
            {
                find: '@/lib',
                replacement: fileURLToPath(new URL('./src/lib', import.meta.url))
            },
            {
                find: '@/components',
                replacement: fileURLToPath(new URL('./src/components', import.meta.url))
            },
            {
                find: '@',
                replacement: fileURLToPath(new URL('./src', import.meta.url))
            }
        ]
    },
    //css: {
    //    postcss: {
    //        plugins: [
    //            tailwindcss, // Use the new package
    //            //autoprefixer,
    //        ],
    //    },
    //},
})
