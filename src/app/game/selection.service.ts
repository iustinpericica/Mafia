import { Injectable } from '@angular/core';
import { GameService } from './game.service';
import { cards, groups, modes } from './game.modes';

@Injectable()
export class SelectionService{

  constructor(public gameService:GameService){}

  public cards = cards;
  public groups = groups;
  public modes = modes;
  public playersNumber = this.gameService.players.length - 1;
  public genericDeck;
  public Deck = {
    total:this.gameService.players.length-1,
    mobsters:[],
    specialists:[],
    leaders:[],
    thugs:0,
    bystanders:0
  };

}
