import { Component, OnInit } from '@angular/core';
import { SelectionService } from './selection.service';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.css']
})
export class SelectionComponent implements OnInit {

  constructor(private selectionSerivce:SelectionService) { }

  myMode;
  bystanders: number = 0;
  specialists:number = 0;
  leaders:number = 0;
  thugs:number = 0;
  mobsters:number = 0;
  playersNumber:number;

  //public suma = this.specialists + this.bystanders + this.leaders  + this.thugs + this.mobsters;

  ngOnInit() {

    this.myMode = this.selectionSerivce.modes[this.selectionSerivce.gameService.players.length - 1];
    this.playersNumber = this.selectionSerivce.gameService.players.length - 1;

  }

  applyDefault(){

    this.specialists = this.myMode.specialists;
    this.bystanders = this.myMode.bystanders;
    this.leaders = this.myMode.leaders;
    this.thugs = this.myMode.thugs;
    this.mobsters = this.myMode.mobsters;

  }

  pickCards():void{
    this.selectionSerivce.genericDeck = {
      specialists:this.specialists,
      bystanders:this.bystanders,
      leaders:this.leaders,
      thugs:this.thugs,
      mobsters:this.mobsters
    }
    this.selectionSerivce.gameService.router.navigate(['/game/pickCards']);
  }

}
