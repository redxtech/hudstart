import { v1 } from 'std/uuid/mod.ts'

// broadcast a message to all connected sockets
const broadcast = (
	sockets: Map<string, WebSocket>,
	message: string,
	uid: string,
) => {
	sockets.forEach((socket, id) => {
		if (socket.readyState === WebSocket.OPEN && uid !== id) {
			socket.send(message)
		}
	})
}

// handler function for all websockets
export const handleSocketReq = (
	sockets: Map<string, WebSocket>,
	req: Request,
): Response => {
	// make sure it's actually trying to connect to a websocket
	const upgrade = req.headers.get('upgrade') || ''
	if (upgrade.toLowerCase() !== 'websocket') {
		return new Response('request isn\'t trying to upgrade to websocket.')
	}

	// upgrade the connection to a websocket
	const { socket, response } = Deno.upgradeWebSocket(req)

	// some handling for each new socket
	socket.onopen = () => {
		// give each socket a unique uid and add it to the sockets map
		const uid = v1.generate().toString()
		console.log('connected socket:', uid)
		sockets.set(uid, socket)

		// log important events
		socket.onclose = () => {
			console.log('closing socket:', uid)
		}

		// on each message, forward it to all other connect sockets
		socket.onmessage = (e) => {
			console.log('broadcast:', e.data)
			broadcast(sockets, e.data, uid)
		}

		// log error events
		socket.onerror = (e) => {
			console.log('socket errored:', e)
		}
	}

	return response
}
