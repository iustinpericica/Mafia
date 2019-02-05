import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayGameService } from '../playGame.service';

@Component({
  selector: 'app-my-turn',
  templateUrl: './my-turn.component.html',
  styleUrls: ['./my-turn.component.css']
})
export class MyTurnComponent implements OnInit {
  public onClickAbility:boolean = false;
  public abilityChosen:string = null;

  @Input()alivePlayers;
  @Output() eventMyTurn = new EventEmitter<any>();

  constructor(public playGameService:PlayGameService) { }

  ngOnInit() {

      setTimeout(() => {
        this.eventMyTurn.emit();
        if(!this.abilityChosen){
         this.abilityChosen = null;

        this.sendAbility(0);
        }
      }, 7000);

      this.playGameService.gameService.socket.on('investigatedPlayer', (obiect)=>{
        //id, role
        alert(obiect.role);

      });
  }


  sendAbility(id):void{
    this.eventMyTurn.emit();
    this.playGameService.gameService.socket.emit(`${this.playGameService.gameService.myPlayer.role}Ability`, {
      index: this.playGameService.gameService.roomIndex,
      indexRole: this.playGameService.gameService.myPlayer.vectorId,
      idPlayerOnAbility: id,
      ability:this.abilityChosen
    });
    this.playGameService.myTurn = false;
    this.onClickAbility = false;
  }


}
