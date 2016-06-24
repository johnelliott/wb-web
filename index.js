var debug = require('debug')('wb-web:index')
var http = require('http')
var url = require('url')
var ecstatic = require('ecstatic')
var request = require('request')

// Middlewares
var staticMiddleware = ecstatic({
  root: __dirname + '/public',
  gzip: true
})

// Server
var server = http.createServer(function requestHandler (req, res) {
  if (req.url.match(/\/api/)) {
    var urlParts = url.parse(req.url)
    // TODO remove hacky slice
    var apiBase = '/api'
    var urlResolved = url.resolve(apiBase, 'http://127.0.0.1:5984/data' + urlParts.path.slice(apiBase.length))
    req.pipe(request(urlResolved)).pipe(res)
  } else {
    staticMiddleware(req, res)
  }
})

// Start server
var port = process.env.PORT || 8080
server.listen(port)
debug('Server listening on http://localhost:' + port)
