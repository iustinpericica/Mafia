import { Injectable } from '@angular/core';
import { GameService } from './game.service';

@Injectable()
export class PlayGameService{

  constructor(public gameService:GameService){}

  public gameEnd:boolean  = false;
  nextMove:string = "newNight";
  myTurn:boolean = false;

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
