<template>
	<div class="commentatary-page">
		<template v-if="set?.id">
			<a-typography-title :level="2">{{ set.fullRoundText }}</a-typography-title>
			<div class="player-grid">
				<div class="p1">
					<a-typography-title :level="4">{{ p1.fullTag }}</a-typography-title>
				</div>
				<div class="sepatator">
					<a-typography-title :level="4">vs.</a-typography-title>
				</div>
				<div class="p2">
					<a-typography-title :level="4">{{ p2.fullTag }}</a-typography-title>
				</div>
			</div>
		</template>
		<template v-else>
			<a-typography-title :level="2">set not specified</a-typography-title>
		</template>
	</div>
</template>

<script>
import { InProgressSet, CharacterList } from '../queries'

export default {
	name: 'CommentatorPage',
	data () {
		return {
			set: undefined,
			videogame: undefined
		}
	},
	apollo: {
		set: {
			query: InProgressSet,
			variables () {
				return {
          set: this.setID.toString()
				}
			},
			// skip: true,
			// pollInterval: 2 * 1000
		},
		videogame: {
			query: CharacterList,
			variables () {
				return {
					game: this.set?.event?.videogame.slug || 'game/ultimate'
				}
			},
			// skip: true
		}
	},
	props: {
		setID: {
			type: Number,
			required: true
		}
	},
	methods: {
		// return a player object of selected player from the current set
		createPlayer (set, pIndex) {
			const name = set?.slots?.[pIndex]?.entrant.participants[0].gamerTag || `player ${pIndex ? 'two' : 'one'} name`
			const tag = set?.slots?.[pIndex]?.entrant.participants[0].prefix || ''
			const fullTag = tag
				? `[${tag}] ${name}`
				: name
			const score = set?.slots?.[pIndex]?.standing.stats.score.value || 0
			const twitter = set?.slots?.[pIndex]?.entrant.participants[0]?.player?.user?.authorizations?.[0]?.externalUsername

			const charID = set?.games?.at(-1).selections
				.filter(s => s.selectionType === 'CHARACTER')
				.find(s => s.entrant.id === set.slots[pIndex]?.entrant.id)
				?.selectionValue
			const char = this.videogame?.characters?.find(c => c.id === charID)

			return {
				name,
				tag,
				fullTag,
				score,
				twitter,
				char: char ? {
					name: char?.name,
					img: char?.images[1].url
				} : undefined,
			}
		}
	},
	computed: {
		p1 () {
			return this.createPlayer(this.set, 0)
		},
		p2 () {
			return this.createPlayer(this.set, 1)
		}
	},
	watch: {
		setID () {
			this.$apollo.queries.set.skip = !(this.setID && this.setID.toString().length === 8)
			this.$apollo.queries.videogame.skip = !(this.setID && this.setID.toString().length === 8)
		}
	}
}
</script>

<style>
.commentatary-page {
	text-align: center;
}
.player-grid {
	display: grid;
	grid-template-columns: 1fr 30px 1fr;
	grid-template-rows: auto;
	grid-template-areas: "p1 sep p2";
}

.p1 {
	grid-area: p1;
}

.p2 {
	grid-area: p2;
}

.sepatator {
	grid-area: sep;
}
</style>

