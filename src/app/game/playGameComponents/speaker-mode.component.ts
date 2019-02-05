import { Component, OnInit, Input } from '@angular/core';
import { PlayGameService } from '../playGame.service';

@Component({
  selector: 'app-speaker-mode',
  templateUrl: './speaker-mode.component.html',
  styleUrls: ['./speaker-mode.component.css']
})
export class SpeakerModeComponent implements OnInit {

  @Input() speakerPlayers:Array<any>;
  @Input() alivePlayers;
  @Input() diedPlayers;
  constructor(public playGameService:PlayGameService) { }

  ngOnInit() {
    this.speakerPlayers = this.speakerPlayers.filter(x => !x.speaker);

    this.playGameService.gameService.socket.on('nextRole', (role)=>{

      this.playGameService.nextMove = role;

    });

  }

}
