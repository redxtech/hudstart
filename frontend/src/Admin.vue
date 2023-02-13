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
						<a-input
							v-model:value="tournament"
							style="width: calc(100% - 200px)"
							placeholder="https://start.gg/tournament/..."
						/>
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
						<a-select
							v-model:value="event"
							placeholder="select an event"
							style="width: calc(100% - 200px)"
							:options="eventSelection"
						></a-select>
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
							<a-button type="danger" @click="clearSet">clear</a-button>
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
							label: `[${s.phaseGroup.phase.name}] ${s.fullRoundText} - ${s.slots[0].entrant.participants[0].gamerTag} vs. ${s.slots[1].entrant.participants[0].gamerTag}`,
							value: s.id
						}
					})
			} else {
				return []
			}
		}
	},
	methods: {
		updateToken() {
			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'TOKEN',
					value: this.token
				}))
			}
		},
		updateSet() {
			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'SET',
					value: this.set.toString()
				}))
			}
		},
		clearSet() {
			this.set = ''
			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'CLEAR'
				}))
			}
		}
	},
	watch: {
		tournamentSlug () {
			this.event = ''
			this.set = ''
		},
		event () {
			this.set = ''
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
