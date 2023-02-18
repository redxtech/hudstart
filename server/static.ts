import { contentType } from 'std/media_types/mod.ts'
import { extname } from 'std/path/mod.ts'
import readFileSync from './assets.js'

export const handleStatic = async (requestEvent: Deno.RequestEvent) => {
	// TODO find better way to handle this
	const isCompiled = Deno.env.get('HUDSTART_PROD') === 'TRUE'

	const BASE_PATH = isCompiled ? 'dist' : '../frontend/dist'
	const pathName = new URL(requestEvent.request.url).pathname
	const filePath = BASE_PATH + (pathName === '/' ? '/index.html' : pathName)

  try {
		const body = isCompiled ? readFileSync(filePath) : await Deno.readFile(filePath);
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

