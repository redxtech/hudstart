import { createApp } from 'vue'

import { apolloProvider } from './main.js'
import Admin from './Admin.vue'

createApp(Admin)
	.use(apolloProvider)
	.mount('#app')
