/*
	Simple HTTP server that serves files from the current directory, simulating Github Pages behaviour.
	For development purposes only.

	Credits: Professor João Cardoso, Web Development 2026, DEI-UC
*/

const fs = require('fs').promises
const path = require('path')
const http = require('http')

const PORT = 3000

const contentTypes = {
	'.html': 'text/html',
	'.css': 'text/css',
	'.md': 'text/plain',
	'.js': 'application/javascript',
	'.json': 'application/json',
	'.pdf': 'application/pdf',
	'.jpg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.svg': 'image/svg+xml',
	'.webm': 'video/webm'
}

async function serve(request, response) {
	let [path, extension] = redirect(request.url)
	
	if (await fileExists(path)) {
		response.writeHead(200, {'Content-Type': contentTypes[extension]})
		response.end(await fs.readFile(path))
	} else {
		response.writeHead(404, {'Content-Type': 'text/plain'})
		response.end('404 not found')
	}
}

function redirect(url) {
	if (url == '/') {
		return ['index.html', '.html']
	} else {
		let extension = path.extname(url)
		if (extension == '')
			return [url.slice(1) + '.html', '.html']

		return [url.slice(1), extension]
	}
}

async function fileExists(path) {
	return fs.access(path).then(() => true).catch(() => false)
}

http.createServer(serve).listen(PORT, () => console.log(`Server running at http://localhost:${PORT}/`))