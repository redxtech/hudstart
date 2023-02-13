<template>
	<div class="container">
		<a-typography-title>
			hudstart admin page
		</a-typography-title>
		<main>
			<div class="tournament">
				<a-form
					name="tournament"
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
							<a-button type="primary" @click="updateTournamentURL">save</a-button>
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
							<a-button type="primary" @click="updateToken">save</a-button>
						</a-input-group>
					</a-form-item>
					<a-typography-title :level="4">
						select event
					</a-typography-title>
					<a-form-item>
						<a-input-group compact>
							<a-select
								v-model:value="event"
								placeholder="select an event"
								style="width: calc(100% - 200px)"
								:options="eventSelection"
							></a-select>
							<a-button type="primary" @click="updateEvent">save</a-button>
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
								placeholder="select a set"
								style="width: calc(100% - 200px)"
								:options="setSelection"
								:filter-option="filterOption"
							></a-select>
							<a-button type="primary" @click="updateSet">save</a-button>
						</a-input-group>
					</a-form-item>
				</a-form>
			</div>
		</main>
	</div>
</template>

<script>
import { EventsInTourney, SetsInEvent } from './queries.js'

export default {
	name: 'Admin',
	data () {
		return {
			conn: undefined,
			tournament: '',
			token: '',
			event: '',
			events: [],
			set: '',
			sets: [],
			filterOption: (input, option) => {
      	return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    	}
		}
	},
	apollo: {
		events: {
			query: EventsInTourney,
			variables () {
				return {
					tourney: this.tournamentSlug
				}
			},
			update: data => data?.tournament?.events
		},
		sets: {
			query: SetsInEvent,
			variables () {
				return {
					event: this.event || ''
				}
			},
			update: data => data?.event?.sets?.nodes
		}
	},
	computed: {
		tournamentSlug () {
			if (this.tournament) {
				return this.tournament.replace(/https:\/\/(www\.)?start.gg\/tournament/, 'tournament')
			} else {
				return 'tournament'
			}
		},
		eventSelection () {
			if (this.events) {
				return this.events.map(e => {
					return {
						label: e.name,
						value: e.slug
					}
				})
			} else {
				return []
			}
		},
		setSelection () {
			if (this.sets) {
				return this.sets
					.filter(set => set.slots.every(slot => slot.entrant !== null))
					.map(s => {
						return {
							label: `${s.fullRoundText} - ${s.slots[0].entrant.name} vs. ${s.slots[1].entrant.name}`,
							value: s.id
						}
					})
			} else {
				return []
			}
		}
	},
	methods: {
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
		},
		updateEvent () {
			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'EVENT',
					value: this.event
				}))
			}
		},
		updateSet() {
			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'SET',
					value: this.set
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
