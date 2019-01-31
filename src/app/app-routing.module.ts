import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { GameComponent } from './game/game.component';
import { CodeComponent } from './game/code.component';
import { LobbyComponent } from './game/lobby.component';
import { LobbyGuard } from './features/lobby.guard';
import { SelectionComponent } from './game/selection.component';
import { PickCardsComponent } from './game/pick-cards.component';
import { PlayGameComponent } from './game/play-game.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'game', component: GameComponent, children:[
    {path:'code', component:CodeComponent},
    {path:'lobby', component:LobbyComponent, canActivate:[LobbyGuard]},
    {path:'selection', component:SelectionComponent, canActivate:[LobbyGuard]},
    {path:'pickCards', component:PickCardsComponent, canActivate:[LobbyGuard]},
    {path:'play', component:PlayGameComponent, canActivate:[LobbyGuard]}
  ]},
  {path:'whatis', component:PlayComponent},
  {path:'', pathMatch:'full', redirectTo:'game/code'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
