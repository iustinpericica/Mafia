import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  constructor(public gameService:GameService) { }

  ngOnInit() {
    this.gameService.init();

    this.gameService.socket.gameComponentMother = this;

    this.gameService.socket.on('receiveCard', function(obiect){
      // role, vectorId
      this.gameComponentMother.receiveRole(obiect.role);

      console.log(obiect.role);

      switch(obiect.role){
        case 'nurse':this.gameComponentMother.gameService.myPlayer.abilities = ['save'];break;
        case 'bodyguard': this.gameComponentMother.gameService.myPlayer.abilities = ['protect'];break;
        case 'thug' : this.gameComponentMother.gameService.myPlayer.abilities = ['kill'];break;
        case 'jailer' : this.gameComponentMother.gameService.myPlayer.abilities = ['jail'];break;
        case 'priest' : this.gameComponentMother.gameService.myPlayer.abilities = ['kill', 'investigate'];break;
        case 'detective' : this.gameComponentMother.gameService.myPlayer.abilities = ['kill', 'investigate'];break;
        case 'judge' : this.gameComponentMother.gameService.myPlayer.abilities = ['investigate'];break;
        case 'sheriff' : this.gameComponentMother.gameService.myPlayer.abilities = ['kill'];break;
        case 'vixen' : this.gameComponentMother.gameService.myPlayer.abilities = ['seduce'];break;
        case 'hypnotist' : this.gameComponentMother.gameService.myPlayer.abilities = ['hypnotize'];break;
        case 'thief' : this.gameComponentMother.gameService.myPlayer.abilities = ['block'];break;
        case 'godfather' : this.gameComponentMother.gameService.myPlayer.abilities = ['silence'];break;
        case 'lawyer' : this.gameComponentMother.gameService.myPlayer.abilities = ['investigate'];break;
        case 'snitch' : this.gameComponentMother.gameService.myPlayer.abilities = ['badmouth'];break;
        default: break;

      }
      this.gameComponentMother.gameService.myPlayer.vectorId = obiect.vectorId;

    });

    this.gameService.socket.on('gameBegan', function(){
      this.gameComponentMother.goToGame();
      //this.component.selectionService.gameService.router.navigate('/game/play');
    });

  }

  goToGame():void{
    this.gameService.router.navigate(['/game/play']);
  }

  receiveRole(role:string):void{
    this.gameService.myPlayer.role = role;
    console.log(this.gameService.myPlayer);

  }

}
