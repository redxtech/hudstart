import { createApp } from 'vue'

import VueSelect from 'vue-select'

import { apolloProvider } from './main.js'
import Admin from './Admin.vue'

import 'ant-design-vue/dist/antd.css'
import 'vue-select/dist/vue-select.css'

createApp(Admin)
	.use(apolloProvider)
	.component('v-select', VueSelect)
	.mount('#app')
