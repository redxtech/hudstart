// calls start.gg api for live data on a current match for use in a HUD for a stream element
import { WebSocketClient, WebSocketServer } from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import 'std/dotenv/load.ts'

// main function
const main = () => {
	const wss = new WebSocketServer(8080)
	wss.on("connection", function (ws: WebSocketClient) {
		ws.on("message", function (message: string) {
			console.log(message)
			ws.send(message)
		})
		setTimeout(() => {
			ws.send(JSON.stringify({
				target: 'OVERLAY',
				setID: '56902969'
			}))
		}, 2000)
		setTimeout(() => {
			ws.send(JSON.stringify({
				target: 'OVERLAY',
				setID: '56794669'
			}))
		}, 5000)
	})
}

main()

