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

    this.gameService.socket.emit('requestPlayers', this.gameService.roomIndex);

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
      //console.log('Speaker is fired up')
      this.component.makeSpeaker(speakerId);
    });


    this.gameService.socket.on('gameStartedSpeakerMode', function(roles){

      for(let i in this.component.gameService.players){
          this.component.gameService.players[i].role = roles[i];
      }

    });

  }


  startSelection():void{
    this.gameService.selectionStarted = true;
    this.gameService.router.navigate(['/game/selection']);
  }

  startGame():void{
    this.gameService.socket.emit('startGame', this.gameService.code);
  }

  sendSpeaker(speakerId):void{
    this.gameService.socket.emit('makeSpeaker', {
      speakerId:speakerId,
      index:this.gameService.roomIndex
    })
  }

  makeSpeaker(speakerId): void{

    let indexSpeaker = this.gameService.players.findIndex(x => x.id === speakerId);
    if(this.gameService.players[indexSpeaker].id === this.gameService.myPlayer.id) this.gameService.myPlayer.speaker = true;
    this.gameService.players[indexSpeaker].speaker = true;
    console.log(this.gameService.players[indexSpeaker].name);

  }


}
