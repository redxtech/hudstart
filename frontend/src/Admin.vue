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
					<v-select
						v-model="event"
						:options="eventSelection"
						:reduce="event => event.value"
						:filterable="false"
						placeholder="select an event"
						class="selector"
					>
						<template #no-options>
							<em style="opacity: 0.5">no events available</em>
						</template>
					</v-select>
					<a-typography-title :level="4">
						select a set
					</a-typography-title>
					<v-select
						v-model="set"
						:options="setSelection"
						:reduce="set => set.value"
						placeholder="select a set"
						:disabled="!this.event"
						class="selector"
					>
						<template v-slot:no-options="{ search, searching }">
							<template v-if="searching">
								<span style="opacity: 0.5">no sets matching <em>{{ search }}</em>.</span>
							</template>
							<em v-else style="opacity: 0.5">no events available</em>
						</template>
					</v-select>
					<a-form-item class="filter-switch" label="show completed">
						<a-switch
							v-model:checked="showCompleted"
						/>
					</a-form-item>
					<a-form-item>
						<a-space>
							<a-button type="primary" @click="updateSet">save</a-button>
							<a-button type="danger" @click="clearSet">clear</a-button>
						</a-space>
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
			tournament: undefined,
			token: '',
			event: undefined,
			events: [],
			set: undefined,
			sets: [],
			setPage: 1,
			updatePage: 1,
			perPage: 10,
			moreSets: true,
			moreSetsInterval: undefined,
			showCompleted: true,
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
			update: data => data?.tournament?.events,
			skip: true
		},
		sets: {
			query: SetsInEvent,
			variables () {
				return {
					event: this.event || '',
					page: this.setPage,
					perPage: this.perPage
				}
			},
			update: data => data?.event?.sets?.nodes,
			skip: true
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
					.filter(set => set.slots.every(slot => slot.entrant !== null) && (this.showCompleted ? true : set.state !== 3))
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
			this.set = undefined
			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'CLEAR'
				}))
			}
		},
		getMoreSets() {
			if (this.event && this.moreSets) {
				this.updatePage++
				this.$apollo.queries.sets.fetchMore({
					// New variables
					variables: {
						event: this.event,
						page: this.updatePage,
						perPage: this.perPage
					},
					updateQuery: (previousResult, { fetchMoreResult }) => {
						this.moreSets = fetchMoreResult.event.sets.pageInfo.page < fetchMoreResult.event.sets.pageInfo.totalPages

						return { 
							event: {
								__typename: previousResult.event.__typename,
								id: previousResult.event.id,
								sets: {
									__typename: previousResult.event.sets.__typename,
									pageInfo: previousResult.event.sets.pageInfo,
									nodes: [
										...previousResult.event.sets.nodes,
										...fetchMoreResult.event.sets.nodes
									]
								}
							}
						}
					}
				})
			}
		}
	},
	watch: {
		tournamentSlug () {
			this.event = undefined
			this.set = undefined
			this.$apollo.queries.events.skip = !this.tournament
		},
		event () {
			this.set = undefined
			this.moreSets = true
			this.setPage = 1
			this.updatePage = 1
			this.$apollo.queries.sets.skip = !this.event
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

		this.moreSetsInterval = setInterval(() => {
			this.getMoreSets()
		}, 1 * 1000)
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

	.selector {
		width: calc(100% - 200px);
	 	margin-bottom: 24px;
	}

	.tournament {
		--vs-search-input-placeholder-color: darkgray;
	}
</style>
