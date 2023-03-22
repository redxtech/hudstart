<template>
  <main id="overlay">
    <component :is="overlayComponent" :key="overlay" :p1="l" :p2="r" :match="match" :best-of="bestOf"
      :flipPlayers="flipPlayers" :event="event" :grands="grands" />
  </main>
</template>

<script>
import { overlays } from "./components/overlays/overlays.js";
import { InProgressSet, CharacterList } from "./queries.js";

const WS_URL =
  import.meta.env.VITE_WEBSOCKET_URL ||
  `ws://localhost:${import.meta.env.HUDSTART_PORT || "6875"}/ws`;

export default {
  data() {
    return {
      conn: undefined,
      overlay: "default",
      setID: "",
      flipPlayers: false,
      set: {},
      bestOfManual: 0,
      videogame: {},
    };
  },
  apollo: {
    set: {
      query: InProgressSet,
      variables() {
        return {
          set: this.setID,
        }
      },
      skip: true,
      pollInterval: import.meta.env.PROD ? 2 * 1000 : 0 // only poll results in prod
    },
    videogame: {
      query: CharacterList,
      variables() {
        return {
          game: this.set?.event?.videogame.slug,
        }
      },
      skip: true
    },
  },
  methods: {
    // return a player object of selected player from the current set
    createPlayer(set, pIndex) {
      const id = set?.slots?.[pIndex]?.entrant?.participants[0].player?.id;
      const name =
        set?.slots?.[pIndex]?.entrant?.participants[0].gamerTag ||
        `player ${pIndex ? "two" : "one"} name`;
      const tag = set?.slots?.[pIndex]?.entrant?.participants[0].prefix || "";
      const fullTag = tag ? `[${tag}] ${name}` : name;
      const score = set?.slots?.[pIndex]?.standing?.stats?.score?.value || 0;
      const pronouns =
        set?.slots?.[pIndex]?.entrant?.participants[0]?.player?.user
          ?.genderPronoun;
      const twitter =
        set?.slots?.[pIndex]?.entrant?.participants[0]?.player?.user
          ?.authorizations?.[0]?.externalUsername;

      const charID = set?.games
        ?.at(-1)
        .selections.filter((s) => s.selectionType === "CHARACTER")
        .find(
          (s) => s.entrant.id === set.slots[pIndex]?.entrant.id
        )?.selectionValue;
      const char = this.videogame?.characters?.find((c) => c.id === charID);
      // TODO: create an object to lookup the needsFlip if on left & necessary zoom

      return {
        id,
        name,
        tag,
        fullTag,
        score,
        pronouns,
        twitter,
        char: char
          ? {
            name: char?.name,
            img: char?.images[1].url,
            full: char?.images[0].url,
          }
          : undefined,
      };
    },
  },
  computed: {
    p1() {
      return this.createPlayer(this.set, 0);
    },
    p2() {
      return this.createPlayer(this.set, 1);
    },
    l() {
      return this.flipPlayers ? this.p2 : this.p1;
    },
    r() {
      return this.flipPlayers ? this.p1 : this.p2;
    },
    match() {
      return this.set.fullRoundText || "unknown round";
    },
    bestOf() {
      // if bestOfManual is 0, that means use API for bestOf
      return this.bestOfManual === 0
        ? this.set.setGamesType === 1
          ? this.set.totalGames
          : 3
        : this.bestOfManual;
    },
    event() {
      return this.set?.event?.name || "unknown event";
    },
    grands() {
      return this.set.fullRoundText === "Grand Final";
    },
    overlayComponent() {
      return overlays[this.overlay];
    },
  },
  watch: {
    setID() {
      // if the setID is invalid, don't query the API
      this.$apollo.queries.set.skip = !this.setID
    },
    set() {
      // if the set videogame is invalid, don't query the API
      this.$apollo.queries.videogame.skip = !this.set?.event?.videogame
    }
  },
  mounted() {
    // on page load, get the overlay from localStorage and use it
    const overlay = localStorage.getItem("overlay");
    if (overlay) {
      localStorage.setItem('overlay', 'default')
      this.overlay = 'default'
    }

    // create websocket connection on mount
    this.conn = new WebSocket(WS_URL);

    // send notice to admin page that the websocket has connected
    const onOpen = () => {
      console.log("websocket connected");

      this.conn.send(
        JSON.stringify({
          target: "ADMIN",
          type: "INITIAL",
        })
      );
    };

    // handle messages based on the content
    const onMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // only handle messages targeted at the overlay
        if (data.target === "OVERLAY") {
          switch (data.type) {
            // update set when sent from admin page
            case "SET":
              if (data.value.length === 8 && parseInt(data.value)) {
                this.setID = data.value.toString();
              }
              break;
            // update the overlay when sent from admin page
            case "OVERLAY":
              this.overlay = data.value;
              localStorage.setItem("overlay", data.value);
              break;
            // update the bestOf when sent from admin page
            case "BESTOF":
              this.bestOfManual = data.value;
              break;
            // update flipPlayers when sent from admin page
            case "FLIP":
              this.flipPlayers = data.value;
              break;
            // update the whole state of the overlay data when sent from admin page
            case "STATE":
              this.setID = data.value.set;
              this.overlay = data.value.overlay || 'default'
              this.bestOfManual = data.value.bestOf;
              this.flipPlayers = data.value.flipPlayers;
              break;
            // clear the set when signalled from the admin page
            case "CLEAR":
              this.setID = undefined;
              break;
            // set the token in localstorage and reload the page when sent new token from admin page
            case "TOKEN":
              localStorage.setItem("api-token", data.value);
              window.location.reload();
              break;
            default:
              break;
          }
        }
      } catch (e) {
        console.error("couldn't parse websocket message:", e);
      }
    };

    // when the socket closes, log it and set a timeout to try and reconnect
    // this will run every time a connection fails as well, so it will keep trying until connected
    const onClose = () => {
      this.conn = null;
      console.log("websocket closed");
      setTimeout(() => {
        this.conn = new WebSocket(WS_URL);
        this.conn.addEventListener("open", onOpen);
        this.conn.addEventListener("message", onMessage);
        this.conn.addEventListener("close", onClose);
      }, 3000);
    };

    // add all event listeners to the socket
    this.conn.addEventListener("open", onOpen);
    this.conn.addEventListener("message", onMessage);
    this.conn.addEventListener("close", onClose);
  },
  unmounted() {
    // close websocket
    this.conn.removeEventListener("close", onClose);
    this.conn.close();
    this.conn = null;
  },
};
</script>

<style scoped>
#overlay {
  height: 1080px;
  width: 1920px;
  /* border: 5px red solid; */
}
</style>
