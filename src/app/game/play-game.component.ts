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
  public abilityChosen:string;

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

    this.playGameService.gameService.socket.on('yourTurn', function(){

      console.log('my turn..');
      this.gameComponent.playGameService.myTurn = true;
    });

    this.playGameService.gameService.socket.on('nightArrived', function(){
      console.log('Winter is comming');
    });




  }

  sendAbility(id):void{
    this.playGameService.gameService.socket.emit(`${this.playGameService.gameService.myPlayer.role}Ability`, {
      index: this.playGameService.gameService.roomIndex,
      indexRole: this.playGameService.gameService.myPlayer.vectorId,
      idPlayerOnAbility: id,
      ability:this.abilityChosen
    });
    this.playGameService.myTurn = false;
  }

}
