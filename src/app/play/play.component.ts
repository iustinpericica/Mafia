import { Component, OnInit } from '@angular/core';
import { cards, CardInterface } from './cards';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  public Cards:CardInterface[] = cards;

  public filteredCards:CardInterface[];

  filterChange(state:string){

    this.filteredCards = this.Cards.filter((x) => {
      if(x.camp === state)return true;
      else return false;
    })

  }

  constructor() { }

  ngOnInit() {
    this.filteredCards = this.Cards;
  }

}
