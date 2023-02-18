import { contentType } from 'std/media_types/mod.ts'
import { extname } from 'std/path/mod.ts'

export const handleStatic = async (requestEvent: Deno.RequestEvent) => {
	const BASE_PATH = '../frontend/dist'
	const pathName = new URL(requestEvent.request.url).pathname
	const filePath = BASE_PATH + (pathName === '/' ? '/index.html' : pathName)

	console.log(filePath)

  try {
		const body = await Deno.readFile(filePath);
		await requestEvent.respondWith(new Response(body, {
			headers: {
				'content-type': contentType(extname(filePath)) || 'application/octet-stream',
			}
		}))
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      await requestEvent.respondWith(new Response(null, { status: 404 }))
			return
    }
    await requestEvent.respondWith(new Response(null, { status: 500 }))
			return
  }

}

