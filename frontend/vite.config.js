import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	define: {
		__VUE_PROD_DEVTOOLS__: true // enable devtools in production build
	},
	build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      }
    }
  },
  plugins: [
		vue(),
		Components({
      resolvers: [AntDesignVueResolver({ importStyle: false })],
    })
	],
	resolve: {
		alias: {
			'@': resolve(__dirname, './src')
		}
	}
})
