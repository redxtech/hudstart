import gql from 'graphql-tag'

export const EventsInTourney = gql`
query EventsInTourney($tourney: String!) {
  tournament(slug: $tourney) {
    name
    events {
      id
      slug
      name
    }
  }
}
`

export const SetsInEvent = gql`
query EventSets($event: String!) {
  event(slug: $event) {
    id
    sets (
      page: 1
      perPage: 30
      sortType: STANDARD
    ) {
      nodes {
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

export const InProgressSet = gql`
query InProgressSet($set: ID!) {
  set(id: $set) {
    state
		fullRoundText
		setGamesType
    totalGames
		event {
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

