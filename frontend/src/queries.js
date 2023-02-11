import gql from 'graphql-tag'

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

