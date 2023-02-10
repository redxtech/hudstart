// calls start.gg api for live data on a current match for use in a HUD for a stream element
import 'std/dotenv/load.ts'

import { getEvents } from './api.ts'


// main function
const main = async () => {
	// data
	const tourney = 'tournament/hudstart-test-tourney-01'

	const eventList = await getEvents(tourney)

	console.log(eventList)
}

main()

