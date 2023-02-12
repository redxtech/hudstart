import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      }
    }
  },
  plugins: [vue()],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src')
		}
	}
})
