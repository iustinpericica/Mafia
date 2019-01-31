import { Injectable } from '@angular/core';
import { GameService } from './game.service';

@Injectable()
export class PlayGameService{

  constructor(public gameService:GameService){}


}
