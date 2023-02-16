<template>
<div id="default-overlay">
	<div class="name name-l">
		<p><span v-if="p1.tag" class="tag">[{{ p1.tag }}] </span>{{ p1.name }}<span v-if="grands" class="winners"> [W]</span></p>
	</div>
	<div class="score score-l">
		<p>{{ p1.score }}</p>
	</div>
	<div class="separator">
		<img src="../../assets/smash_ball.svg" alt="smash ball" />
	</div>
	<div class="score score-r">
		<p>{{ p2.score }}</p>
	</div>
	<div class="name name-r">
		<p><span v-if="p2.tag">[{{ p2.tag }}] </span>{{ p2.name }}<span v-if="grands" class="winners"> [L]</span></p>
	</div>
	<div class="match">
		<p>{{ match }}</p>
	</div>
	<div class="best-of">
		<p>Best of {{ bestOf }}</p>
	</div>
</div>
</template>

<script>
export default {
	name: 'Default Overlay',
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
	display: grid;
	grid-template:
		[row1-start] "name-l score-l separator score-r name-r"  60px [row1-end]
		[row2-start] "match  match   separator best-of best-of" 50px [row2-end]
		/ 1fr 60px 110px 60px 1fr;
	
	margin: 30px auto 0;
	width: 800px;

  text-align: center;
	font-weight: bold;

	color: white;
	--p1-colour: #E1341E;
	--p2-colour: #1ECBE1;
	background-color: #0052a8;
}

.name {
	align-self: stretch;
	justify-self: stretch;
	font-size: 1.5rem;
	line-height: 100%;
	vertical-align: middle;

	height: 100%;
	width: 100%;
	border-bottom: 5px solid;
}

.score {
	align-self: stretch;
	justify-self: stretch;
	font-size: 1.5rem;
	line-height: 100%;
	vertical-align: middle;

	height: 100%;
	width: 100%;
	border-bottom: 5px solid;
}

.name, .score {
	display: flex;
	align-items: center;
	justify-items: center;
}

.name p, .score p {
	width: 100%;
}

.name-l {
	grid-area: name-l;
	border-color: var(--p1-colour);
}

.score-l {
	grid-area: score-l;
	border-color: var(--p1-colour);
}

.score-r {
	grid-area: score-r;
	border-color: var(--p2-colour);
}

.name-r {
	grid-area: name-r;
	border-color: var(--p2-colour);
}

.tag {
	font-weight: normal;
}

.winners {
	font-weight: normal;
}

.match {
	grid-area: match;
	align-self: center;
	justify-self: center;
	font-size: 1.25rem;
}

.best-of {
	grid-area: best-of;
	align-self: center;
	justify-self: center;
	font-size: 1.25rem;
}

.separator {
	grid-area: separator;
	align-self: center;
	justify-self: center;
	font-size: 1rem;
}

.separator img {
	margin: 10px;
	max-height: calc(100% - 20px);
	max-width: calc(100% - 20px);
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

p {
	margin: 0;
}
</style>

