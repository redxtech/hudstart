export const handleStatic = async (requestEvent: Deno.RequestEvent) => {
	await requestEvent.respondWith(new Response('hello friend', { status: 200 }))
}
