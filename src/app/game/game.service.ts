import { Injectable } from "@angular/core";

@Injectable()
export class GameService{

  public isAdmin:boolean = false;
  public gameBegan:boolean = false;
  public introducedCode:boolean = false;

}
