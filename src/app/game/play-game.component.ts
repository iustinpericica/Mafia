import { Component, OnInit } from '@angular/core';
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
  public onClickAbility:boolean = false;
  public abilityChosen:string = null;
  public mafiaKillingStart = false;
  public mafiaKillingTarget = 0;
  public mafiaWin = false;
  public civiliansWin = false;
  public voteStarted = false;
  public voteTarget = '';
  public voteTargetName = '';
  public playersVotes = [];

  ngOnInit() {
    this.name = this.playGameService.gameService.myPlayer.name;
    this.code = this.playGameService.gameService.code;
    this.role = this.playGameService.gameService.myPlayer.role;
    this.myPlayer = this.playGameService.gameService.myPlayer;
    this.players =  this.playGameService.gameService.players;
    this.roomIndex = this.playGameService.gameService.roomIndex;
    this.playGameService.gameService.socket.gameComponent = this;

    for(let i in this.players){

      this.playersVotes[i] = {};
      this.playersVotes[i].name = this.players[i].name;
      this.playersVotes[i].id = this.players[i].id;

    }

    if(this.myPlayer.speaker === true){


      this.playGameService.gameService.socket.emit('needPlayersForSpeaker', this.roomIndex);
      this.playGameService.gameService.socket.on('playersForSpeaker', function(obiect){
        console.log(obiect);
        this.gameComponent.playGameService.gameService.players = obiect.players;
        this.gameComponent.players = obiect.players;
        //console.log(obiect.players;);
        this.rolesWithId = obiect.rolesWithId;
        //console.log(this.rolesWithId);
      });

      this.playGameService.gameService.socket.on('nextRole', function(role){

        this.gameComponent.playGameService.nextMove = role;


      });

    }

    this.playGameService.gameService.socket.on('changeVoteServer', (obiect)=>{
     // vectorId, index, id

      this.playersVotes[obiect.vectorId].vote = obiect.name;
      console.log('Players votes', this.playersVotes);

    });

    this.playGameService.gameService.socket.on('gameEndedMafia', (players) => {

        this.players = players;

        this.mafiaWin = true;

    });

    this.playGameService.gameService.socket.on('gameEndedCivilians', (players) => {

      this.players = players;

      this.civiliansWin = true;

  });

    this.playGameService.gameService.socket.on('died', function(id){

      this.gameComponent.makeDead(id);

    });

    this.playGameService.gameService.socket.on('vote', ()=>{

      this.voteStarted = true;
      this.beginTimeOutVote();

    });

    this.playGameService.gameService.socket.on('yourTurn', function(){


      this.gameComponent.playGameService.myTurn = true;
      setTimeout(() => {
        if(!this.gameComponent.abilityChosen){
         this.gameComponent.abilityChosen = null;

        this.gameComponent.sendAbility(0);
        }
      }, 7000);
    });

    this.playGameService.gameService.socket.on('nightArrived', function(){
      console.log('Winter is comming');
    });

    this.playGameService.gameService.socket.on('mafiaKilling', function(){
      this.gameComponent.startMafiaKilling();
    });


  }

  makeDead(id):void{

    if(id == this.myPlayer.id){
      this.myPlayer.died = true;
    }
    else {

      for(let i in this.players){
          if(this.players[i].id == id){
            this.players[i].died = true;

          }
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

  startMafiaKilling():void{
    this.mafiaKillingStart = true;
    setTimeout(()=>{
      this.mafiaKillingStart = false;

        this.playGameService.gameService.socket.emit(`mafiaAbility`, {
          index: this.playGameService.gameService.roomIndex,
          indexRole: this.playGameService.gameService.myPlayer.vectorId,
          idPlayerOnAbility: this.mafiaKillingTarget,
          ability:this.abilityChosen
        });

        this.mafiaKillingTarget = null;
        this.onClickAbility = false;

    }, 7000);

  }

  sendAbility(id):void{
    this.playGameService.gameService.socket.emit(`${this.playGameService.gameService.myPlayer.role}Ability`, {
      index: this.playGameService.gameService.roomIndex,
      indexRole: this.playGameService.gameService.myPlayer.vectorId,
      idPlayerOnAbility: id,
      ability:this.abilityChosen
    });
    this.playGameService.myTurn = false;
    this.onClickAbility = false;
  }

}
