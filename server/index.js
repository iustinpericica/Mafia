const Express = require('express');
const App = Express();
const Socket = require('socket.io');
const Cors = require('cors');

let rooms = [];

App.use(Cors());

App.get('/home', (req, res)=>{

  res.sendFile(__dirname + '/index.html');

});

const server = App.listen(3000, (err)=>{
  if(err)throw err;
  else console.log('Socket.io is running perfectly just fine!');
});

const ServerIo = new Socket(server);

ServerIo.on('connection', function(socket){

  socket.on('createGame', function(user){

    if(!rooms.find((x) => x.code === user.code)){

      rooms.push({
        code:user.code,
        admin:socket.id,
        players:[{

          id:socket.id,
          name:user.name,
          role:null,
          died:false,
          admin:true,
          speaker:false

        }]

      });

      ServerIo.to(socket.id).emit('gameCreatedSuccess', {code: user.code, id:socket.id});

       // Enter the room
      socket.join(user.code);
      ServerIo.to(user.code).emit('newUser', {id: socket.id, name : user.name});

    }
    else {
      console.log('da');
      ServerIo.to(socket.id).emit('gameAlreadyExists', user.code);
    }

  });
  // above i have implemented the code for "createGame"



  // down | i implement the code for connect to a game
  socket.on('connectToGame', function(user){

    // user.code, user.name


    if(rooms.find((x) => x.code === user.code)){

       let id = rooms.findIndex((x) => x.code === user.code);

       rooms[id].players.push({
         id:socket.id,
         name:user.name,
         died:false,
         role:null,
         admin:false,
         speaker:false
       });

       ServerIo.to(socket.id).emit('gameEnterSuccess',{code: user.code, id:socket.id});

      // Intru in room
       socket.join(user.code);
       console.log('emitting..to channel');
       ServerIo.to(user.code).emit('newUser', {id: socket.id, name : user.name});

      }
    else {

      ServerIo.to(socket.id).emit('wrongCode', user.code);
    }


  });

  socket.on('requestPlayers', function(code){

    let id = rooms.findIndex((x) => x.code === code);
    ServerIo.to(socket.id).emit('requestedPlayers', rooms[id].players);

  });



  socket.on('makeSpeaker', function(speakerId, code){
    if(rooms.find(x => (x.admin === socket.id && x.code === code))){

      let index = rooms.findIndex((x) => x.admin === socket.id);
      rooms[index].speaker = speakerId;

      let index2 = rooms[index].players.findIndex((x) => x.id === socket.id);
      rooms[index].players[index2].speaker = true;

      ServerIo.to(code).emit('speaker', speakerId); //returnez id ul speakerului

    }
  });

});

