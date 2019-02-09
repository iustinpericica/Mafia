import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { PlayGameService } from '../playGame.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  @Input() playersVotes;
  @Input() alivePlayers;
  @Input() myPlayer;
  @Output() event = new EventEmitter<any>();

  voteTargetName:string;
  timer: number = 15;
  constructor(public playGameService:PlayGameService) { }

  ngOnInit() {
    const numbers = timer(0, 1000);
    numbers.subscribe(x => {
      if(x > 15)x = 0;
      this.timer = 15 - x;

    });
  }

  changeVote(id, name):void{
    this.voteTargetName = name;
    this.event.emit({
      id:id,
      name:name
    });
  }

}
