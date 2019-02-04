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
  public mafiaKillingTarget = null;

  ngOnInit() {
    this.name = this.playGameService.gameService.myPlayer.name;
    this.code = this.playGameService.gameService.code;
    this.role = this.playGameService.gameService.myPlayer.role;
    this.myPlayer = this.playGameService.gameService.myPlayer;
    this.players =  this.playGameService.gameService.players;
    this.roomIndex = this.playGameService.gameService.roomIndex;
    this.playGameService.gameService.socket.gameComponent = this;

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
        console.log(role);

      });

    }

    this.playGameService.gameService.socket.on('died', function(id){

      this.gameComponent.makeDead(id);

    });

    this.playGameService.gameService.socket.on('voteTime', function(){
      console.log('voteTime');
    })

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

    console.log('Dead');

    if(id == this.myPlayer.id){
      this.myPlayer.died = true;
    }
    else {
      console.log('da');
      console.log(this.players);
      for(let i in this.players){
          if(this.players[i].id == id){
            this.players[i].died = true;

          }
      }
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
