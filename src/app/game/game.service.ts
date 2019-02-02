import { Injectable, OnInit } from "@angular/core";
import { getPlayers } from '@angular/core/src/render3/players';
import { cards } from './game.modes';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { ToastrService } from '../features/toastr.service';

declare let io;

@Injectable()
export class GameService implements OnInit{

  constructor(public router:Router, public toastr:ToastrService){}

  public gameBegan:boolean = false;
  public code:number = null;
  public socket = null;
  public name:string = null;
  public players = [];
  public selectionStarted = false;
  public roomIndex:number;
  public myCards = cards;
  public Deck;



  public myPlayer = {

    speaker:false,
    died:false,
    admin:false,
    name:this.name,
    id:null,
    role:null,
    vectorId:null,
    abilities:[]

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
      name:this.myPlayer.name
    });
  }

  createGame(code):void{
    this.socket.emit('createGame', {
      code: code,
      name:this.myPlayer.name
    });

  }



}
