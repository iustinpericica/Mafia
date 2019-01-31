import { Component, OnInit } from '@angular/core';
import { SelectionService } from './selection.service';
import { groups, descriptions } from './game.modes';
import { ReturnStatement } from '@angular/compiler';

@Component({
  selector: 'app-pick-cards',
  templateUrl: './pick-cards.component.html',
  styleUrls: ['./pick-cards.component.css']
})
export class PickCardsComponent implements OnInit {

  constructor(public selectionService:SelectionService) { }

  public genericDeck;
  public groups = groups;
  public descriptions = descriptions;
  public currentCategory:string;

  ngOnInit() {

    this.selectionService.gameService.socket.component = this;

    this.genericDeck = this.selectionService.genericDeck;;
    this.currentCategory =  "bystanders";;
    this.selectionService.Deck.bystanders = this.genericDeck.bystanders;
    this.selectionService.Deck.thugs = this.genericDeck.thugs;



  }

  startGame():void{
      if(this.selectionService.Deck.leaders.length !== this.genericDeck.leaders){this.selectionService.gameService.toastr.error('Not the correct number for cards!');return;};
      if(this.selectionService.Deck.mobsters.length !== this.genericDeck.mobsters){this.selectionService.gameService.toastr.error('Not the correct number for cards!');return;};
      if(this.selectionService.Deck.specialists.length !== this.genericDeck.specialists){this.selectionService.gameService.toastr.error('Not the correct number for cards!');return;};

      this.selectionService.gameService.gameBegan = true;

      //console.log(this.selectionService.Deck);
      this.selectionService.gameService.Deck = this.selectionService.Deck;
      //emitem la toti fraierii

      this.selectionService.gameService.socket.emit('startGame', {code: this.selectionService.gameService.code, Deck:  this.selectionService.gameService.Deck});

  }

  changePickingCards(category):void{
    this.currentCategory = category;
  }

  pickCard(card):void{
    if(!this.isPut(card)){
    if( this.selectionService.Deck[this.currentCategory].length >= this.genericDeck[this.currentCategory]){
        this.selectionService.gameService.toastr.error(`You cannot overcome the value of ${this.genericDeck[this.currentCategory]} for ${this.currentCategory}`);
    }
    else this.selectionService.Deck[this.currentCategory].push(card);

    }
    else {
      let index = this.selectionService.Deck[this.currentCategory].findIndex(x => x === card);
      this.selectionService.Deck[this.currentCategory].splice(index, 1);
    }


  }

  isPut(card):boolean{

    if(this.selectionService.Deck[this.currentCategory].find(x => x === card))return true;
    else return false;

  }

}
