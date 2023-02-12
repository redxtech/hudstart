<template>
	<h1>admin page</h1>
	<label for="set">set </label>
	<input id="set" type="text" v-model="setID" />
	<button @click="updateSet">update</button>
</template>

<script>
export default {
	name: 'Admin',
	data () {
		return {
			setID: '',
			conn: undefined
		}
	},
	methods: {
		updateSet() {
			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					setID: this.setID
				}))
			}
		}
	},
	mounted () {
		this.conn = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)
		this.conn.onmessage = event => {
			const data = JSON.parse(event.data)
			if (data.target === 'ADMIN') {
				console.log(data)
			}
		}
	}
}
</script>
