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
        gameStart:false,
        Deck:{},
        players:[{

          id:socket.id,
          name:user.name,
          civilians:0,
          mafias:0,
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



  socket.on('makeSpeaker', function(speaker){
    // speakerId, code in object
    if(rooms.find(x => (x.admin === socket.id && x.code === speaker.code))){
      // verific daca e admin si daca e codul corect

      let index = rooms.findIndex((x) => x.admin === socket.id); //indexul de la admin din array
      rooms[index].speaker = speaker.speakerId; // specific speakerul in acel room

      let index2 = rooms[index].players.findIndex((x) => x.id === speaker.speakerId); //iau indexul de la playerul din arrayul players din acel room
      rooms[index].players[index2].speaker = true;

      ServerIo.to(speaker.code).emit('speaker', speaker.speakerId); //returnez id ul speakerului

    }
  });

  socket.on('startGame', function(obiect){
    // obiect: code, deck

    if(rooms.find(x => (x.admin === socket.id && x.code === obiect.code))){

      let index = rooms.findIndex((x) => (x.admin === socket.id && x.code === obiect.code)); //indexul de la admin din array
      rooms[index].gameStart = true;
      rooms[index].Deck = obiect.Deck;

      let roles = [];

      for(let i  = 1;i <= obiect.Deck.bystanders; ++i)roles.push('bystander');
      for(let i  = 1;i <= obiect.Deck.thugs; ++i)roles.push('thug');
      for(i of obiect.Deck.mobsters)roles.push(i);
      for(i of obiect.Deck.leaders)roles.push(i);
      for(i of obiect.Deck.specialists)roles.push(i);

      console.log(roles);
      let random = [];
      // a se trimite cartile

      for(let i = 0;i<roles.length;++i){

        let y = Math.round(Math.random(1) * (roles.length - 1));
        while(random.find(x => x == y)){
          y = Math.round(Math.random(1) * (roles.length - 1));
        }
        random[i] = y;
      }

      // in random am randomizarea pe array

      // roles, random -> trimit

      for(i in rooms[index].players){
        if(rooms[index].players[i] == true)continue;
        if(roles[random[i]] == 'thug' || roles[random[i]] ==  'thief' || roles[random[i]] ==  'godfather' || roles[random[i]] ==  'lawyer' || roles[random[i]] ==  'snitch' || roles[random[i]] == 'impostor')rooms[index].mafias++;
        else rooms[index].civilians++;
        ServerIo.to(rooms[index].players[i].id).emit('receiveCard', roles[random[i]]);
      }

      }
  });

});

