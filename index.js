
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3001;

app.use(express.static('public'));

http.listen(port, function(){
  console.log("webserver listening on *:${port}");
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
    description: 'Wow, that sure is a lot of money....'
  },
  {
    name: 'Funny & cute dead squirrel',
    picture: 'https://i.ytimg.com/vi/ICE9Qe8HrqE/hqdefault.jpg',
    description: 'Kids love it, adults love it, you will love it too!!'
  },
  {
    name: 'Slave',
    picture: 'http://cdn.modernghana.com/images/content/slavesscar65.jpg',
    description: 'We all need a helping hand sometimes!'
  }
]

const maxMins = 60*60;
const minMins = 3*60;

const minToRestart = 5;

//initialize all auctions
for(var i = 0; i < 4 ; i++){
  var d = new Date();
  var seconds = Math.floor((Math.random() * (maxMins-minMins)) + minMins);
  d.setSeconds(d.getSeconds() + seconds);
  auctions.push({
    item: items[i],
    endDate: d
  });
  var timeout = 1000*seconds;
  (() => {
    let index = i;
    setTimeout(function(){
      resetAuction(index);
    }, timeout);
  })();

}

var resetAuction = function(index){

  auctions[index].ended = true;

  if(auctions[index].bids){
    var temp = auctions[index].bids.reduce((latest, current) => {
      var existent = latest.find(item => item.value == current.value);
      if(existent){
        existent.count++;
        existent.users.push(current.user);
      }
      else{
        latest.push({
          value: current.value,
          users: [current.user],
          count: 1
        });
      }
      return latest;
    }, []).filter(item => item.count == 1).sort((a, b) => a.value - b.value )[0];
  }

  if(temp){
    auctions[index].winner = temp.users[0];
    auctions[index].value = temp.value
  }

  io.emit('auction_ended', {
    number: index,
    winner: temp ? temp.users[0] : null,
    value: temp ? temp.value : null
  });



  setTimeout(function(){
    var d = new Date();
    var seconds = Math.floor((Math.random() * (maxMins-minMins)) + minMins);
    d.setSeconds(d.getSeconds() + seconds);
    auctions[index] = {
      item: items[index],
      endDate: d
    }
    setTimeout(function(){
      resetAuction(index);
    }, 1000*seconds);

    io.emit('auction_updated', {
      number: index,
      auction: auctions[index]
    });
  }, 1000*60*minToRestart)


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

//TOKEN GENERATOR
var generateToken = function (){
  var tokenString =["a","b","c","d","e","f","g","h","i","j","k","l","m","n"]
  var token = "";
  for(var i = 0; i < 10; i++){
    var tokenCharacter = tokenString[Math.floor(Math.random()*tokenString.length)];
    token = token + tokenCharacter;
  }
  console.log(token)

  return token;
};

io.sockets.on('connection', function (socket) {
  //We do not keep track of users or connections..
  // console.log("connection")
  socket.on('signin', function(data){
    console.log("signing user in on the backend")

    var token = generateToken();
    var name = data.name;
    // console.log(data.name)
    socket.emit ("signedIn", {token: token, name: name})


  });

  socket.on('get_auctions', function(){
    socket.emit('auction_list', auctions);
  });

  socket.on('bid', function(data){
    auctions[data.number].bids = auctions[data.number].bids || [];
    auctions[data.number].bids.push({
      user: data.user,
      value: data.value
    })
  });

});

// export app so we can test it
exports = module.exports = app;
