var debug = require('debug')('wb-web:index')
var fs = require('fs')
var https = require('https') // TODO use spdy, baby pouchdb for now...
var url = require('url')
var ecstatic = require('ecstatic')
var request = require('request')

// CERTPATH handy to override in development
var certPath = process.env.CERTPATH || __dirname + '/certs'

// HTTPS setup
var serverOptions = {
  cert: fs.readFileSync(fs.readlinkSync(certPath + '/cert.pem')),
  ca: fs.readFileSync(fs.readlinkSync(certPath + '/chain.pem')),
  key: fs.readFileSync(fs.readlinkSync(certPath + '/privkey.pem'))
}

// Middlewares
var staticMiddleware = ecstatic({
  root: __dirname + '/public',
  gzip: process.env.NODE_ENV === 'production' ? true : false // ecstatic will serve gz versions, otherwise fall back
})

// TODO redirect http to https
// Server
var server = https.createServer(serverOptions, function requestHandler (req, res) {
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

var port = process.env.PORT || 8080
server.listen(port)
debug('Server listening on https://localhost:' + port)
