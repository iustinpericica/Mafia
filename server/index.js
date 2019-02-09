const Express = require('express');
const App = Express();
const Socket = require('socket.io');
const Cors = require('cors');

const PORT = process.env.PORT || 3000;

App.use(Express.static(__dirname + '/Mafia'));

App.get('/*', (req, res)=>{

  res.sendFile(__dirname + '/Mafia/index.html');

});

const server = App.listen(PORT, (err)=>{
  if(err)throw err;
  else console.log('Socket.io is running perfectly just fine!');
});



const ServerIo = new Socket(server);

let rooms = [];

let order = ['newNight', 'vixen', 'thief', 'snitch', 'nurse', 'bodyguard', 'lawyer', 'thug', 'jailer', 'priest', 'detective', 'judge', 'sheriff', 'journalist', 'godfather', 'hypnotist', 'endNight', 'voteTimeStart', 'voteTimeEnd'];
let numberOrder = order.length - 1;

let mafias = ['thug', 'thief', 'godfather', 'lawyer', 'snitch'];

let rolesWithEdAbilities = {
  jail:'jailed',
  kill:'killed',
  investigate:'investigated',
  save:'saved',
  protect:'protected',
  seduce:'seduced',
  hypnotize: 'hypnotized',
  research:'researched',
  block:'blocked',
  silence:'silenced',
  badmouth:'badmouthed'

}

ServerIo.on('connection', function(socket){

  socket.on('createGame', function(user){

    if(!rooms.find((x) => {

      if(!x)return false;
      return x.code === user.code

    })){

      let index = rooms.length;

      rooms.push({
        code:user.code,
        admin:socket.id,
        gameStart:false,
        roles:[],
        index:index,
        nightDeck: {}, //nigh t
        numberOrderNight:0, //night
        dawnDeck:{},
        mafiaDeck:[],
        jailedPlayers:[],
        vote:{},
        Deck:{},
        rolesWithId:{},
        bystanders:[],
        thugs:[],
        mafias:0,
        civilians:0,
        speaker:null,
        voteStart:false,
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


    if(rooms.find((x) => {
      if(!x)return 0;
      return x.code === user.code;

    })){

       let id = rooms.findIndex((x) => {
        if(!x)return 0;
         return x.code === user.code
        });

        if(id !== undefined){

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
    }
    else {

      ServerIo.to(socket.id).emit('wrongCode', user.code);
    }


  });

  socket.on('requestPlayers', function(index){

    if(rooms[index] && rooms[index].players){

      if(rooms[index].players.length > 0)ServerIo.to(socket.id).emit('requestedPlayers', rooms[index].players);

    }

  });



  socket.on('makeSpeaker', function(obiect){
    // speakerId, index in object
    if(rooms[obiect.index]){
    if(rooms[obiect.index].admin === socket.id){
      // verific daca e admin si daca e codul corect

      rooms[obiect.index].speaker = obiect.speakerId; // specific speakerul in acel room

      let index2 = rooms[obiect.index].players.findIndex((x) => x.id === obiect.speakerId); //iau indexul de la playerul din arrayul players din acel room
      rooms[obiect.index].players[index2].speaker = true;
      rooms[obiect.index].players[index2].role = 'speaker';

      ServerIo.to(rooms[obiect.index].code).emit('speaker', obiect.speakerId); //returnez id ul speakerului

    }
  }
});

  socket.on('startGame', function(obiect){
    // obiect: index, Deck
    if(rooms[obiect.index]){
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
    }
  });

  socket.on('newNightCall', function(index){

    if(rooms[index]){
    if(rooms[index].speaker === socket.id){

      //console.log('da');

      rooms[index].nightDeck = [];
      rooms[index].numberOrderNight = 0;

      ServerIo.to(rooms[index].code).emit('nightArrived');

      while(!rooms[index].roles.find(x => x == order[rooms[index].numberOrderNight]))rooms[index].numberOrderNight++;

      ServerIo.to(rooms[index].speaker).emit('nextRole', order[rooms[index].numberOrderNight]);

    }
  }

  });

  socket.on('endNightCall', function(index){
    if(rooms[index]){
    if(rooms[index].speaker == socket.id){
      try{
      for (let key in rooms[index].nightDeck) {
        if(key != 0 && key != null && key != '0' && key){
        if (rooms[index].nightDeck.hasOwnProperty(key)) {

            let isSaved = false;
            let isSeduced = false;
            let isProtected = false;
            for(i of rooms[index].nightDeck[key]){


                if(i == 'saved')isSaved = true;
                if(i == 'seduced')isSeduced = true;
                if(i == 'protected') isProtected = true;

                if(!isSaved && !isSeduced && !isProtected && i == 'killed'){
                  let indexKilled = rooms[index].players.findIndex(x => x.id == key);
                  rooms[index].players[indexKilled].died = true;
                  if(rooms[index].players[indexKilled].role == 'thug' || rooms[index].players[indexKilled].role == 'thief' || rooms[index].players[indexKilled].role == 'godfather' || rooms[index].players[indexKilled].role == 'lawyer' || rooms[index].players[indexKilled].role == 'snitch'){
                    // e un mafeot
                    rooms[index].mafias--;
                  }
                  else rooms[index].civilians--;
                  if(rooms[index].players[indexKilled].role == 'jailer')ServerIo.to(rooms[index].code).emit('freeJailedPlayers');
                  ServerIo.to(rooms[index].code).emit('died', rooms[index].players[indexKilled].id);

                }

                if(isProtected && i == 'killed' && !isSaved && !isSeduced ){
                  let idBodyguard = rooms[index].rolesWithId.bodyguard;
                  let indexKilled = rooms[index].players.findIndex(x => x.id == idBodyguard);
                  rooms[index].players[indexKilled].died = true;
                  rooms[index].civilians--;
                  ServerIo.to(rooms[index].code).emit('died', idBodyguard);

                }



            }

          }}
        }




    let gameEnd = false;

    if(rooms[index].mafias >= rooms[index].civilians){
      ServerIo.to(rooms[index].code).emit('gameEndedMafia', rooms[index].players);
      gameEnd = true;
      delete rooms[index];
      return;

    }
    if(rooms[index].mafias == 0){
      ServerIo.to(rooms[index].code).emit('gameEndedCivilians', rooms[index].players);
      gameEnd = true;
      delete rooms[index];
      return;
    }
    // end of the game  |^

    if(!gameEnd)ServerIo.to(rooms[index].speaker).emit('nextRole', 'voteTimeStart');

    }
    catch(err){}
  }
}});


  socket.on('voteTimeStartCall', function(index){

    if(rooms[index]){

    rooms[index].vote = {};
    rooms[index].voteStart = true;
    for(i of rooms[index].players){
      if(i.died == false){

        ServerIo.to(i.id).emit('vote');

      }
    }

    setTimeout(()=>{

      rooms[index].voteStart = false;

      let maxim = -1;
      let maximSecond = false;
      let maximId = null;

      //console.log('Obiect cu voturi: ', rooms[index].vote);

      for(key in rooms[index].vote){

        if(key != ''){

        if(rooms[index].vote[key]){
          if(rooms[index].vote[key] > maxim){
            maxim = rooms[index].vote[key];
            maximId = key;
            maximSecond = false;
        }

        else if(rooms[index].vote[key] == maxim){
          maximSecond = true;

        }

      }}
      }


      if(!maximSecond && maxim != -1){

        let indexKilled = rooms[index].players.findIndex(x => x.id == maximId);
        rooms[index].players[indexKilled].died = true;
        if(rooms[index].players[indexKilled].role == 'jailer')ServerIo.to(rooms[index].code).emit('freeJailedPlayers');

        ServerIo.to(rooms[index].code).emit('died', rooms[index].players[indexKilled].id)



        if(rooms[index].players[indexKilled].role == 'thug' || rooms[index].players[indexKilled].role == 'thief' || rooms[index].players[indexKilled].role == 'godfather' || rooms[index].players[indexKilled].role == 'lawyer' || rooms[index].players[indexKilled].role == 'snitch'){
          // e un mafeot
          rooms[index].mafias--;
        }
        else rooms[index].civilians--;

        if(rooms[index].mafias >= rooms[index].civilians){
          ServerIo.to(rooms[index].code).emit('gameEndedMafia', rooms[index].players);

        }
        if(rooms[index].mafias == 0){ServerIo.to(rooms[index].code).emit('gameEndedCivilians', rooms[index].players);}

    }
     ServerIo.to(rooms[index].speaker).emit('nextRole', 'newNight');
     rooms[index].mafiaDeck = [];
     rooms[index].numberOrder = 0;
     rooms[index].nightDeck = {};
     rooms[index].vote = {};
    }, 17000);

  }
});

  socket.on('changeVote', function(obiect){

    if(rooms[obiect.index])ServerIo.to(rooms[obiect.index].code).emit('changeVoteServer', obiect)

  });

  socket.on('votePlayer', function(obiect){
    //index, //vectorId //playerVotedId

    if(rooms[obiect.index]){
    if(rooms[obiect.index].voteStart){


      let possibleJudge = rooms[obiect.index].nightDeck[rooms[obiect.index].rolesWithId.judge];

      if(possibleJudge)possibleJudge = possibleJudge.find(x => x == 'hypnotized');
      if(rooms[obiect.index].players[obiect.vectorId].role == 'judge'){
        if(!rooms[obiect.index].vote[obiect.playerVotedId]){
          rooms[obiect.index].vote[obiect.playerVotedId] = 2;
        }
        else rooms[obiect.index].vote[obiect.playerVotedId]+=2;
      }

      else if(rooms[obiect.index].players[obiect.vectorId].role == 'hypnotist'){
          if(!rooms[obiect.index].vote[obiect.playerVotedId]){
            if(possibleJudge) rooms[obiect.index].vote[obiect.playerVotedId] = 3;
            else rooms[obiect.index].vote[obiect.playerVotedId] = 2;
          }
          else {
            if(possibleJudge) rooms[obiect.index].vote[obiect.playerVotedId]+=3;
            else rooms[obiect.index].vote[obiect.playerVotedId]+=2;
          }
        }
          else {
            if(!rooms[obiect.index].vote[obiect.playerVotedId]){
              rooms[obiect.index].vote[obiect.playerVotedId] = 1;
            }
            else rooms[obiect.index].vote[obiect.playerVotedId]++;
          }


}
}});

  socket.on('mafiasRequest', (index)=>{

    if(rooms[index]){

      let mafiasAlive = rooms[index].players.filter(x =>  (mafias.find(y => y == x.role) ) && !x.dead ) ;
      ServerIo.to(socket.id).emit('requestedMafias', mafiasAlive);

    }

  });

  socket.on('thugCall', function(index){

    if(rooms[index]){
      rooms[index].mafiaDeck = [];

      if(rooms[index].speaker == socket.id){
        for(i of rooms[index].thugs){
          ServerIo.to(i).emit('mafiaKilling');
        }
      }
      for(i of rooms[index].roles){
        if(i == 'thief' || i == 'godfather' || i == 'lawyer' || i == 'snitch'){
          ServerIo.to(rooms[index].rolesWithId[i]).emit('mafiaKilling');
        }
      }

      setTimeout(()=>{

            let mda =  false;

            for(let i = 0;i<rooms[index].mafiaDeck.length - 1;++i){

              if(rooms[index].mafiaDeck[i] !== rooms[index].mafiaDeck[i+1])mda = true;
            }

            if(!mda){


              if(!rooms[index].nightDeck[rooms[index].mafiaDeck[0]]){
                rooms[index].nightDeck[rooms[index].mafiaDeck[0]] = [rolesWithEdAbilities.kill]; //verific daca a fost format un array []
              }
              else rooms[index].nightDeck[rooms[index].mafiaDeck[0]].push(rolesWithEdAbilities.kill); // daca da pun push in el

            }

            rooms[index].numberOrderNight++;

            while(!rooms[index].roles.find(x => x == order[rooms[index].numberOrderNight]) && rooms[index].numberOrderNight <= numberOrder)rooms[index].numberOrderNight++;

            //ServerIo.to(rooms[index].rolesWithId[order[rooms[index].numberOrderNight]]).emit('yourTurn');

            console.log(rooms[index].numberOrderNight);

            if(rooms[index].numberOrderNight == 19){
              console.log('Nght ended..');
              console.log(rooms[index].nightDeck);
              ServerIo.to(rooms[index].speaker).emit('nextRole', 'endNight');
              return;
            }

            ServerIo.to(rooms[index].speaker).emit('nextRole', order[rooms[index].numberOrderNight]);


      }, 15000);

  }
});

  socket.on('mafiaAbility', function(obiect){

    let index = obiect.index;
    if(rooms[index])rooms[index].mafiaDeck.push(obiect.idPlayerOnAbility);

  });

  socket.on('mafiaChangeTarget', (obiect)=>{
    if(rooms[obiect.index]){

      if(rooms[obiect.index].players){

    for(let player of rooms[obiect.index].players){

      if(mafias.find(x => x == player.role) && !player.dead && obiect.id != player.id){
        ServerIo.to(player.id).emit('mafiaTargetChanged', obiect);
      }

      if( obiect.id == player.id){
        ServerIo.to(player.id).emit('mafiaTargetChanged', {
          myPlayer:true
        });
      }

    }

  }
}});

  // ---- NURSE  ----

  socket.on('nurseAbility', function(obiect){

    addEventsAbility(obiect, 'nurse', socket);

  });

  socket.on('nurseCall', function(index){
    if(rooms[index].speaker == socket.id){

      ServerIo.to(rooms[index].rolesWithId.nurse).emit('yourTurn');

    }
  });


  // ---- BODYGUARD ----

  socket.on('bodyguardAbility', function(obiect){

    addEventsAbility(obiect, 'bodyguard', socket);

  });

  socket.on('bodyguardCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat bodyguard');

      ServerIo.to(rooms[index].rolesWithId.bodyguard).emit('yourTurn');

    }
  });

  // --- VIXEN --

  socket.on('vixenAbility', function(obiect){

    addEventsAbility(obiect, 'vixen', socket);

  });

  socket.on('vixenCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat vixen');

      ServerIo.to(rooms[index].rolesWithId.vixen).emit('yourTurn');

    }
  });

  // --- HYPNOTISTS ---

  socket.on('hypnotistAbility', function(obiect){

    addEventsAbility(obiect, 'hypnotist', socket);

  });

  socket.on('hypnotistCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat hypnotist');

      ServerIo.to(rooms[index].rolesWithId.hypnotist).emit('yourTurn');

    }
  });

  // journalist

  socket.on('journalistAbility', function(obiect){

    addEventsAbility(obiect, 'journalist', socket);

  });

  socket.on('journalistCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat journalist');

      ServerIo.to(rooms[index].rolesWithId.journalist).emit('yourTurn');

    }
  });

  // LEADERS ||||

  // JAILER

  socket.on('jailerAbility', function(obiect){

    addEventsAbility(obiect, 'jailer', socket);

  });

  socket.on('jailerCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat jailer');

      ServerIo.to(rooms[index].rolesWithId.jailer).emit('yourTurn');

    }
  });

  // PRIEST

  socket.on('priestAbility', function(obiect){

    addEventsAbility(obiect, 'priest', socket);

  });

  socket.on('priestCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat priest');

      ServerIo.to(rooms[index].rolesWithId.priest).emit('yourTurn');

    }
  });

  //DETECTIVE

  socket.on('detectiveAbility', function(obiect){

    addEventsAbility(obiect, 'detective', socket);

  });

  socket.on('detectiveCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat detective');

      ServerIo.to(rooms[index].rolesWithId.detective).emit('yourTurn');

    }
  });

  // JUDGE ::

  socket.on('judgeAbility', function(obiect){

    addEventsAbility(obiect, 'judge', socket);

  });

  socket.on('judgeCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat judge');

      ServerIo.to(rooms[index].rolesWithId.judge).emit('yourTurn');

    }
  });

  // SHERIFF

  socket.on('sheriffAbility', function(obiect){

    addEventsAbility(obiect, 'sheriff', socket);

  });

  socket.on('sheriffCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat sheriff');

      ServerIo.to(rooms[index].rolesWithId.sheriff).emit('yourTurn');

    }
  });


  // MOBSTERS:

  // THIEFF

  socket.on('thiefAbility', function(obiect){

    addEventsAbility(obiect, 'thief', socket);

  });

  socket.on('thiefCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat thief');

      ServerIo.to(rooms[index].rolesWithId.thief).emit('yourTurn');

    }
  });

  // GODFATHER

  socket.on('godfatherAbility', function(obiect){

    addEventsAbility(obiect, 'godfather', socket);

  });

  socket.on('godfatherCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat godfather');

      ServerIo.to(rooms[index].rolesWithId.godfather).emit('yourTurn');

    }
  });

  // LAWYER

  socket.on('lawyerAbility', function(obiect){

    addEventsAbility(obiect, 'lawyer', socket);

  });

  socket.on('lawyerCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat lawyer');

      ServerIo.to(rooms[index].rolesWithId.lawyer).emit('yourTurn');

    }
  });

  // SNITCH

  socket.on('snitchAbility', function(obiect){

    addEventsAbility(obiect, 'snitch', socket);

  });

  socket.on('snitchCall', function(index){
    if(rooms[index].speaker == socket.id){
      console.log('daa, am apelat snitch');

      ServerIo.to(rooms[index].rolesWithId.snitch).emit('yourTurn');

    }
  });

  socket.on('nextRole', function(index){



    if(rooms[index]){

      if(rooms[index].speaker == socket.id){

      rooms[index].numberOrderNight++;
      while(!rooms[index].roles.find(x => x == order[rooms[index].numberOrderNight]))rooms[index].numberOrderNight++;

      ServerIo.to(rooms[index].rolesWithId[order[rooms[index].numberOrderNight]]).emit('yourTurn');

    }
  }

  });

  socket.on('needPlayersForSpeaker', function(index){
    if(rooms[index]){
      if(rooms[index].speaker === socket.id){
        let rolesWithId = rooms[index].rolesWithId;
        let arr = [1, 2, 3];
        ServerIo.to(socket.id).emit('playersForSpeaker', {players: rooms[index].players,
                                                          thugs: rooms[index].thugs,
                                                          bystanders: rooms[index].bystanders,
                                                          rolesWithId: rooms[index].rolesWithId,
                                                          roles:rooms[index].roles
                                                        } );

      }

  }
})

});

function addEventsAbility(obiect, role, socket){

  let index = obiect.index;
  // index, indexRole idPlayerOnAbility
  if(rooms[index]){
    if(rooms[index].players){
      try{
  let name = rooms[index].players.find(x => x.id == obiect.idPlayerOnAbility);
  if(name)name = name.name;

  if(obiect.ability == 'investigate'){
    let key = 0;
    console.log('Investigating..');


    if(rooms[index].players[obiect.indexRole].role === role && obiect.idPlayerOnAbility != 0){

      if(role == 'priest'){
        ServerIo.to(obiect.idPlayerOnAbility).emit('investigatedByPriest', rooms[index].players[obiect.indexRole].name);
      }

      let foundBadmouth = false;

      if(rooms[index].nightDeck[obiect.idPlayerOnAbility]){

        if(rooms[index].nightDeck[obiect.idPlayerOnAbility].find(x => x == 'badmouthed')){
        foundBadmouth = true;

      }
    }

      if(foundBadmouth){
        if(role == 'jailer'){
          ServerIo.to(rooms[index].code).emit('newJailedPlayer', name);
          rooms[index].jailedPlayers.push(obiect.idPlayerOnAbility);

        }
        ServerIo.to(socket.id).emit('investigatedPlayer', {

          id : obiect.idPlayerOnAbility,
          role: 'thug'

        });
      }
      else {

      for(i in rooms[index].rolesWithId){

      if(rooms[index].rolesWithId[i] == obiect.idPlayerOnAbility){


        if(role == 'jailer' && mafias.find(x => x == i)){

          ServerIo.to(rooms[index].code).emit('newJailedPlayer', name);
          rooms[index].jailedPlayers.push(obiect.idPlayerOnAbility);

        }

        ServerIo.to(socket.id).emit('investigatedPlayer', {

          id : obiect.idPlayerOnAbility,
          role: i

        });
      }
    }

    for(i of rooms[index].bystanders){
      if(i == obiect.idPlayerOnAbility){
        ServerIo.to(socket.id).emit('investigatedPlayer', {

          id : obiect.idPlayerOnAbility,
          role: 'bystander'

        });
      }
    }

    for(i of rooms[index].thugs){
      if(i == obiect.idPlayerOnAbility){

        if(role == 'jailer'){
          ServerIo.to(rooms[index].code).emit('newJailedPlayer', name);
          rooms[index].jailedPlayers.push(obiect.idPlayerOnAbility);

        }
        ServerIo.to(socket.id).emit('investigatedPlayer', {

          id : obiect.idPlayerOnAbility,
          role: 'thug'

        });
      }
    }
  }
  }
}

  if(rooms[index].players[obiect.indexRole].role === role && obiect.idPlayerOnAbility != 0){

    if(obiect.ability == 'silence')ServerIo.to(obiect.idPlayerOnAbility).emit('abilityOnMe', 'silence');
    if(obiect.ability == 'block')ServerIo.to(obiect.idPlayerOnAbility).emit('abilityOnMe', 'block');
    if(obiect.ability == 'jail')ServerIo.to(obiect.idPlayerOnAbility).emit('abilityOnMe', 'jail');
    if(obiect.ability == 'seduce')ServerIo.to(obiect.idPlayerOnAbility).emit('abilityOnMe', 'seduce');
    if(obiect.ability == 'hypnotize')ServerIo.to(obiect.idPlayerOnAbility).emit('abilityOnMe', 'hypnotize');

    if(role == 'journalist' && obiect.idPlayerOnAbility && obiect.idPlayerOnAbility1){
      let role1, role2;
      for(i in rooms[index].rolesWithId){

        if(rooms[index].rolesWithId[i] == obiect.idPlayerOnAbility){
          role1 = i;
        }
        if(rooms[index].rolesWithId[i] == obiect.idPlayerOnAbility1){
          role2 = i;
        }
      }

      for(i of rooms[index].bystanders){

        if(i == obiect.idPlayerOnAbility){
          role1 = 'bystander';
        }

        if(rooms[index].rolesWithId[i] == obiect.idPlayerOnAbility1){
          role2 = 'bystander';
        }

      }

      for(i of rooms[index].thugs){

        if(i == obiect.idPlayerOnAbility){
          role1 = 'thug';
        }

        if(i == obiect.idPlayerOnAbility1){
          role2 = 'thug';
        }

      }

      let mafia1 = mafias.find(x => x == role1);
      let mafia2 = mafias.find(x => x == role2);

      console.log('Im here');

      if(mafia1 == mafia2){
        ServerIo.to(socket.id).emit('researched', 'sameTeam');
      }
      else ServerIo.to(socket.id).emit('researched','differentTeams');



    }

    if(!rooms[index].nightDeck[obiect.idPlayerOnAbility]){
      rooms[index].nightDeck[obiect.idPlayerOnAbility] = [rolesWithEdAbilities[obiect.ability]]; //verific daca a fost format un array []
    }
    else rooms[index].nightDeck[obiect.idPlayerOnAbility].push(rolesWithEdAbilities[obiect.ability]); // daca da pun push in el

    // facem next Role

  }
    rooms[index].numberOrderNight++;
    let sendHere = false;
    while(!rooms[obiect.index].roles.find(x => x == order[rooms[index].numberOrderNight]) && rooms[index].numberOrderNight <= numberOrder){

      if(order[rooms[index].numberOrderNight] == 'thug' && rooms[obiect.index].thugs.length == 0){
        ServerIo.to(rooms[obiect.index].speaker).emit('nextRole', 'thug');
        sendHere = true;
        break;
      }
      else rooms[index].numberOrderNight++;

    }

    //ServerIo.to(rooms[index].rolesWithId[order[rooms[index].numberOrderNight]]).emit('yourTurn');


    console.log(rooms[index].numberOrderNight);

    if(rooms[index].numberOrderNight == 19){

      ServerIo.to(rooms[obiect.index].speaker).emit('nextRole', 'endNight');
      return;
    }

    if(!sendHere)ServerIo.to(rooms[obiect.index].speaker).emit('nextRole', order[rooms[index].numberOrderNight]);


}
 catch(err){}
  }
}}

