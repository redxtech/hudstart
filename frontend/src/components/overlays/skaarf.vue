<template>
  <div id="skaarfs-overlay">
    <div class="match">
      <p>{{ match }}</p>
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
    <div class="separator">
      <!-- <img src="../../assets/smash_ball.svg" alt="smash ball" /> -->
      <p>VS</p>
    </div>
    <div class="best-of">
      <p>Best of {{ bestOf }}</p>
    </div>
    <div class="score score-r">
      <p>{{ p2.score }}</p>
    </div>
    <div class="name name-r">
      <p>
        <span v-if="p2.pronouns" class="pronouns">{{ p2.pronouns }} </span>
        <span v-if="p2.tag" class="tag">[{{ p2.tag }}] </span>{{ p2.name }}
        <span v-if="grands" class="winners"> [L]</span>
      </p>
    </div>
    <div class="border-l"></div>
    <div class="border-r"></div>
  </div>
</template>

<script>
import props from "./props.js";

export default {
  name: "Skaarf's Overlay",
  props,
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=League+Gothic&display=swap");

#skaarfs-overlay {
  display: grid;
  grid-template-columns: 1fr 15px 50px 50px 15px 1fr;
  grid-template-rows: 60px 60px 5px;
  grid-template-areas:
    "match  match   vs vs best-of best-of"
    "name-l score-l vs vs score-r name-r"
    "border-l border-l border-l border-r border-r border-r";
  width: 800px;
  height: 120px;

  --p1-colour: #e1341e;
  --p2-colour: #1ecbe1;

  background-color: black;
  color: white;

  margin: 30px auto;
  text-align: center;

  font-family: "League Gothic", sans-serif;
  font-weight: 700;
  --small-text: 30px;
}

#skaarfs-overlay p {
  margin-top: 0;
  margin-bottom: 0;
}

.name p {
  font-size: 40px;
  margin: 0 0.5rem;
}

.tag {
  color: gray;
}

.pronouns {
  font-size: 25px;
  color: gray;
  text-transform: lowercase;
}

.name-l {
  grid-area: name-l;
  text-align: left;
}

.name-r {
  grid-area: name-r;
  text-align: right;
}

.score {
  display: flex;
  align-items: flex-end;
}

.score p {
  font-size: var(--small-text);
}

.score-l {
  grid-area: score-l;
  justify-content: flex-end;
}

.score-r {
  grid-area: score-r;
  justify-content: flex-start;
}

.match {
  grid-area: match;
  font-size: var(--small-text);
  text-align: right;
  text-transform: uppercase;
}

.best-of {
  grid-area: best-of;
  font-size: var(--small-text);
  text-align: left;
  text-transform: uppercase;
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

.border-l {
  grid-area: border-l;
  background-color: var(--p1-colour);
}

.border-r {
  grid-area: border-r;
  background-color: var(--p2-colour);
}
</style>
