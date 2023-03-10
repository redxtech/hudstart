// define queries for use in the app

import gql from 'graphql-tag'

export const EventsInTourney = gql`
query EventsInTourney($tourney: String!) {
  tournament(slug: $tourney) {
		id
    name
    events {
      id
      slug
      name
    }
  }
}
`

export const StreamQueue = gql`
query StreamQueue($tourney: String!) {
  tournament(slug: $tourney) {
    id
    streamQueue {
      stream {
        streamSource
        streamName
      }
      sets {
        id
        fullRoundText
        phaseGroup {
          phase {
            name
          }
        }
        slots {
          entrant {
            participants {
              gamerTag
            }
          }
        }
      }
    }
  }
}
`

export const SetsInEvent = gql`
query SetsInEvent($event: String!, $page: Int!, $perPage: Int!) {
  event(slug: $event) {
    id
    sets (
      page: $page
      perPage: $perPage
      sortType: STANDARD
    ) {
			pageInfo {
        totalPages
				page
      }
      nodes {
        id
				state
        fullRoundText
				phaseGroup {
          phase {
            name
          }
        }
        slots {
          entrant {
						participants {
							gamerTag
						}
          }
        }
      }
    }
  }
}
`

export const InProgressSet = gql`
query InProgressSet($set: ID!) {
  set(id: $set) {
		id
    state
		fullRoundText
		setGamesType
    totalGames
		event {
			name
      videogame {
        slug
      }
    }
    slots {
      entrant {
				id
        name
        participants {
          id
          gamerTag
          prefix
					player {
            id
            user {
              id
              authorizations(types: [TWITTER]) {
                id
                externalUsername
                type
              }
            }
          }
        }
      }
      standing {
        stats {
          score {
            value
          }
        }
      }
    }
    games {
      id
      selections {
        id
        entrant {
          id
        }
        selectionType
        selectionValue
      }
    }
  }
}
`

export const CharacterList = gql`
query CharacterList($game: String!) {
  videogame(slug: $game) {
    displayName
    characters {
      id
      name
      images {
        url
      }
    }
  }
}
`

