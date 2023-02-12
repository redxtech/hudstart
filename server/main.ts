// calls start.gg api for live data on a current match for use in a HUD for a stream element
import { serve } from "https://deno.land/std@0.87.0/http/server.ts"
import {
		acceptWebSocket,
		WebSocket,
		isWebSocketCloseEvent

} from "https://deno.land/std@0.87.0/ws/mod.ts"

import { v1 } from 'std/uuid/mod.ts'
import 'std/dotenv/load.ts'

// main function
const main = async () => {
	const sockets = new Map<string, WebSocket>()

	const broadcastMessage = (message: string, uid: string) => {
		sockets.forEach((socket, id) => {
			if (!socket.isClosed && uid !== id)
				socket.send(message)
		})
	}

	const handleWs = async (sock: WebSocket) => {
		const uid = v1.generate().toString()
		console.log('connected: ' + uid)
		sockets.set(uid, sock)

		for await (const ev of sock) {
			if (isWebSocketCloseEvent(ev)) {
				sockets.delete(uid)
				return
			}

			if (typeof ev === 'string') {
				console.log(ev)
				broadcastMessage(ev, uid)
			}
		}
	}

	for await (const req of serve({ port: 8080 })) {
			const { conn, r: bufReader, w: bufWriter, headers } = req;

			acceptWebSocket({
					conn,
					bufReader,
					bufWriter,
					headers,
			}).then(handleWs)
			// .catch(console.error)
	}
}

main()

