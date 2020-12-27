const sha256 = require('crypto-js/sha256')
const sha1 = require('simple-sha1')
var Server = require('bittorrent-tracker').Server

const port = 4400;
const hostname = '0.0.0.0'

const topic = Buffer.from(sha256('peernet-v0.1.0').toString())
let _infoHash = sha1.sync(topic.slice(0, 20)).toLowerCase()
// _infoHash = _infoHash.toLowerCase()
const _infoHashBuffer = Buffer.from(_infoHash, 'hex')
const _infoHashBinary = _infoHashBuffer.toString('binary')

var server = new Server({
  udp: false, // enable udp server? [default=true]
  http: true, // enable http server? [default=true]
  ws: true, // enable websocket server? [default=true]
  stats: true, // enable web-based statistics? [default=true]
  filter: function (infoHash, params, cb) {
    if (infoHash === _infoHash) {
      cb(null)
    } else {
      cb(new Error('disallowed'))
    }
  }
})

server.on('error', function (err) {
  // fatal server error!
  console.log(err.message)
})

server.on('warning', function (err) {
  // client sent bad data. probably not a problem, just a buggy client.
  console.log(err.message)
})

server.on('listening', function () {
  // fired when all requested servers are listening
  console.log('listening on http port:' + server.http.address().port)
  console.log('listening on ws port:' + server.ws.address().port)
})

// start tracker server listening! Use 0 to listen on a random free port.
server.listen(port, hostname)

// listen for individual tracker messages from peers:
server.on('start', function (addr) {
  console.log('got start message from ' + addr)
})
//
// server.on('complete', function (addr) {})
// server.on('update', function (addr) {})
// server.on('stop', function (addr) {})
