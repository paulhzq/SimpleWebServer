// Require Modules
const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

let mimeTypes = {
	"html": "text/html",
	"jpeg": "image/jpeg",
	"jpg" : "image/jpeg",
	"png" : "image/png",
	"js" : "text/javascript",
	"css" : "text/css"
};

http.createServer((req, res)=> {
	const uri = url.parse(req.url).pathname;
	const fileName = path.join(process.cwd(),unescape(uri));
	console.log('Loading' + uri);
	let stats;

	try {
		stats = fs.lstatSync(fileName);
	} catch(e) {
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.write('404 Not Found/n');
		res.end();
		return;
	}

	// Check if file/directory
	if(stats.isFile()){
		const mimeTypes = mimeTypes[path.extname(fileName).split(',').reverse()[0]];
		res.writeHead(200, {'Content-Type': mimeTypes});

		let fileStream = fs.createReadStream(fileName);
		fileStream.pipe(res);
	} else if(stats.isDirectory()) {
		res.writeHead(302,{
			'Location' : 'index.html'
		});
		res.end();
	} else {
		res.writeHead(500, {'Content-Type':'text/plain'});
		res.write('500 Internal Error\n');
		res.end();
	}
}).listen(3000);
// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });