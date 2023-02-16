<template>
<div id="test-overlay">
	<div>
		<h1>{{ match }}, best of {{ bestOf }}</h1>
	</div>
	<div>
		<h2>entrant one</h2>
		<p>name: {{ p1.name }}</p>
		<p>tag: {{ p1.tag }}</p>
		<p>char: {{ p1.char }}</p>
		<p>score: {{ p1.score }}</p>
		<p v-if="grands">winners: {{ p1.winners }}</p>
	</div>
	<div>
		<h2>entrant two</h2>
		<p>name: {{ p2.name }}</p>
		<p>tag: {{ p2.tag }}</p>
		<p>char: {{ p2.char }}</p>
		<p>score: {{ p2.score }}</p>
		<p v-if="grands">winners: {{ p2.winners }}</p>
	</div>
</div>
</template>

<script>
export default {
	name: 'Test Overlay',
	props: {
		p1: {
			type: Object,
			required: true
		},
		p2: {
			type: Object,
			required: true
		},
		match: { type: String, required: true },
		bestOf: { type: Number, default: 3 },
		grands: { type: Boolean, default: false },
	}
}
</script>

<style scoped>
#test-overlay {
  color: #213547;
  /* text-align: center; */
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}
</style>


