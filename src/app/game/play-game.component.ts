import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.css']
})
export class PlayGameComponent implements OnInit {

  constructor(public gameService:GameService) { }

  public name:string;
  public code:number;
  public role:string;

  ngOnInit() {
    this.name = this.gameService.myPlayer.name;
    this.code = this.gameService.code;
    this.role = this.gameService.myPlayer.role;
  }

}
