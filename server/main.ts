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
			console.log(`path: ${url.pathname}`);

			if (url.pathname === '/ws') {
				await requestEvent.respondWith(handleSocketReq(sockets, requestEvent.request))
			} else {
				await handleStatic(requestEvent)
			}
		}
	}

	const server = Deno.listen({ port: 8080 });

	// open browser windows
	if (Deno.env.get('PRODUCTION') === 'TRUE') {
		open('http://localhost:8080/admin.html')
		open('http://localhost:8080')
	}

	for await (const conn of server) {
		handle(conn);
	}
}

main()

