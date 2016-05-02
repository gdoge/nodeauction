
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static('public'));

http.listen(port, function(){
  console.log("webserver listening on *:${port}");
});


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
//
const initialCountdown = 30;
var countdown = initialCountdown;
var numbers = {};

setInterval(function() {
  countdown--;
  io.sockets.emit('timer', { countdown: countdown });

  if(countdown <= 0){

    countdown = initialCountdown;

    var winner;

    for(var number in numbers){

      if(numbers[number].length == 1){
        if(!winner || winner > number ){
          winner = number;

        }
      }

    }

    if(winner){
      io.sockets.emit('winner', {name: numbers[winner][0], number: winner })
    }

    numbers = {}

  }
}, 1000);


io.sockets.on('connection', function (socket) {
  socket.on('reset', function (data) {
    countdown = initialCountdown;
    io.sockets.emit('timer', { countdown: countdown });
  });

  socket.on('enter_number', function(message){



   console.log('got message ${message}, broadcasting to all');

                        if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
                          //  return res.json({"responseCode" : 1,"responseDesc" : "Please select captcha"});
                          }
                          // Put your secret key here.
                          var secretKey = "6LcQ2B4TAAAAANjWiObVOTBz1eQo67omwxUhwiuU";
                          // req.connection.remoteAddress will provide IP address of connected user.
                          var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
                          // Hitting GET request to the URL, Google will respond with success or error scenario.
                          request(verificationUrl,function(error,response,body) {
                            body = JSON.parse(body);
                            // Success will be true or false depending upon captcha validation.
                            if(body.success !== undefined && !body.success) {
                              return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
                            }else{
                              io.emit('enter_number', message.number);
                              numbers[message.number] = numbers[message.number] ? numbers[message.number].push(message.name) :[message.name];
                              console.log(JSON.stringify(numbers));
                            }
                            res.json({"responseCode" : 0,"responseDesc" : "Sucess"});
                          });


  });
});

// export app so we can test it
exports = module.exports = app;
