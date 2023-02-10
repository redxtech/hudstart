<template>
<div id="test-overlay">
	<div>
		<h1>{{ match }}, best of {{ bestOf }}</h1>
	</div>
	<div>
		<h2>entrant one</h2>
		<p>name: {{ p1Name }}</p>
		<p>tag: {{ p1Tag }}</p>
		<p>char: {{ p1Char }}</p>
		<p>score: {{ p1Score }}</p>
		<p v-if="grands">winners: {{ p1Winners }}</p>
	</div>
	<div>
		<h2>entrant two</h2>
		<p>name: {{ p2Name }}</p>
		<p>tag: {{ p2Tag }}</p>
		<p>char: {{ p2Char }}</p>
		<p>score: {{ p2Score }}</p>
		<p v-if="grands">winners: {{ p2Winners }}</p>
	</div>
</div>
</template>

<script>
export default {
	props: {
		p1Name: { type: String, required: true },
		p1Tag: { type: String, required: true },
		p1Score: { type: Number, required: true },
		p1Char: { type: String, required: true },
		p1Winners: { type: Boolean, required: true },
		p2Name: { type: String, required: true },
		p2Tag: { type: String, required: true },
		p2Score: { type: Number, required: true },
		p2Char: { type: String, required: true },
		p2Winners: { type: Boolean, required: true },
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


