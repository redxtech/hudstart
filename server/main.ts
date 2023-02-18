import 'std/dotenv/load.ts'
import { open } from 'open/index.ts'

import { handleSocketReq } from './sockets.ts'
import { handleStatic } from './static.ts';

// main function
const main = async () => {
	// keep track of sockets
	const sockets = new Map<string, WebSocket>()

	async function handle(conn: Deno.Conn) {
		const httpConn = Deno.serveHttp(conn);
		for await (const requestEvent of httpConn) {
			const url = new URL(requestEvent.request.url);

			if (url.pathname === '/ws') {
				await requestEvent.respondWith(handleSocketReq(sockets, requestEvent.request))
			} else {
				await handleStatic(requestEvent)
			}
		}
	}

	const port = parseInt(Deno.env.get('HUDSTART_PORT') || '8080')

	const server = Deno.listen({ port });

	console.log('listening on port', port)

	// open browser windows
	if (Deno.env.get('HUDSTART_PROD') === 'TRUE') {
		open(`http://localhost:${port}`)
		open(`http://localhost:${port}/admin.html`)
	}

	for await (const conn of server) {
		handle(conn);
	}
}

main()

