<template>
  <main id="overlay">
		<component :is="overlayComponent"
			:p1-name="one.name"
			:p1-tag="one.tag"
			:p1-score="one.score"
			:p1-char="one.char"
			:p1-winners="two.winners"
			:p2-name="two.name"
			:p2-tag="two.tag"
			:p2-score="two.score"
			:p2-char="two.char"
			:p2-winners="two.winners"
			:match="match"
			:best-of="bestOf"
			:grands="grands"
		/>
	</main>
</template>

<script>
import { overlays } from './components/overlays/overlays.js'

export default {
	data() {
		return {
			overlayComponent: overlays.default,
			one: {
				name: 'player one',
				tag: 'ssb',
				score: 2,
				char: 'captain falcon',
				winners: true
			},
			two: {
				name: 'player two',
				tag: 'ssb',
				score: 1,
				char: 'samus',
				winners: false
			},
			match: 'grand finals',
			grands: true,
			bestOf: 5
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
