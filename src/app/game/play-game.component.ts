import { Component, OnInit, assertPlatform } from '@angular/core';
import { GameService } from './game.service';
import { PlayGameService } from './playGame.service';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {

  constructor(public playGameService:PlayGameService) { }

  public name:string;
  public code:number;
  public role:string;
  public myPlayer;
  public players;
  public rolesWithId;
  public roomIndex:number;
  public mafiaKillingStart = false;
  public mafiaWin = false;
  public civiliansWin = false;
  public voteStarted = false;
  public voteTarget = '';
  public voteTargetName = '';
  public playersVotes = [];
  public alivePlayers = [];
  public diedPlayers = [];
  public speakerPlayers = [];
  public myTurn:boolean = false;


  ngOnInit() {
    this.code = this.playGameService.gameService.code;
    this.myPlayer = this.playGameService.gameService.myPlayer;
    this.players =  this.playGameService.gameService.players;
    this.roomIndex = this.playGameService.gameService.roomIndex;
    this.playGameService.gameService.socket.gameComponent = this;

    for(let i in this.players){

      this.playersVotes[i] = {};

      this.playersVotes[i].name = this.players[i].name;
      this.playersVotes[i].id = this.players[i].id;
      this.playersVotes[i].speaker = this.players[i].speaker;
      this.playersVotes[i].died = false;

      if(this.players[i].id !== this.myPlayer.id && !this.players[i].speaker){

        this.alivePlayers.push({});

        this.alivePlayers[this.alivePlayers.length - 1].id = this.players[i].id;
        this.alivePlayers[this.alivePlayers.length - 1].name = this.players[i].name;


      }


    }

    console.log(this.alivePlayers);

    if(this.myPlayer.speaker === true){


      this.playGameService.gameService.socket.emit('needPlayersForSpeaker', this.roomIndex);
      this.playGameService.gameService.socket.on('playersForSpeaker', function(obiect){

        this.gameComponent.playGameService.gameService.players = obiect.players;
        this.gameComponent.players = obiect.players;

        this.rolesWithId = obiect.rolesWithId;


        this.gameComponent.speakerPlayers = obiect.players;

      });

    }

    this.playGameService.gameService.socket.on('investigatedByPriest', (nameOfThePriest)=>{

        alert(`You have been investigated by priest, the priest is ${nameOfThePriest}`);

    });


    this.playGameService.gameService.socket.on('researched', (sameTeam)=>{

      alert(`The players you have investigated are on ${sameTeam}`);

  });


    this.playGameService.gameService.socket.on('abilityOnMe', (ability)=>{

      switch(ability){
        case 'silence':this.playGameService.iAmSilenced = true;break;
        case 'block': this.playGameService.iAmBlocked = true;break;
        case 'jail': this.playGameService.iAmJailed = true;break;
        case 'seduce': this.playGameService.iAmSeduced = true;break;
        case 'hypnotize': this.playGameService.iAmHypnotised = true;break;
        default:break;
      }

    })

    this.playGameService.gameService.socket.on('changeVoteServer', (obiect)=>{

      this.playersVotes[obiect.vectorId].vote = obiect.name;

    });

    this.playGameService.gameService.socket.on('newJailedPlayer', (name)=>{
      if(name == this.playGameService.gameService.myPlayer.name){
        this.playGameService.iAmJailed = true;
      }
      this.playGameService.jailedPlayers.push(name);
    });

    this.playGameService.gameService.socket.on('freeJailedPlayers', ()=>{
      this.playGameService.jailedPlayers = [];
    });

    this.playGameService.gameService.socket.on('gameEndedMafia', (players) => {

        this.players = players;
        this.mafiaWin = true;
        this.playGameService.gameEnd = true;

    });

    this.playGameService.gameService.socket.on('gameEndedCivilians', (players) => {

      this.players = players;
      this.civiliansWin = true;
      this.playGameService.gameEnd = true;

  });

    this.playGameService.gameService.socket.on('died', function(id){

      this.gameComponent.makeDead(id);

    });

    this.playGameService.gameService.socket.on('vote', ()=>{

      this.voteStarted = true;
      this.beginTimeOutVote();

    });

    this.playGameService.gameService.socket.on('yourTurn', () =>{
      this.myTurn = true;
    });


    this.playGameService.gameService.socket.on('mafiaKilling', ()=>{
      this.mafiaKillingStart = true;
    });


  }


  makeDead(id):void{

    if(id == this.myPlayer.id){
      this.myPlayer.died = true;
    }


      for(let i in this.players){
          if(this.players[i].id == id){
            this.players[i].died = true;
            this.playersVotes[i].died = true;

          }
      }

      for(let i in this.alivePlayers){
        if(this.alivePlayers[i].id == id){

          this.diedPlayers.push(this.alivePlayers[i]);
          this.alivePlayers.splice(+i, 1);


        }
      }



  }

  changeVote(id, name):void{

    this.voteTarget = id;
    this.voteTargetName = name;
    this.playGameService.gameService.socket.emit('changeVote', {

      id: id,
      index: this.roomIndex,
      vectorId:this.myPlayer.vectorId,
      name:name

    });

  }

  beginTimeOutVote():void{

    console.log('Beggining time out vote...');
    if(!this.myPlayer.speaker){
    setTimeout(()=>{
      this.voteStarted = false;
      this.playGameService.votePlayer(this.voteTarget);
      this.voteTarget = '';
      this.voteTargetName = '';

    }, 15000);
  }
}


}
