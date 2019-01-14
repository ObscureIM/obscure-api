const TurtleCoind = require('turtlecoin-rpc').TurtleCoind

const daemon = new TurtleCoind({
  host: '209.97.174.174', // ip address or hostname of the TurtleCoind host
  port: 11898, // what port is the RPC server running on
  timeout: 2000, // request timeout
  ssl: false // whether we need to connect using SSL/TLS
})


//lets start the getblocks process

// daemon.height().then(function(fufilled) {
//   daemon.getBlocks({
//   height: fufilled.height - 1
//   }).then((blocks) => {
//     console.log(blocks)
//   }).catch(function(error) {
//     console.log(error.message)
//   })
// }).catch(function(error) {
//   console.log(error.message)
// })
//
// //lets get the latest blocks
// daemon.getLastBlockHeader().then(function(fufilled){
//   daemon.getBlock({
//     hash:fufilled.hash
//   }).then((block) => {
//     console.log(block)
//   }).catch(function(error) {
//     console.log(error.message)
//   })
// }).catch(function(error) {
//   console.log(error.message)
// })

//lets get the transaction in the latest block
daemon.getLastBlockHeader().then(function(fufilled){
  daemon.getBlock({
    hash:fufilled.hash
  }).then((block) => {
    console.log(block.transactions)
  }).catch(function(error) {
    console.log(error.message)
  })
}).catch(function(error) {
  console.log(error.message)
})
