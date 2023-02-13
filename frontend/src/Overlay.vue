<template>
  <main id="overlay">
		<component :is="overlayComponent"
			:p1="p1"
			:p2="p2"
			:match="match"
			:best-of="bestOf"
			:grands="grands"
		/>
	</main>
</template>

<script>
import { markRaw } from 'vue'
import { overlays } from './components/overlays/overlays.js'
import { InProgressSet, CharacterList } from './queries.js'


export default {
	data() {
		return {
			overlayComponent: markRaw(overlays.default),
			setID: '56794669',
			// setID: '56902969',
			refreshInterval: 10,
			set: {},
			videogame: {}
		}
	},
	apollo: {
		set: {
			query: InProgressSet,
			variables () {
				return {
          set: this.setID
				}
			},
			// pollInterval: this.refreshInterval * 1000
		},
		videogame: {
			query: CharacterList,
			variables () {
				return {
					game: this.set?.event?.videogame.slug || 'game/ultimate'
				}
			}
		}
	},
	methods: {
		createPlayer (set, pIndex) {
			const name = set?.slots?.[pIndex]?.entrant.participants[0].gamerTag || 'player one name'
			const tag = set?.slots?.[pIndex]?.entrant.participants[0].prefix || ''
			const score = set?.slots?.[pIndex]?.standing.stats.score.value || 0
			const winners = true

			const charID = set?.games?.at(-1).selections
				.filter(s => s.selectionType === 'CHARACTER')
				.find(s => s.entrant.id === set.slots[pIndex]?.entrant.id)
				?.selectionValue
			const char = this.videogame?.characters?.find(c => c.id === charID)

			return {
				name,
				tag,
				score,
				char: char ? {
					name: char?.name,
					img: char?.images[1].url
				} : undefined,
				winners
			}
		},
		setSet (setID) { this.setID = setID }
	},
	computed: {
		p1 () {
			return this.createPlayer(this.set, 0)
		},
		p2 () {
			return this.createPlayer(this.set, 1)
		},
		match () { return this.set.fullRoundText || '' },
		grands () { return this.set.fullRoundText === 'Grand Finals' },
		// TODO fix best of, doesn't work
		bestOf () { return this.set.setGamesType === 1 ? this.set.totalGames : 0 }
	},
	mounted () {
		const conn = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)
		conn.onmessage = event => {
			const data = JSON.parse(event.data)
			if (data.target === 'OVERLAY') {
				if (data.type === 'SETID') {
					if (data.setID.length === 8 && parseInt(data.setID)) {
						this.setSet(data.setID)
					}
				}
			}
		}
	}
}
</script>

<style scoped>
#overlay {
	height: 1080px;
	width: 1920px;
	border: 5px red solid;
}
</style>
