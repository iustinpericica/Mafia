import { Injectable, OnInit } from "@angular/core";
import { getPlayers } from '@angular/core/src/render3/players';

declare let io;

@Injectable()
export class GameService implements OnInit{

  public isAdmin:boolean = false;
  public gameBegan:boolean = false;
  public introducedCode:boolean = false;
  public code:number = null;
  public socket = null;
  public name:string = null;
  public players = [];
  public myPlayer = {

    speaker:false,
    died:false,
    admin:false,
    name:this.name,
    id:null,
    role:null

  };

  ngOnInit():void{
    this.init();

  }

  init():void{
    this.socket = io('http://localhost:3000');

  }

  enterGame(code):void{
    this.socket.emit('connectToGame', {
      code: code,
      name:this.name
    });
  }

  createGame(code):void{
    this.socket.emit('createGame', {
      code: code,
      name:this.name
    });

  }




}
