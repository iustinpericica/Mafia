import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { GameService } from '../game/game.service';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Injectable({
  providedIn: 'root',
})
export class LobbyGuard implements CanActivate {

  constructor(private gameService:GameService, private router:Router){

  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if(this.gameService.code){
      return true;
    }
    this.router.navigate(['/game/code']);
    return false;

  }
}
