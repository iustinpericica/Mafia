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

    this.gameService.socket.gameComponent = this;

    this.gameService.socket.on('receiveCard', function(role){
      console.log('Got it', role);
      this.gameComponent.receiveRole(role);
      //this.component.selectionService.gameService.router.navigate('/game/play');
    });

  }

  receiveRole(role:string):void{
    this.gameService.myPlayer.role = role;
    console.log(this.gameService.myPlayer);
    this.gameService.router.navigate(['/game/play']);
  }

}
