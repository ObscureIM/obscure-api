var express = require("express");

var app = express();
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain)
//Initialize the app
var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  })


const TurtleCoind = require('turtlecoin-rpc').TurtleCoind

const daemon = new TurtleCoind({
  host: '142.93.67.56', // ip address or hostname of the TurtleCoind host
  port: 11898, // what port is the RPC server running on
  timeout: 2000, // request timeout
  ssl: false, // whether we need to connect using SSL/TLS
  enableCors: true
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
 //lets get transactions in the latest block
 app.get('/api/latestTransactions', function (req, res) {
   //res.send('Obsidian Blockchain API')
   //lets get the latest blocks
   daemon.getLastBlockHeader().then(function(fufilled){
     daemon.getBlock({
       hash:fufilled.hash
     }).then((block) => {
       res.send(block.transactions)
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

//get the block when a call with height is used
app.get("/api/block",function(req,res) {
  //make sure to call /api/block?height=12345
  //get the block header by height
  daemon.getBlockHeaderByHeight({
    height:parseInt(req.query.height)
  }).then(function(fufilled) {
    daemon.getBlock({
      hash:fufilled.hash
    }).then((block) => {
      res.send(block)
    }).catch(function(error) {
      res.send(error.message)
    })
  })
})

//get a block using block hash
app.get("/api/blockByHash",function(req,res) {
  //make sure to call /api/blockByHash?hash=12345
  //test hash c7a0878fb61f544217e4eb10e51f5e513845afbb18310f3649646712474779a5
  daemon.getBlock({
    hash:req.query.hash
  }).then((block) => {
    res.send(block)
  }).catch(function(error) {
    res.send(error.message)
  })
})

app.get("/api/blockByTxHash",function(req,res) {
  //make sure to call /api/blockByTxHash?TxHash=7890
  //test txhash = 669dd6efcb356defa5c61c91f4494639f890aaab8d5019f26c5934054e7d2a14
  //by tx hash will populate the input and output
  daemon.getTransaction({
    hash:req.query.TxHash
  }).then((block) => {
    res.send(block)
  }).catch(function(error) {
    res.send(error.message)
  })
})
