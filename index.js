var debug = require('debug')('wb-web:index');
var http = require('http');
var ecstatic = require('ecstatic');

// Middlewares
var staticMiddleware = ecstatic({ root: __dirname + '/public' });

// Server
var server = http.createServer(function requestHandler (req, res) {
    staticMiddleware(req, res);
});

// Start server
var port = process.env.PORT;
server.listen(port || 8080);
debug('Server listening on ' + port);
