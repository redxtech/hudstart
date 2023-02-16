import { v1 } from 'std/uuid/mod.ts'

const broadcast = (sockets: Map<string, WebSocket>, message: string, uid: string) => {
	sockets.forEach((socket, id) => {
		if (socket.readyState === WebSocket.OPEN && uid !== id)
			socket.send(message)
	})
}

export const handleSocketReq = (sockets: Map<string, WebSocket>, req: Request): Response => {
	const upgrade = req.headers.get('upgrade') || '';
	if (upgrade.toLowerCase() != 'websocket') {
		return new Response('request isn\'t trying to upgrade to websocket.');
	}

	const { socket, response } = Deno.upgradeWebSocket(req);

	socket.onopen = () => {
		const uid = v1.generate().toString()
		console.log('connected socket:', uid)
		sockets.set(uid, socket)

		socket.onclose = () => {
			console.log('closing socket:', uid)
		}

		socket.onmessage = (e) => {
			console.log('broadcast:', e.data)
			broadcast(sockets, e.data, uid)
		}

		socket.onerror = (e) => {
			console.log('socket errored:', e)
		}
	}

	return response;
}
