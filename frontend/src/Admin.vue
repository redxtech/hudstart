<template>
	<div class="container">
		<a-typography-title>
			hudstart admin page
		</a-typography-title>
		<main>
			<div class="tournament">
				<a-form
					name="tournament"
    			:wrapper-col="{ span: 8 }"
				>
					<a-typography-title :level="4">
						tournament url
					</a-typography-title>
					<a-form-item>
						<a-input-group compact>
							<a-input
								v-model:value="tournament"
								placeholder="https://start.gg/tournament/..."
								style="width: calc(100% - 200px)"
							/>
							<a-button type="primary" @click="updateTournamentURL">set</a-button>
						</a-input-group>
					</a-form-item>
					<a-typography-title :level="4">
						api token
					</a-typography-title>
					<a-form-item>
						<a-input-group compact>
							<a-input
								v-model:value="token"
								style="width: calc(100% - 200px)"
							/>
							<a-button type="primary" @click="updateToken">set</a-button>
						</a-input-group>
					</a-form-item>
					<a-typography-title :level="4">
						select set
					</a-typography-title>
					<a-form-item>
						<a-input-group compact>
							<a-select
								v-model:value="set"
								show-search
								placeholder="Select a person"
								style="width: 200px"
								:options="setSelectOptions"
								:filter-option="filterOption"
							></a-select>
							<a-button type="primary" @click="updateToken">set</a-button>
						</a-input-group>
					</a-form-item>
				</a-form>
				<label for="set">set </label>
				<input id="set" type="text" v-model="setID" />
				<button @click="updateSet">update</button>
			</div>
		</main>
	</div>
</template>

<script>
export default {
	name: 'Admin',
	data () {
		return {
			setID: '',
			conn: undefined,
			tournament: '',
			token: '',
			set: {},
			setSelectOptions: [
				{ label: 'p1 vs. p2', value: 'set1' },
				{ label: 'p3 vs. p4', value: 'set2' }
			]
		}
	},
	methods: {
		updateSet() {
			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'SETID',
					value: this.setID
				}))
			}
		},
		updateTournamentURL() {
			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'TOURNAMENT_URL',
					value: this.tournament
				}))
			}
		},
		updateToken() {
			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'TOKEN',
					value: this.token
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

<style scoped>
	.container {
		margin: auto 4rem;
	}

	h1 {
		margin: 2rem auto;
	}
</style>
