import 'std/dotenv/load.ts'
import { open } from 'open/index.ts'

import { handleSocketReq } from './sockets.ts'
import { handleStatic } from './static.ts'

// main function
const main = async () => {
	// keep track of all open sockets
	const sockets = new Map<string, WebSocket>()

	// handle all connections to the webserver
	async function handle(conn: Deno.Conn) {
		const httpConn = Deno.serveHttp(conn)

		for await (const requestEvent of httpConn) {
			// parse the url to determine what will handle the request
			const url = new URL(requestEvent.request.url)

			// if requesting /ws, hand off to the websocket handler
			// otherwise, use the static file server
			if (url.pathname === '/ws') {
				await requestEvent.respondWith(
					handleSocketReq(sockets, requestEvent.request),
				)
			} else {
				await handleStatic(requestEvent)
			}
		}
	}

	// get the port from env variables, default to 6875
	const port = parseInt(Deno.env.get('HUDSTART_PORT') || '6875')

	// start up the server and log it
	const server = Deno.listen({ port })
	console.log('listening on port', port)

	// open browser windows if running prod
	if (Deno.env.get('HUDSTART_PROD') !== 'FALSE') {
		open(`http://localhost:${port}`)
		open(`http://localhost:${port}/admin.html`)
	}

	// handle each connection of the server
	for await (const conn of server) {
		handle(conn)
	}
}

main()
