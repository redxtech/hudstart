<template>
	<a-typography-title :level="4">
		current matchup
	</a-typography-title>
	<p>player1 vs player2</p>
	<a-typography-title :level="4">
		round
	</a-typography-title>
	<p>{{ set.fullRoundText }}</p>
</template>

<script>
export default {
	name: 'CommentatorPage',
	props: {
		set: {
			type: Object,
			required: true
		}
	}
}
</script>
