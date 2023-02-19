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
							style="width: 100%"
							placeholder="https://start.gg/tournament/..."
						/>
					</a-form-item>
					<a-typography-title :level="4">
						set selection mode
					</a-typography-title>
					<a-form-item>
						<a-radio-group v-model:value="useStreamQueue">
							<a-radio-button :value="false">manual selection</a-radio-button>
							<a-radio-button :value="true">stream queue</a-radio-button>
						</a-radio-group>
					</a-form-item>
					<template v-if="useStreamQueue">
						<a-typography-title :level="4">
							select stream
						</a-typography-title>
						<v-select
							v-model="stream"
							:options="streamSelection"
							:filterable="false"
							placeholder="select a stream"
							class="selector"
						>
							<template #no-options>
								<em style="opacity: 0.5">no streams available</em>
							</template>
						</v-select>
					</template>
					<template v-else>
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
					</template>
					<a-typography-title :level="4">
						select a set
					</a-typography-title>
					<v-select
						v-model="set"
						:options="setSelection"
						:reduce="set => set.value"
						placeholder="select a set"
						:disabled="!this.event && !(this.useStreamQueue && this.stream)"
						class="selector"
					>
						<template v-slot:no-options="{ search, searching }">
							<template v-if="searching">
								<span style="opacity: 0.5">no sets matching <em>{{ search }}</em>.</span>
							</template>
							<em v-else style="opacity: 0.5">no sets available</em>
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
					<a-typography-title :level="4">
						best of
					</a-typography-title>
					<a-form-item>
						<a-radio-group v-model:value="bestOf">
							<a-radio-button :value="0">auto</a-radio-button>
							<a-radio-button :value="1">best of 1</a-radio-button>
							<a-radio-button :value="3">best of 3</a-radio-button>
							<a-radio-button :value="5">best of 5</a-radio-button>
						</a-radio-group>
					</a-form-item>
					<a-typography-title :level="4">
						tools
					</a-typography-title>
					<a-form-item>
						<a-space>
							<a-button type="default" @click="showOverlayModal">choose overlay</a-button>
							<a-button type="default" @click="showCommentatorModal">show commentator modal</a-button>
							<a-button type="default">show top 8 generator</a-button>
							<a-button type="default" @click="showTokenModal">set api token</a-button>
						</a-space>
						<a-modal v-model:visible="overlayModalVisible" title="choose overlay" @ok="setOverlay">
							<a-form-item>
								<v-select
									v-model="overlay"
									:options="overlaySelection"
									:reduce="overlay => overlay.overlay"
									class="selector"
								/>
							</a-form-item>
						</a-modal>
						<a-modal v-model:visible="commentatorModalVisible" title="commentator information" @ok="hideCommentatorModal">
							<commentator-page :set="sets.find(s => s.id === this.set)" />
						</a-modal>
						<a-modal v-model:visible="tokenModalVisible" title="set api token" @ok="setToken">
							<a-form-item>
								<a-input
									v-model:value="token"
								/>
							</a-form-item>
						</a-modal>
					</a-form-item>
				</a-form>
			</div>
		</main>
	</div>
</template>

<script>
import CommentatorPage from './components/commentator.vue'
import { EventsInTourney, SetsInEvent, StreamQueue } from './queries.js'
import { overlays } from './components/overlays/overlays.js'

export default {
	name: 'Admin',
	data () {
		return {
			conn: undefined,
			tournament: undefined,
			token: '',
			useStreamQueue: false,
			streamQueue: [],
			stream: undefined,
			event: undefined,
			events: [],
			set: undefined,
			sets: [],
			setPage: 1,
			updatePage: 1,
			perPage: 20,
			moreSets: true,
			moreSetsInterval: undefined,
			showCompleted: true,
			bestOf: 0,
			overlay: 'default',
			overlayModalVisible: false,
			commentatorModalVisible: false,
			tokenModalVisible: false,
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
		},
		streamQueue: {
			query: StreamQueue,
			variables () {
				return {
					tourney: this.tournamentSlug
				}
			},
			update: data => data?.tournament?.streamQueue,
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
		streamSelection () {
			if (this.streamQueue) {
				return this.streamQueue.map(s => s.stream?.streamName)
			} else {
				return []
			}
		},
		setSelection () {
			if (this.useStreamQueue) {
				if (this.stream) {
					return this.streamQueue
						.find(s => s.stream.streamName === this.stream)
						.sets
						.map(s => {
							return {
								label: `[${s.phaseGroup.phase.name}] ${s.fullRoundText} - ${s.slots[0].entrant.participants[0].gamerTag} vs. ${s.slots[1].entrant.participants[0].gamerTag}`,
								value: s.id
							}
						})
				}
			} else {
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
		overlaySelection () {
			return Object.keys(overlays).map(overlay => {
				return {
					label: overlays[overlay].name,
					overlay
				}
			})
		}
	},
	methods: {
		updateSet() {
			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'SET',
					value: this.set?.toString()
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
		},
		showOverlayModal () {
			this.overlayModalVisible = true
		},
		setOverlay () {
			this.overlayModalVisible = false
			localStorage.setItem('overlay', this.overlay)

			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'OVERLAY',
					value: this.overlay
				}))
			}
		},
		showCommentatorModal () {
			this.commentatorModalVisible = true
		},
		hideCommentatorModal () {
			this.commentatorModalVisible = false
		},
		setToken () {
			this.tokenModalVisible = false
			localStorage.setItem('api-token', this.token)

			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'TOKEN'
				}))
			}

			window.location.reload()
		},
		showTokenModal () {
			this.tokenModalVisible = true
		}
	},
	watch: {
		tournamentSlug () {
			this.event = undefined
			this.set = undefined
			this.$apollo.queries.events.skip = !this.tournamentSlug
			this.$apollo.queries.streamQueue.skip = !this.tournamentSlug

			this.stream = this.streamQueue || this.streamQueue?.[0]?.stream?.streamName
			this.event = this.event || this.events?.[0]?.slug
		},
		useStreamQueue () {
			this.set = undefined
			if (this.useStreamQueue) {
				this.stream = this.stream || this.streamQueue?.[0]?.stream?.streamName
			} else {
				this.event = this.event || this.events?.[0]?.slug
			}
		},
		event () {
			this.set = undefined
			this.moreSets = true
			this.setPage = 1
			this.updatePage = 1
			this.$apollo.queries.sets.skip = !this.event
		},
		bestOf () {
			if (this.conn) {
				this.conn.send(JSON.stringify({
					target: 'OVERLAY',
					type: 'BESTOF',
					value: this.bestOf
				}))
			}
		}
	},
	mounted () {
		this.conn = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)

		const onOpen = () => console.log('websocket connected')

		const onMessage = event => {
			const data = JSON.parse(event.data)
			if (data.target === 'ADMIN') {
				switch (data.type) {
					case 'INITIAL':
						if (this.conn) {
							this.conn.send(JSON.stringify({
								target: 'OVERLAY',
								type: 'STATE',
								value: {
									set: this.set,
									overlay: this.overlay,
									bestOf: this.bestOf
								}
							}))
						}
						break
					default:
						break
				}
				console.log(data)
			}
		}

		const onClose = () => {
			this.conn = null
			console.log('websocket closed')
			setTimeout(() => {
				this.conn = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)
				this.conn.addEventListener('open', onOpen)
				this.conn.addEventListener('message', onMessage)
				this.conn.addEventListener('close', onClose)
			}, 3000)
		}

		this.conn.addEventListener('open', onOpen)
		this.conn.addEventListener('message', onMessage)
		this.conn.addEventListener('close', onClose)

		this.moreSetsInterval = setInterval(() => {
			this.getMoreSets()
		}, 1 * 1000)

		this.token = localStorage.getItem('api-token')
		this.overlay = localStorage.getItem('overlay')
	},
	unmounted () {
		this.conn.removeEventListener('close')
		this.conn.close()
		this.conn = null
	},
	components: {
		CommentatorPage
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
		width: 100%;
	 	margin-bottom: 24px;
	}

	.tournament {
		--vs-search-input-placeholder-color: darkgray;
	}
</style>
