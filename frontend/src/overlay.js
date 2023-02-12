import { createApp } from 'vue'

import { apolloProvider } from './main.js'
import Overlay from './Overlay.vue'
import '@/style.css'

createApp(Overlay)
	.use(apolloProvider)
	.mount('#app')

