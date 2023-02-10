// library of functions used to pull data from the smash.gg api

// variables needed to interact with the api
const api = 'https://api.start.gg/gql/alpha'
const token = Deno.env.get('TOKEN')

// general function used to build all other queries
const sendQuery = async (query: string, variables: Object): Object => {
	const response = await fetch(api, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': 'Bearer ' + token
		},
		body: JSON.stringify({
			query,
			variables
		})
	})

	// TODO add error handling for when no events?
	const resp = await response.json()
	return resp.data
}

const EventsQuery = `
query TournamentEvents($tourney: String!) {
  tournament(slug: $tourney) {
    events {
      id
      name
			slug
    }
  }
}`

export const getEvents = async (tourney: String) => {
	const results = await sendQuery(EventsQuery, { tourney })
	const events = results.tournament.events

	return events
}
