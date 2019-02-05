import { Component, OnInit, Output, Input } from '@angular/core';
import { EventEmitter } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
  }

  changeVote(id, name):void{
    this.voteTargetName = name;
    this.event.emit({
      id:id,
      name:name
    });
  }

}
