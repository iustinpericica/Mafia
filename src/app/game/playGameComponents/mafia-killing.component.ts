import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlayGameService } from '../playGame.service';


@Component({
  selector: 'app-mafia-killing',
  templateUrl: './mafia-killing.component.html',
  styleUrls: ['./mafia-killing.component.css']
})
export class MafiaKillingComponent implements OnInit {

  @Input() alivePlayers : Array<any>;
  @Output() eventStart = new EventEmitter<boolean>();

  public mafias;
  public mafiaKillingTarget = 0;
  public mafiaKillingTargetName = '';
  public counter = 0;

  constructor(public playGameService:PlayGameService) { }

  ngOnInit() {

    this.playGameService.gameService.socket.emit('mafiasRequest', this.playGameService.gameService.roomIndex);

    setTimeout(()=>{

      this.eventStart.emit(false);

        this.playGameService.gameService.socket.emit(`mafiaAbility`, {
          index: this.playGameService.gameService.roomIndex,
          indexRole: this.playGameService.gameService.myPlayer.vectorId,
          idPlayerOnAbility: this.mafiaKillingTarget
        });

        this.mafiaKillingTarget = null;

    }, 14000);

    this.playGameService.gameService.socket.on('mafiaTargetChanged', (obiect)=>{

      //nameTarget, mafiaName, role
      if(!obiect.myPlayer){
          console.log('mafiaTargetChanged', obiect);
          let indexMafiot;
          indexMafiot = this.mafias.findIndex(x => x.id == obiect.id);
          this.mafias[indexMafiot].voteTo = obiect.nameTarget;
          this.counter = 0;


        for(let i of this.mafias){
          if(i.id != this.playGameService.gameService.myPlayer.id){

            if(i.voteTo != this.mafiaKillingTargetName)break;
            if(i.voteTo)this.counter++;

        }
      }
      }
      else {
        this.counter = 0;


        for(let i of this.mafias){
          if(i.id != this.playGameService.gameService.myPlayer.id){

            if(i.voteTo != this.mafiaKillingTargetName)break;
            if(i.voteTo)this.counter++;

        }
      }
      }

      console.log(this.counter);

    });

    this.playGameService.gameService.socket.on('requestedMafias', (mafias)=>{

      console.log('Alive mafias = ', mafias);
      this.mafias = mafias;

    });


  }

  changeMafiaTarget(target, name):void{
    this.mafiaKillingTarget = target
    this.mafiaKillingTargetName = name;
    this.playGameService.gameService.socket.emit('mafiaChangeTarget', {

      id: this.playGameService.gameService.myPlayer.id,
      index: this.playGameService.gameService.roomIndex,
      nameTarget: name,
      mafiaName: this.playGameService.gameService.myPlayer.name,
      role : this.playGameService.gameService.myPlayer.role

    });
  }

}
