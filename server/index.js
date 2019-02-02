const Express = require('express');
const App = Express();
const Socket = require('socket.io');
const Cors = require('cors');

let rooms = [];

let order = ['vixen', 'thief', 'snitch', 'nurse', 'bodyguard', 'lawyer', 'thug', 'jailer', 'priest', 'detective', 'judge', 'sheriff', 'journalist', 'godfather', 'hypnotist', 'endNight', 'voteTime', 'newNight'];
let numberOrder = order.length - 1;


let rolesWithEdAbilities = {
  jail:'jailed',
  kill:'killed',
  investigate:'investigated',
  save:'saved',
  protect:'protected',
  seduce:'seduced',
  hypnotistst: 'hypnotized',
  research:'researched',
  block:'blocked',
  silence:'silenced',
  badmouth:'badmouthed'

}

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

      let index = rooms.length;

      rooms.push({
        code:user.code,
        admin:socket.id,
        gameStart:false,
        roles:[],
        index:index,
        nightDeck: {},
        numberOrderNight:0,
        Deck:{},
        rolesWithId:{},
        bystanders:[],
        thugs:[],
        mafias:0,
        civilians:0,
        speaker:null,
        players:[{

          id:socket.id,
          name:user.name,
          role:null,
          died:false,
          admin:true,
          speaker:false

        }]

      });

      ServerIo.to(socket.id).emit('gameCreatedSuccess', {code: user.code, id:socket.id, index:rooms.length - 1});

       // Enter the room
      socket.join(user.code);
      ServerIo.to(user.code).emit('newUser', {id: socket.id, name : user.name});

    }
    else {
      //console.log('da');
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

       ServerIo.to(socket.id).emit('gameEnterSuccess',{code: user.code, id:socket.id, index:rooms[id].index});

      // Intru in room
       socket.join(user.code);
       //console.log('emitting..to channel');
       ServerIo.to(user.code).emit('newUser', {id: socket.id, name : user.name});

      }
    else {

      ServerIo.to(socket.id).emit('wrongCode', user.code);
    }


  });

  socket.on('requestPlayers', function(index){

    ServerIo.to(socket.id).emit('requestedPlayers', rooms[index].players);

  });



  socket.on('makeSpeaker', function(obiect){
    // speakerId, index in object
    if(rooms[obiect.index].admin === socket.id){
      // verific daca e admin si daca e codul corect

      rooms[obiect.index].speaker = obiect.speakerId; // specific speakerul in acel room

      let index2 = rooms[obiect.index].players.findIndex((x) => x.id === obiect.speakerId); //iau indexul de la playerul din arrayul players din acel room
      rooms[obiect.index].players[index2].speaker = true;

      ServerIo.to(rooms[obiect.index].code).emit('speaker', obiect.speakerId); //returnez id ul speakerului

    }
  });

  socket.on('startGame', function(obiect){
    // obiect: index, Deck
    console.log(obiect.Deck);
    if(rooms[obiect.index].admin === socket.id){

      rooms[obiect.index].gameStart = true;
      rooms[obiect.index].Deck = obiect.Deck;

      let roles = [];

      let index = obiect.index;

      if(obiect.Deck.bystanders > 0) rooms[index].roles.push('bystander');
      if(obiect.Deck.thugs > 0) rooms[index].roles.push('thug');
      for(i of obiect.Deck.mobsters)rooms[index].roles.push(i);
      for(i of obiect.Deck.leaders)rooms[index].roles.push(i);
      for(i of obiect.Deck.specialists)rooms[index].roles.push(i);


      for(let i  = 1;i <= obiect.Deck.bystanders; ++i)roles.push('bystander');
      for(let i  = 1;i <= obiect.Deck.thugs; ++i)roles.push('thug');
      for(i of obiect.Deck.mobsters)roles.push(i);
      for(i of obiect.Deck.leaders)roles.push(i);
      for(i of obiect.Deck.specialists)roles.push(i);

      //console.log(roles);
      let random = [];
      // a se trimite cartile

      for(let i = 0;i<roles.length;++i){

        let y = Math.round(Math.random(1) * (roles.length - 1));
        while(random.find(x => x == y) !== undefined){
          //console.log("x vechi: ", x, "y vechi: ", y );
          y = Math.round(Math.random(1) * (roles.length - 1));
        }
        random[i] = y;
      }

      // in random am randomizarea pe array

      // roles, random -> trimit

      let k = -1;

      console.log(random);

      for(i in rooms[index].players){
        if(rooms[index].players[i].speaker == true){continue;}
        if(roles[random[k+1]] == 'thug' || roles[random[k+1]] ==  'thief' || roles[random[k+1]] ==  'godfather' || roles[random[k+1]] ==  'lawyer' || roles[random[k+1]] ==  'snitch' || roles[random[k+1]] == 'impostor') rooms[index].mafias++;
        else rooms[index].civilians++;

        if(roles[random[k + 1]] == 'bystander')rooms[index].bystanders.push(rooms[index].players[i].id);
        else if(roles[random[k + 1]] == 'thug')rooms[index].thugs.push(rooms[index].players[i].id);
            else rooms[index].rolesWithId[roles[random[k + 1]]] = rooms[index].players[i].id;


        let indexPlayer = rooms[index].players.findIndex(x => x.id === rooms[index].players[i].id);
        rooms[index].players[indexPlayer].role = roles[random[k + 1]];

        ServerIo.to(rooms[index].players[i].id).emit('receiveCard', {role: roles[random[++k]], vectorId:i});
      }

      //console.log(rooms[index].rolesWithId);
      //console.log(rooms[index].bystanders);
      //console.log(rooms[index].thugs);

      ServerIo.to(rooms[obiect.index].code).emit('gameBegan');

      }
  });

  socket.on('newNightCall', function(index){

    if(rooms[index].speaker === socket.id){

      //console.log('da');

      rooms[index].nightDeck = [];
      rooms[index].numberOrderNight = 0;

      ServerIo.to(rooms[index].code).emit('nightArrived');

      while(!rooms[index].roles.find(x => x == order[rooms[index].numberOrderNight]))rooms[index].numberOrderNight++;

      ServerIo.to(rooms[index].speaker).emit('nextRole', order[rooms[index].numberOrderNight])

    }

  });

  // ---- NURSE  ----

  socket.on('nurseAbility', function(obiect){

    addEventsAbility(obiect, 'nurse');

  });

  socket.on('nurseCall', function(index){
    if(rooms[index].speaker == socket.id){

      ServerIo.to(rooms[index].rolesWithId.nurse).emit('yourTurn');

    }
  });

  // ---- BODYGUARD ----

  socket.on('bodyguardAbility', function(obiect){

    addEventsAbility(obiect, 'bodyguard');

  });

  socket.on('bodyguardCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat bodyguard');

      ServerIo.to(rooms[index].rolesWithId.bodyguard).emit('yourTurn');

    }
  });

  // --- VIXEN --

  socket.on('vixenAbility', function(obiect){

    addEventsAbility(obiect, 'vixen');

  });

  socket.on('vixenCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat vixen');

      ServerIo.to(rooms[index].rolesWithId.vixen).emit('yourTurn');

    }
  });

  // --- HYPNOTISTS ---

  socket.on('hypnotistAbility', function(obiect){

    addEventsAbility(obiect, 'hypnotist');

  });

  socket.on('hypnotistCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat hypnotist');

      ServerIo.to(rooms[index].rolesWithId.hypnotist).emit('yourTurn');

    }
  });

  // journalist

  socket.on('journalistAbility', function(obiect){

    addEventsAbility(obiect, 'journalist');

  });

  socket.on('journalistCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat journalist');

      ServerIo.to(rooms[index].rolesWithId.journalist).emit('yourTurn');

    }
  });

  socket.on('nextRole', function(code){

    if(rooms.find(x => (x.speaker === socket.id && x.code === code))){

      let index = rooms.findIndex((x) => (x.speaker === socket.id && x.code === code)); //indexul de la admin din array

      while(!rooms[index].roles.find(x => x == order[rooms[index].numberOrderNight]))rooms[index].numberOrderNight++;

      ServerIo.to(rooms[index].rolesWithId[order[rooms[index].numberOrderNight]]).emit('yourTurn');

    }

  });

  socket.on('needPlayersForSpeaker', function(index){
    if(rooms[index].speaker === socket.id){
      console.log(rooms[index].rolesWithId);
      let rolesWithId = rooms[index].rolesWithId;
      let arr = [1, 2, 3];
      ServerIo.to(socket.id).emit('playersForSpeaker', {players: rooms[index].players,
                                                        thugs: rooms[index].thugs,
                                                        bystanders: rooms[index].bystanders,
                                                        rolesWithId: rooms[index].rolesWithId,
                                                        roles:rooms[index].roles
                                                      } );

    }

  })

});

function addEventsAbility(obiect, role){
  console.log(role + 'used his ability');
  let index = obiect.index;
  // index, indexRole idPlayerOnAbility
  console.log(obiect);
  if(rooms[index].players[obiect.indexRole].role === role){

    if(!rooms[index].nightDeck[obiect.idPlayerOnAbility]){
      rooms[index].nightDeck[obiect.idPlayerOnAbility] = rolesWithEdAbilities[obiect.ability]; //verific daca a fost format un array []
    }
    else rooms[index].nightDeck[obiect.idPlayerOnAbility].push(rolesWithEdAbilities[obiect.ability]); // daca da pun push in el

    // facem next Role
    rooms[index].numberOrderNight++;
    while(!rooms[obiect.index].roles.find(x => x == order[rooms[index].numberOrderNight]) && rooms[index].numberOrderNight <= numberOrder)rooms[index].numberOrderNight++;

    //ServerIo.to(rooms[index].rolesWithId[order[rooms[index].numberOrderNight]]).emit('yourTurn');


    if(rooms[index].numberOrderNight == 18){
      console.log('Nght ended..');
      console.log(rooms[index].nightDeck);
      return;
    }

    ServerIo.to(rooms[obiect.index].speaker).emit('nextRole', order[rooms[index].numberOrderNight])

  }


}
