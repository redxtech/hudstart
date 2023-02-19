import { createApp } from 'vue'

// pull in shared apollo provider from main
import { apolloProvider } from './main.js'
import Overlay from './Overlay.vue'

import '@/style.css'

createApp(Overlay)
	.use(apolloProvider)
	.mount('#app')

