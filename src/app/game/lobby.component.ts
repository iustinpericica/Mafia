import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { ToastrService } from '../features/toastr.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  public socket;

  constructor(private gameService:GameService, private toastrService:ToastrService) { }

  ngOnInit() {

    this.gameService.socket.component = this;

    this.gameService.socket.emit('requestPlayers', this.gameService.code);

    this.gameService.socket.on('requestedPlayers', function(players){
      this.component.gameService.players = players;
    })

    this.gameService.socket.on('newUser', function(user){
      //console.log(user);
      if(! this.component.gameService.players.find((x) => x == user.id)){
      this.component.gameService.players.push({

        id:user.id,
        name:user.name,
        role:null,
        dead:false,
        speaker:false

      });
    }
    });

    this.gameService.socket.on('speaker', function(speakerId){
      this.component.makeSpeaker(speakerId);
    })

  }

  makeSpeaker(speakerId): void{

    let indexSpeaker = this.gameService.players.findIndex(x => x === x.id);
    if(indexSpeaker === this.gameService.myPlayer.id) this.gameService.myPlayer.speaker = true;

  }


}
