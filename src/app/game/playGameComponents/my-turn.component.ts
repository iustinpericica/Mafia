import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayGameService } from '../playGame.service';
import {timer, Observable} from 'rxjs';

@Component({
  selector: 'app-my-turn',
  templateUrl: './my-turn.component.html',
  styleUrls: ['./my-turn.component.css']
})
export class MyTurnComponent implements OnInit {
  public onClickAbility:boolean = false;
  public abilityChosen:string = null;
  public abilitySent:boolean = false;
  public timer:number = 7;

  public id1 : number = 0;
  public id2 : number = 0;
  public name1:string = '';
  public name2:string = '';

  @Input() alivePlayers;
  @Output() eventMyTurn = new EventEmitter<any>();

  constructor(public playGameService:PlayGameService) { }

  ngOnInit() {


    if(this.playGameService.gameService.myPlayer.abilities.length <= 1){

      this.onClickAbility = true;
      this.abilityChosen = this.playGameService.gameService.myPlayer.abilities[0];

    }

    const numbers = timer(0, 1000);
    numbers.subscribe(x => {
      if(x > 7)x = 0;
      this.timer = 7 - x;

    });

      setTimeout(() => {

        if(!this.abilitySent){

         this.eventMyTurn.emit();
         this.sendAbility(0);

        }
      }, 7000);

      this.playGameService.gameService.socket.on('investigatedPlayer', (obiect)=>{
        //id, role
        alert(obiect.role);

      });
  }

  changeAbilityJournalist(newId:number, newName:string):void{

    this.id2 = this.id1;
    this.id1 = newId;

    this.name2 = this.name1;
    this.name1 = newName;

  }


  sendAbility(id):void{

    if(this.playGameService.gameService.myPlayer.role != 'journalist'){

    this.eventMyTurn.emit();
    this.abilitySent = true;
    this.playGameService.gameService.socket.emit(`${this.playGameService.gameService.myPlayer.role}Ability`, {
      index: this.playGameService.gameService.roomIndex,
      indexRole: this.playGameService.gameService.myPlayer.vectorId,
      idPlayerOnAbility: id,
      ability:this.abilityChosen
    });
    this.playGameService.myTurn = false;
    this.onClickAbility = false;
  }
  else {

    this.eventMyTurn.emit();
    this.abilitySent = true;
    this.playGameService.gameService.socket.emit(`${this.playGameService.gameService.myPlayer.role}Ability`, {
      index: this.playGameService.gameService.roomIndex,
      indexRole: this.playGameService.gameService.myPlayer.vectorId,
      idPlayerOnAbility: this.id1,
      idPlayerOnAbility1:this.id2,
      ability:this.abilityChosen
    });
    this.playGameService.myTurn = false;
    this.onClickAbility = false;

  }

}


}
