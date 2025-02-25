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
      entry: path.resolve(__dirname, 'src/index.ts'), // Точка входа
      name: 'ReactDatePicker', // Имя библиотеки
      fileName: (format) => `react-datepicker.${format}.js`, // Имя выходного файла
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // Внешние зависимости
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
