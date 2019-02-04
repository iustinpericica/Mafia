import { Component, OnInit, Input } from '@angular/core';
import { getPlayers } from '@angular/core/src/render3/players';

@Component({
  selector: 'app-play-game-end-of-the-game',
  templateUrl: './play-game-end-of-the-game.component.html',
  styleUrls: ['./play-game-end-of-the-game.component.css']
})
export class PlayGameEndOfTheGameComponent implements OnInit {

  @Input()players:string;
  @Input()mafiaWon:boolean;
  @Input()civiliansWon:boolean;

  constructor() { }

  ngOnInit() {
  }

}
