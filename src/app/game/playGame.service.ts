import { Injectable } from '@angular/core';
import { GameService } from './game.service';

@Injectable()
export class PlayGameService{

  constructor(public gameService:GameService){}

  public gameEnd:boolean  = false;
  nextMove:string = "newNight";
  myTurn:boolean = false;

  public iAmSeduced:boolean = false;
  public iAmBlocked:boolean = false;
  public iAmSilenced:boolean = false;
  public iAmJailed:boolean = false;
  public iAmHypnotised:boolean = false;
  public jailedPlayers: Array<string> = [];

  callNextMove(): void{
    this.gameService.socket.emit(this.nextMove + 'Call', this.gameService.roomIndex);
  }

  votePlayer(id):void{
    this.gameService.socket.emit('votePlayer' , {

      index:this.gameService.roomIndex,
      vectorId:this.gameService.myPlayer.vectorId,
      playerVotedId:id

    });
  }


}
