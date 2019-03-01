import { Component, OnInit, Input } from '@angular/core';
import { PlayGameService } from '../playGame.service';
import { events } from '../game.modes';

@Component({
  selector: 'app-player-info',
  templateUrl: './player-info.component.html',
  styleUrls: ['./player-info.component.css']
})
export class PlayerInfoComponent implements OnInit {

  @Input()myPlayer;
  @Input() alivePlayers;
  @Input() code;

  public events = events;

  constructor(public playGameService:PlayGameService) { }

  ngOnInit() {
  }

}
