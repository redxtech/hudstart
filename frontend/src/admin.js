import { createApp } from 'vue'

import { apolloProvider } from './main.js'
import Admin from './Admin.vue'

import 'ant-design-vue/dist/antd.css'

createApp(Admin)
	.use(apolloProvider)
	.mount('#app')
