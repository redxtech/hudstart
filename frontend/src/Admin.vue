<template>
  <div class="container">
    <a-typography-title> hudstart admin page </a-typography-title>
    <main>
      <div class="tournament">
        <a-form name="tournament">
          <a-typography-title :level="4"> tournament url </a-typography-title>
          <a-form-item>
            <a-input
              v-model:value="tournament"
              style="width: 100%"
              placeholder="https://start.gg/tournament/..."
            />
          </a-form-item>
          <a-form-item v-if="!tournamentValid && tournament">
            <a-alert message="invalid tournament url" type="error" show-icon />
          </a-form-item>
          <a-form-item v-if="tournamentNotFound && tournamentValid">
            <a-alert
              message="tournament not found or has no events"
              type="error"
              show-icon
            />
          </a-form-item>
          <a-typography-title :level="4">
            set selection mode
          </a-typography-title>
          <a-form-item>
            <a-radio-group v-model:value="useStreamQueue">
              <a-radio-button :value="false">manual selection</a-radio-button>
              <a-radio-button :value="true">stream queue</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <template v-if="useStreamQueue">
            <a-typography-title :level="4"> select stream </a-typography-title>
            <v-select
              v-model="stream"
              :options="streamSelection"
              :filterable="false"
              placeholder="select a stream"
              class="selector"
            >
              <template #no-options>
                <em style="opacity: 0.5">no streams available</em>
              </template>
            </v-select>
          </template>
          <template v-else>
            <a-typography-title :level="4"> select event </a-typography-title>
            <v-select
              v-model="event"
              :options="eventSelection"
              :reduce="(event) => event.value"
              :filterable="false"
              :loading="!hasEventLoaded(event)"
              placeholder="select an event"
              class="selector"
            >
              <template #no-options>
                <em style="opacity: 0.5">no events available</em>
              </template>
            </v-select>
          </template>
          <a-typography-title :level="4"> select a set </a-typography-title>
          <v-select
            v-model="set"
            :options="setSelection"
            :reduce="(set) => set.value"
            :disabled="!this.event && !(this.useStreamQueue && this.stream)"
            :loading="!hasSetLoaded(set)"
            placeholder="select a set"
            class="selector"
          >
            <template v-slot:no-options="{ search, searching }">
              <template v-if="searching">
                <span style="opacity: 0.5"
                  >no sets matching <em>{{ search }}</em
                  >.</span
                >
              </template>
              <em v-else style="opacity: 0.5">no sets available</em>
            </template>
          </v-select>
          <a-form-item class="filter-switch" label="show completed">
            <a-switch v-model:checked="showCompleted" />
          </a-form-item>
          <a-form-item class="filter-switch" label="swap players">
            <a-switch v-model:checked="flipPlayers" />
          </a-form-item>
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="updateSet">save</a-button>
              <a-button type="danger" @click="clearSet">clear</a-button>
            </a-space>
          </a-form-item>
          <a-typography-title :level="4"> best of </a-typography-title>
          <a-form-item>
            <a-radio-group v-model:value="bestOf">
              <a-radio-button :value="0">auto</a-radio-button>
              <a-radio-button :value="1">best of 1</a-radio-button>
              <a-radio-button :value="3">best of 3</a-radio-button>
              <a-radio-button :value="5">best of 5</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-typography-title :level="4"> tools </a-typography-title>
          <a-form-item>
            <a-space>
              <a-button type="default" @click="showOverlayModal"
                >choose overlay</a-button
              >
              <a-button type="default" @click="showCommentatorModal"
                >show commentator modal</a-button
              >
              <!-- <a-button type="default">show top 8 generator</a-button> -->
              <a-button type="default" @click="showTokenModal"
                >set api token</a-button
              >
            </a-space>
            <a-modal
              v-model:visible="overlayModalVisible"
              title="choose overlay"
              @ok="setOverlay"
            >
              <a-form-item>
                <v-select
                  v-model="overlay"
                  :options="overlaySelection"
                  :reduce="(overlay) => overlay.overlay"
                  class="selector"
                />
              </a-form-item>
            </a-modal>
            <a-modal
              v-model:visible="commentatorModalVisible"
              title="commentator information"
              @ok="hideCommentatorModal"
            >
              <commentator-page :setID="set || 0" />
            </a-modal>
            <a-modal
              v-model:visible="tokenModalVisible"
              title="set api token"
              @ok="setToken"
            >
              <a-form-item>
                <a-input v-model:value="token" />
              </a-form-item>
            </a-modal>
          </a-form-item>
        </a-form>
      </div>
    </main>
  </div>
</template>

<script>
import CommentatorPage from "./components/commentator.vue";
import { EventsInTourney, SetsInEvent, StreamQueue } from "./queries.js";
import { overlays } from "./components/overlays/overlays.js";

// TODO: add top 8 generator (calculate player characters from char with most game wins this tournament)
// TODO: add preview of overlay to bottom of admin page

// regex to match and extract data points from the url
const urlMatch =
  /(?:https:\/\/)?(?:www\.)?start\.gg\/(tournament\/[^\/\n]*)(\/event\/[^\/\n]*)?(?:\/set\/)?(\d{8})?/;

export default {
  name: "Admin",
  data() {
    return {
      conn: undefined,
      tournament: undefined,
      tournamentSlug: undefined,
      token: "",
      useStreamQueue: false,
      streamQueue: [],
      stream: undefined,
      event: undefined,
      events: [],
      set: undefined,
      sets: [],
      setPage: 1,
      updatePage: 1,
      perPage: 50,
      moreSets: true,
      moreSetsInterval: undefined,
      showCompleted: true,
      flipPlayers: true,
      bestOf: 0,
      overlay: "default",
      overlayModalVisible: false,
      commentatorModalVisible: false,
      tokenModalVisible: false,
      filterOption: (input, option) => {
        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
      },
    };
  },
  apollo: {
    events: {
      query: EventsInTourney,
      variables() {
        return {
          tourney: this.tournamentSlug,
        };
      },
      update: (data) => data?.tournament?.events,
      skip: true,
    },
    sets: {
      query: SetsInEvent,
      variables() {
        return {
          event: this.event || "",
          page: this.setPage,
          perPage: this.perPage,
        };
      },
      update: (data) => data?.event?.sets?.nodes,
      skip: true,
    },
    streamQueue: {
      query: StreamQueue,
      variables() {
        return {
          tourney: this.tournamentSlug,
        };
      },
      update: (data) => data?.tournament?.streamQueue,
      skip: true,
    },
  },
  computed: {
    // if tournament url is valid
    tournamentValid() {
      return urlMatch.test(this.tournament);
    },
    // determine if a tournament is found with that slug
    tournamentNotFound() {
      // only return true if events is empty and events query not loading
      return !this.events && !this.$apolloData.queries.events.loading;
    },
    // formatted list of events for the select element
    eventSelection() {
      if (this.events) {
        return this.events.map((e) => {
          return {
            label: e.name,
            value: e.slug,
          };
        });
      } else {
        return [];
      }
    },
    // formatted list of streams for the select element
    streamSelection() {
      if (this.streamQueue) {
        return this.streamQueue.map((s) => s.stream?.streamName);
      } else {
        return [];
      }
    },
    // formatted list of sets for the select element
    setSelection() {
      // if trying to use streamqueue
      // return sets from the selected stream, if it exists
      if (this.useStreamQueue) {
        if (this.stream) {
          return this.streamQueue
            ?.find((s) => s.stream.streamName === this.stream)
            ?.sets.map((s) => {
              // format the label to give set information
              return {
                label: `[${s.phaseGroup.phase.name}] ${s.fullRoundText} - ${s.slots[0].entrant.participants[0].gamerTag} vs. ${s.slots[1].entrant.participants[0].gamerTag}`,
                value: s.id,
              };
            });
        } else {
          return [];
        }
      } else {
        if (this.sets) {
          // filter sets if showCompleted is set, otherwise just format and return all sets in event
          return this.sets
            .filter(
              (set) =>
                set.slots.every((slot) => slot.entrant !== null) &&
                (this.showCompleted ? true : set.state !== 3)
            )
            .map((s) => {
              return {
                label: `[${s.phaseGroup.phase.name}] ${s.fullRoundText} - ${s.slots[0].entrant.participants[0].gamerTag} vs. ${s.slots[1].entrant.participants[0].gamerTag}`,
                value: s.id,
              };
            });
        } else {
          return [];
        }
      }
    },
    // formatted list of overlays for the select element
    overlaySelection() {
      return Object.keys(overlays).map((overlay) => {
        return {
          label: overlays[overlay].name,
          overlay,
        };
      });
    },
  },
  methods: {
    // send new set ID to the overlay via websocket
    updateSet() {
      if (this.conn) {
        this.conn.send(
          JSON.stringify({
            target: "OVERLAY",
            type: "SET",
            value: this.set?.toString(),
          })
        );
      }
    },
    // send clear signal to the overlay via websocket
    clearSet() {
      this.set = undefined;
      if (this.conn) {
        this.conn.send(
          JSON.stringify({
            target: "OVERLAY",
            type: "CLEAR",
          })
        );
      }
    },
    // fetch the next page of sets from the graphql api
    getMoreSets() {
      // only if the event is valid and more sets exist
      if (this.event && this.moreSets) {
        this.updatePage++;
        this.$apollo.queries.sets.fetchMore({
          // New variables
          variables: {
            event: this.event,
            page: this.updatePage,
            perPage: this.perPage,
          },
          updateQuery: (previousResult, { fetchMoreResult }) => {
            this.moreSets =
              fetchMoreResult.event.sets.pageInfo.page <
              fetchMoreResult.event.sets.pageInfo.totalPages;

            return {
              event: {
                __typename: previousResult.event.__typename,
                id: previousResult.event.id,
                sets: {
                  __typename: previousResult.event.sets.__typename,
                  pageInfo: previousResult.event.sets.pageInfo,
                  nodes: [
                    ...previousResult.event.sets.nodes,
                    ...fetchMoreResult.event.sets.nodes,
                  ],
                },
              },
            };
          },
        });
      }
    },
    showOverlayModal() {
      this.overlayModalVisible = true;
    },
    setOverlay() {
      this.overlayModalVisible = false;
      localStorage.setItem("overlay", this.overlay);

      if (this.conn) {
        this.conn.send(
          JSON.stringify({
            target: "OVERLAY",
            type: "OVERLAY",
            value: this.overlay,
          })
        );
      }
    },
    showCommentatorModal() {
      this.commentatorModalVisible = true;
    },
    hideCommentatorModal() {
      this.commentatorModalVisible = false;
    },
    setToken() {
      this.tokenModalVisible = false;
      localStorage.setItem("api-token", this.token);

      if (this.conn) {
        this.conn.send(
          JSON.stringify({
            target: "OVERLAY",
            type: "TOKEN",
            value: this.token,
          })
        );
      }

      window.location.reload();
    },
    showTokenModal() {
      this.tokenModalVisible = true;
    },
    hasEventLoaded(slug) {
      return !this.event || this.events.some((s) => s.slug === slug);
    },
    hasSetLoaded(id) {
      return !this.set || this.sets.some((s) => s.id === id);
    },
  },
  watch: {
    // when the tournament url is changed, tell the rest of the page what needs to be updated
    tournament() {
      // unest selected stream
      this.stream = undefined;

      // split the url into parts to be used
      const urlParts = urlMatch.exec(this.tournament);

      // if urlParts is valid, it's safe to assume that at least the tournament slug is present
      if (urlParts) {
        // set tournament slug
        this.tournamentSlug = urlParts[1];
        // set event slug if present in url
        this.event = urlParts[2] ? urlParts[1] + urlParts[2] : undefined;
        // set set if present in url
        this.set = parseInt(urlParts[3]) || undefined;
      }

      // if the tournamentSlug is invalid, don't query the API
      this.$apollo.queries.events.skip = !this.tournamentSlug;
      this.$apollo.queries.streamQueue.skip = !this.tournamentSlug;
    },
    // unset current set when using stream queue status changes
    useStreamQueue() {
      this.set = undefined;
    },
    // when event changes, see if set can be pulled from the url
    event() {
      // split url into parts again
      const urlParts = urlMatch.exec(this.tournament);

      // if there is no event specified by the url, unset the set
      if (!urlParts[2]) {
        this.set = undefined;
      }

      // on event changes, reset variables to query the next pages of set data
      this.moreSets = true;
      this.setPage = 1;
      this.updatePage = 1;

      // only query sets from api if event is valid
      this.$apollo.queries.sets.skip = !this.event;
    },
    // sent current bestOf to the overlay
    bestOf() {
      if (this.conn) {
        this.conn.send(
          JSON.stringify({
            target: "OVERLAY",
            type: "BESTOF",
            value: this.bestOf,
          })
        );
      }
    },
    // sent current flip status to the overlay
    flipPlayers() {
      if (this.conn) {
        this.conn.send(
          JSON.stringify({
            target: "OVERLAY",
            type: "FLIP",
            value: this.flipPlayers,
          })
        );
      }
    },
  },
  mounted() {
    // create new websocket on mount
    this.conn = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

    const onOpen = () => console.log("websocket connected");

    // handle websocket messages based on their content
    const onMessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // only handle messages targeting the admin page
        if (data.target === "ADMIN") {
          switch (data.type) {
            // when prompted by initial connection, set the full current state to the overlay
            case "INITIAL":
              if (this.conn) {
                this.conn.send(
                  JSON.stringify({
                    target: "OVERLAY",
                    type: "STATE",
                    value: {
                      set: this.set,
                      overlay: this.overlay,
                      bestOf: this.bestOf,
                      flipPlayers: this.flipPlayers,
                    },
                  })
                );
              }
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
        this.conn = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);
        this.conn.addEventListener("open", onOpen);
        this.conn.addEventListener("message", onMessage);
        this.conn.addEventListener("close", onClose);
      }, 3000);
    };

    // add all event listeners to the socket
    this.conn.addEventListener("open", onOpen);
    this.conn.addEventListener("message", onMessage);
    this.conn.addEventListener("close", onClose);

    // create an interval to keep getting more sets from the paginated sets query
    this.moreSetsInterval = setInterval(() => {
      // getMoreSets has a check to not run if sets are up to date
      this.getMoreSets();
    }, 1 * 1000);

    // pull api token and current overylay from local storage
    this.token = localStorage.getItem("api-token") || undefined;
    this.overlay = localStorage.getItem("overlay") || undefined;
  },
  unmounted() {
    // close websocket
    this.conn.removeEventListener("close", onClose);
    this.conn.close();
    this.conn = null;

    // cancel getMoreSets interval
    clearInterval(this.moreSetsInterval);
  },
  components: {
    CommentatorPage,
  },
};
</script>

<style scoped>
.container {
  margin: auto 4rem;
}

h1 {
  margin: 2rem auto;
}

.selector {
  width: 100%;
  margin-bottom: 24px;
}

.tournament {
  --vs-search-input-placeholder-color: darkgray;
}
</style>
