<template>
  <div id="character-overlay">
    <div class="match info">
      <p>{{ match }}</p>
    </div>
    <div class="best-of info">
      <p>Best of {{ bestOf }}</p>
    </div>
    <div class="separator">
      <!-- <img src="../../assets/smash_ball.svg" alt="smash ball" /> -->
      <p><span class="v">V</span><span class="s">S</span></p>
    </div>
    <div class="name name-l">
      <p>
        <span v-if="p1.tag" class="tag">[{{ p1.tag }}] </span>{{ p1.name }}
        <span v-if="p1.pronouns" class="pronouns"> {{ p1.pronouns }}</span>
      </p>
    </div>
    <div class="score score-l">
      <p>{{ p1.score }}</p>
    </div>
    <div class="score score-r">
      <p>{{ p2.score }}</p>
    </div>
    <div class="name name-r">
      <p>
        <span v-if="p2.pronouns" class="pronouns">{{ p2.pronouns }} </span>
        <span v-if="p2.tag" class="tag"> [{{ p2.tag }}] </span>{{ p2.name }}
        <span v-if="grands" class="winners"> [L]</span>
      </p>
    </div>
    <div class="border-l"></div>
    <div class="border-r"></div>
    <div
      v-if="p1.char?.full"
      class="char char-l"
      :class="{ flip: flipPlayers }"
    >
      <img :src="p1.char.full" :alt="p1.char.name" />
    </div>
    <div
      v-if="p2.char?.full"
      class="char char-r"
      :class="{ flip: flipPlayers }"
    >
      <img :src="p2.char.full" :alt="p2.char.name" />
    </div>
  </div>
</template>

<script>
import props from "./props.js";

export default {
  name: "Character Overlay",
  props,
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=League+Gothic&display=swap");

#character-overlay {
  display: grid;
  grid-template-columns: 1fr 15px 40px 40px 15px 1fr;
  grid-template-rows: 60px 60px 5px;
  grid-template-areas:
    "match  match   vs vs best-of best-of"
    "name-l score-l vs vs score-r name-r"
    "border-l border-l border-l border-r border-r border-r";
  width: 800px;
  height: 120px;

  --p1-colour: #e1341e;
  --p2-colour: #1ecbe1;

  background-color: #1b1b1b;
  color: white;

  margin: 30px auto;
  text-align: center;

  font-family: "League Gothic", sans-serif;
  font-weight: 700;
  --big-text: 40px;
  --small-text: 30px;
}

#character-overlay p {
  margin-top: 0;
  margin-bottom: 0;
  z-index: 10;
  position: relative;
}

.name p {
  margin: 0 0.5rem;
  font-size: var(--big-text);
  text-shadow: 1px 1px rgba(0, 0, 0, 0.75);
}

.name-l {
  grid-area: name-l;
  text-align: left;
}

.name-r {
  grid-area: name-r;
  text-align: right;
}

.tag {
  color: gray;
  font-size: calc(var(--big-text) - 5px);
}

.pronouns {
  font-size: calc(var(--big-text) - 15px);
  color: gray;
  text-transform: lowercase;
}

.score {
  display: flex;
  align-items: flex-end;
}

.score p {
  font-size: var(--big-text);
}

.score-l {
  grid-area: score-l;
  justify-content: flex-end;
}

.score-r {
  grid-area: score-r;
  justify-content: flex-start;
}

.info {
  font-size: var(--small-text);
  text-transform: uppercase;
}

.match {
  grid-area: match;
  text-align: right;
}

.best-of {
  grid-area: best-of;
  text-align: left;
}

.separator {
  grid-area: vs;
}

.separator img {
  margin: 10px;
  max-height: calc(100% - 20px);
  max-width: calc(100% - 20px);
}

.separator p {
  height: 100%;
  font-size: 80px;
  font-style: italic;
}

.separator .v {
  position: relative;
  top: -5px;
}

.separator .s {
  position: relative;
  top: 5px;
}

.border-l {
  grid-area: border-l;
  background-color: var(--p1-colour);
}

.border-r {
  grid-area: border-r;
  background-color: var(--p2-colour);
}

.char {
  /* position: absolute; */
  position: relative;
  top: -125px;

  /* width: 400px; */
  height: 120px;

  grid-column: span 3;

  overflow: hidden;
}

.char img {
  z-index: 5;
  max-width: 100%;
  filter: grayscale(85%) opacity(75%);
}

.char.flip img {
  transform: scaleX(-1);
}
</style>
