import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import path from 'path';
export default defineConfig({
    plugins: [
        react(),
        dts({ insertTypesEntry: true }), // Генерация .d.ts файлов
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/index.ts'),
            name: 'ReactDatePicker',
            fileName: function (format) { return "react-datepicker.".concat(format, ".js"); }, // Имя выходного файла
        },
        rollupOptions: {
            external: ['react', 'react-dom'],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                },
            },
        },
    },
});
