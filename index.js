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
server.listen(8080);
debug('Server lisening on 8080');
