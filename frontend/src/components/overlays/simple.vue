<template>
  <div id="default-overlay">
    <div class="event">
      <p>{{ event }} {{ match }}</p>
    </div>
    <div class="set">
      <p class="player p1">
        <span v-if="p1.tag" class="tag">{{ p1.tag }}</span>{{ p1.name }}<span v-if="grands && p1.losers"
          class="winners">[L]</span><span class="score score-l" v-text="p1.score" />
      </p>
      <p class="player p2">
        <span class="score score-r" v-text="p2.score" />
        <span v-if="p2.tag" class="tag">{{ p2.tag }}</span>{{ p2.name }}<span v-if="grands && p2.losers"
          class="winners">[L]</span>
      </p>
    </div>
  </div>
</template>

<script>
import props from "./props";

export default {
  name: "Simple Overlay",
  props,
};
</script>

<style scoped>
#default-overlay {
  margin: 30px auto 0;
  width: 800px;

  color: white;
  font-size: 1.5rem;
  font-weight: bolder;
  text-align: center;

  --bg-colour: #0052a8;
}

.event {
  margin: 1rem 0;
  background-color: var(--bg-colour);
  color: cyan;
  font-style: italic;
}

.set {
  display: flex;
  justify-content: center;

  margin: 1rem 0;
  background-color: var(--bg-colour);
}

.player {
  flex-grow: 1;
  flex-basis: 50%;
}

.p1 {
  text-align: end;
}

.p2 {
  text-align: start;
}

.tag {
  font-weight: normal;
  margin-right: 0.5rem;
}

.score {
  display: inline-block;
  margin: 2px 0.5rem 0;
  padding: 0 0.4rem;
  height: 28px;
  width: 16px;
  background-color: white;
  text-align: center;
  color: black;
}

.score-l {
  border-bottom: 5px solid #e1341e;
}

.score-r {
  border-bottom: 5px solid #1ecbe1;
}

.winners {
  margin-left: 5px;
}

p {
  display: inline;
  margin: 0;
}
</style>
