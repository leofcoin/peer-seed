var Server = require('bittorrent-tracker').Server
const port = 4400;
const hostname = '0.0.0.0'

var server = new Server({
  udp: false, // enable udp server? [default=true]
  http: true, // enable http server? [default=true]
  ws: true, // enable websocket server? [default=true]
  stats: true, // enable web-based statistics? [default=true]
  filter: function (infoHash, params, cb) {
    // Blacklist/whitelist function for allowing/disallowing torrents. If this option is
    // omitted, all torrents are allowed. It is possible to interface with a database or
    // external system before deciding to allow/deny, because this function is async.

    // It is possible to block by peer id (whitelisting torrent clients) or by secret
    // key (private trackers). Full access to the original HTTP/UDP request parameters
    // are available in `params`.

    // This example only allows one torrent.
    // if (infoHash === 'aaa67059ed6bd08362da625b3ae77f6f4a075aaa') {
    //   // If the callback is passed `null`, the torrent will be allowed.
    //   cb(null)
    // } else {
    //   // If the callback is passed an `Error` object, the torrent will be disallowed
    //   // and the error's `message` property will be given as the reason.
    //   cb(new Error('disallowed torrent'))
    // }
    cb(null)
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