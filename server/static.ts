import { lookup } from "https://deno.land/x/media_types/mod.ts"

export const handleStatic = async (requestEvent: Deno.RequestEvent) => {
	const BASE_PATH = '../frontend/dist'
	const pathName = new URL(requestEvent.request.url).pathname
	const filePath = BASE_PATH + (pathName === '/' ? '/index.html' : pathName)
	let fileSize;

	console.log(filePath)

  try {
    fileSize = (await Deno.stat(filePath)).size;
  } catch (e) {
    if (e instanceof Deno.errors.NotFound) {
      await requestEvent.respondWith(new Response(null, { status: 404 }))
			return
    }
    await requestEvent.respondWith(new Response(null, { status: 500 }))
			return
  }

  const body = (await Deno.open(filePath)).readable;
  await requestEvent.respondWith(new Response(body, {
    headers: {
      'content-length': fileSize.toString(),
      'content-type': lookup(filePath) || 'application/octet-stream',
    }
  }))



	// const url = new URL(requestEvent.request.url)
	// const path = url.pathname === '/' ? '/index.html' : url.pathname
	// const re = /(?:\.([^.]+))?$/
	// const ext = re.exec(path)?.[1]

	// const file = await Deno.readFile(join(BASE_PATH, path))
	// const contentType = ext === 'svg' ? 'image/svg' : 'text/' + (ext === 'js' ? 'javascript' : ext)

	// try {
	// 	await requestEvent.respondWith(new Response(file, {
	// 		headers: {
	// 			'content-type': contentType
	// 		}
	// 	}))
	// } catch (_e) {
	// 	await requestEvent.respondWith(new Response('hello friend', { status: 200 }))
	// }

}
