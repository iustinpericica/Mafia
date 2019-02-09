import { Component, OnInit } from '@angular/core';
import { GameService } from './game.service';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { toASCII } from 'punycode';
import { ToastrService } from '../features/toastr.service';
import { Router } from '@angular/router';

declare let $;

@Component({
  selector: 'app-code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit {

  constructor(public gameService:GameService, public toastrService:ToastrService, private router:Router) { }

  public text:string;



  ngOnInit() {

    function typeEffect(element, speed) {
      var text = $(element).text();
      $(element).html('');

      var i = 0;
      var timer = setInterval(function() {
              if (i < text.length) {
                $(element).append(text.charAt(i));
                i++;
              } else {
                clearInterval(timer);
              }
            }, speed);
    }

    $( document ).ready(function() {
      var speed = 75;
      var delay = $('#firstText').text().length * speed + speed;
      typeEffect($('#firstText'), speed);
    });


    this.gameService.socket.componentClass = this;

    this.gameService.socket.on('gameAlreadyExists', function(code){
      this.componentClass.toastrService.warning(`A room with code ${code} already exists`);
    });

    this.gameService.socket.on('gameCreatedSuccess', function(user){

      this.componentClass.gameService.isAdmin = true;
      this.componentClass.setCode(user.code);
      this.componentClass.gameService.myPlayer.admin = true;
      this.componentClass.gameService.myPlayer.id = user.id;
      this.componentClass.gameService.roomIndex = user.index;

      this.componentClass.toastrService.suceess(`You have created the room ${user.code} successful`);
      this.componentClass.router.navigate(['/game/lobby']);

    });

    this.gameService.socket.on('gameEnterSuccess', function(user){

      this.componentClass.setCode(user.code);
      this.componentClass.toastrService.suceess(`You have entered the room ${user.code} successful`);

      this.componentClass.gameService.myPlayer.id = user.id
      this.componentClass.gameService.roomIndex = user.index;
      console.log(this.componentClass.gameService.myPlayer);

      this.componentClass.router.navigate(['/game/lobby']);

    });

    this.gameService.socket.on('wrongCode', function(code){
      console.log('da');
      this.componentClass.toastrService.warning(`You have typed a wrong room code: ${code} `);

    });

  }

  setCode(code):void{
    this.gameService.code = code;
    console.log(this.gameService.code);
  }

}
