//required modules
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

//simply for a simple server example

/*
http.createServer(function(req,res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World \n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
*/

//Array of types
var mimeTypes = {
    "html" : "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "css": "text/css"
};

//Create the server
http.createServer(function(req, res){
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(),unescape(uri));

    console.log('Loading' + uri);
    var stats;

    //verify if the path exists
    try {
        stats = fs.lstatSync(fileName);
    } catch (error) {
        res.writeHead(404, {'Content-type': 'text/plain'});
        res.write('404 Not Found\n');
        res.end();
        return;
    }

    //check file/directory
    if(stats.isFile()){
        var mimeType = mimeTypes[path.extname(fileName).split(".").reverse()[0]];
        res.writeHead(200, {'Content-type': mimeType});

        var fileStream = fs.createReadStream(fileName);
        fileStream.pipe(res);
    }else if(stats.isDirectory()){
        res.writeHead(302,{
            'Location': 'index.html'
        });
        res.end();
    }else{
        res.writehead(500, {'Content-type': 'text/plain'});
        res.write('500 Internal Error\n');
        res.end();
    }
}).listen(3000);