import { Component, OnInit, Input } from '@angular/core';
import { PlayGameService } from '../playGame.service';
import { groups, events } from '../game.modes';

@Component({
  selector: 'app-speaker-mode',
  templateUrl: './speaker-mode.component.html',
  styleUrls: ['./speaker-mode.component.css']
})
export class SpeakerModeComponent implements OnInit {

  @Input() speakerPlayers:Array<any>;
  @Input() alivePlayers;
  @Input() diedPlayers;

  public groups = groups;
  public events = events;

  constructor(public playGameService:PlayGameService) { }

  ngOnInit() {
    this.speakerPlayers = this.speakerPlayers.filter(x => !x.speaker);

    this.playGameService.gameService.socket.on('nextRole', (role)=>{

      this.playGameService.nextMove = role;
      if(role == 'newNight'){

        this.playGameService.iAmBlocked = false;
        this.playGameService.iAmHypnotised = false;
        this.playGameService.iAmSeduced = false;
        this.playGameService.iAmSilenced = false;

      }
    });

  }

  callNextMove():void{
    this.playGameService.gameService.toastr.suceess(`You have called with success ${this.playGameService.nextMove}`)
    this.playGameService.callNextMove();
  }

  checkInMobsters(role){
    if(this.groups.mobsters.find(x => x == role) || role == 'thug'){
        return true;
    }
    return false;
  }

}
