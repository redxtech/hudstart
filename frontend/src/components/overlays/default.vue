<template>
<div id="default-overlay">
	<div>
		<h1>{{ match }} - Best of {{ bestOf }}</h1>
	</div>
	<div>
		<h2>entrant one</h2>
		<p>name: {{ p1.name }}</p>
		<p>tag: {{ p1.tag || 'none' }}</p>
		<div v-if="p1.char">
			<p>char: {{ p1.char.name }}</p>
			<img :src="p1.char.img" alt="">
		</div>
		<p>score: {{ p1.score }}</p>
		<p v-if="grands">winners: {{ p1.winners }}</p>
	</div>
	<div>
		<h2>entrant two</h2>
		<p>name: {{ p2.name }}</p>
		<p>tag: {{ p2.tag || 'none' }}</p>
		<div v-if="p2.char">
			<p>char: {{ p2.char.name }}</p>
			<img :src="p2.char.img" alt="">
		</div>
		<p>score: {{ p2.score }}</p>
		<p v-if="grands">winners: {{ p2.winners }}</p>
	</div>
</div>
</template>

<script>
export default {
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
#default-overlay {
  color: #213547;
  text-align: center;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}
</style>

