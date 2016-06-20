
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;

app.use(express.static('public'));

http.listen(port, function(){
  console.log(`webserver listening on *:${port}`);
});

const auctions = [];

const items = [
  {
    name: 'Bike',
    picture: 'https://upload.wikimedia.org/wikipedia/commons/c/c6/A_mountain_bike_styled_e-bike,_Cyclotricity_Stealth.jpg',
    description: 'This awesome bike is very awesome, and it can fly (not really)...'
  },
  {
    name: '1.000.000 $',
    picture: 'https://consumermediallc.files.wordpress.com/2012/06/heapocash.jpg',
    descriotion: 'Wow, that sure is a lot of money....'
  },
  {
    name: 'Funny & cute dead squirrel',
    picture: 'https://i.ytimg.com/vi/ICE9Qe8HrqE/hqdefault.jpg',
    descriotion: 'Kids love it, adults love it, you will love it too!!'
  },
  {
    name: 'Slave',
    picture: 'http://cdn.modernghana.com/images/content/slavesscar65.jpg',
    descriotion: 'We all need a helping hand sometimes!'
  }
]

//initialize all auctions
for(var i = 0; i < 4 ; i++){
  var d = new Date();
  d.setMinutes(d.getMinutes() + 5);
  auctions.push({
    item: items[i],
    endDate: d
  });
}

// io.on('connection', function(socket){
//   console.log('a user connected');
//
//   socket.on('chat message', function(msg){
//     console.log("got message '${msg}', broadcasting to all");
//     io.emit('chat message', msg);
//   });
//
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });

io.sockets.on('connection', function (socket) {
  //We do not keep track of users or connections...
  socket.on('signin', function(data){

  });

});

// export app so we can test it
exports = module.exports = app;
