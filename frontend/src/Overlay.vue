<template>
  <main id="overlay">
		<component
			:is="overlayComponent"
			:key="overlay"
			:p1="p1"
			:p2="p2"
			:match="match"
			:best-of="bestOf"
			:event="event"
			:grands="grands"
		/>
	</main>
</template>

<script>
import { overlays } from './components/overlays/overlays.js'
import { InProgressSet, CharacterList } from './queries.js'

export default {
	data() {
		return {
			conn: undefined,
			overlay: 'default',
			setID: '',
			refreshInterval: 5,
			set: {},
			bestOfManual: 0,
			videogame: {},
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
			// pollInterval: 5 * 1000
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
		// return a player object of selected player from the current set
		createPlayer (set, pIndex) {
			const name = set?.slots?.[pIndex]?.entrant.participants[0].gamerTag || `player ${pIndex ? 'two' : 'one'} name`
			const tag = set?.slots?.[pIndex]?.entrant.participants[0].prefix || ''
			const score = set?.slots?.[pIndex]?.standing.stats.score.value || 0
			const twitter = set?.slots?.[pIndex]?.entrant.participants[0]?.player?.user?.authorizations?.[0]?.externalUsername
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
				twitter,
				char: char ? {
					name: char?.name,
					img: char?.images[1].url
				} : undefined,
				winners
			}
		}
	},
	computed: {
		p1 () {
			return this.createPlayer(this.set, 0)
		},
		p2 () {
			return this.createPlayer(this.set, 1)
		},
		match () { return this.set.fullRoundText || 'unknown round' },
		bestOf () {
			// if bestOfManual is 0, that means use API for bestOf
			return this.bestOfManual === 0
				? this.set.setGamesType === 1
					? this.set.totalGames
					: 3
				: this.bestOfManual
		},
		event () { return this.set?.event?.name || 'unknown event' },
		grands () { return this.set.fullRoundText === 'Grand Final' },
		overlayComponent () {
			return overlays[this.overlay]
		}
	},
	mounted () {
		// create websocket connection on mount
		this.conn = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)

		// send notice to admin page that the websocket has connected
		const onOpen = () => {
			console.log('websocket connected')

			this.conn.send(JSON.stringify({
				target: 'ADMIN',
				type: 'INITIAL'
			}))
		}

		// handle messages based on the content
		const onMessage = event => {
			try {
				const data = JSON.parse(event.data)
				// only handle messages targeted at the overlay
				if (data.target === 'OVERLAY') {
					switch (data.type) {
						// update set when sent from admin page
						case 'SET':
							if (data.value.length === 8 && parseInt(data.value)) {
								this.setID = data.value.toString()
							}
							break
						// update the overlay when sent from admin page
						case 'OVERLAY':
							this.overlay = data.value
							localStorage.setItem('overlay', data.value)
							break
						// update the bestOf when sent from admin page
						case 'BESTOF':
							this.bestOfManual = data.value
							break
						// update the whole state of the overlay data when sent from admin page
						case 'STATE':
							this.setID = data.value.set
							this.overlay = data.value.overlay
							this.bestOfManual = data.value.bestOf
							break
						// clear the set when signalled from the admin page
						case 'CLEAR':
							this.setID = undefined
							break
						// set the token in localstorage and reload the page when sent new token from admin page
						case 'TOKEN':
							localStorage.setItem('api-token', data.value)
							window.location.reload()
							break
						default:
							break
					}
				}
			} catch (e) {
				console.error('couldn\'t parse websocket message:', e)
			}
		}

		// when the socket closes, log it and set a timeout to try and reconnect
		// this will run every time a connection fails as well, so it will keep trying until connected
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

		// add all event listeners to the socket
		this.conn.addEventListener('open', onOpen)
		this.conn.addEventListener('message', onMessage)
		this.conn.addEventListener('close', onClose)

		// on page load, get the overlay from localStorage and use it
		const overlay = localStorage.getItem('overlay')
		this.overlay = overlay
			? overlay
			: 'default'
		
	},
	unmounted () {
		// close websocket
		this.conn.removeEventListener('close')
		this.conn.close()
		this.conn = null
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
