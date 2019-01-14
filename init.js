var express = require("express");

var app = express();

//Initialize the app
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  })


const TurtleCoind = require('turtlecoin-rpc').TurtleCoind

const daemon = new TurtleCoind({
  host: '209.97.174.174', // ip address or hostname of the TurtleCoind host
  port: 11898, // what port is the RPC server running on
  timeout: 2000, // request timeout
  ssl: false // whether we need to connect using SSL/TLS
})

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get('/api/latest', function (req, res) {
  //res.send('Obsidian Blockchain API')
  //lets get the latest blocks
  daemon.getLastBlockHeader().then(function(fufilled){
    daemon.getBlock({
      hash:fufilled.hash
    }).then((block) => {
      res.send(block)
    }).catch(function(error) {
      res.send(error.message)
    })
  }).catch(function(error) {
    res.send(error.message)
  })
})

app.get("/api/getblocks", function(req, res) {
  //get a list of the 30 latest blocks
  daemon.height().then(function(fufilled) {
    daemon.getBlocks({
    height: fufilled.height - 1
    }).then((blocks) => {
      res.send(blocks)
    }).catch(function(error) {
      res.send(error.message)
    })
  }).catch(function(error) {
    res.send(error.message)
  })
});
