import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { GameComponent } from './game/game.component';
import { CodeComponent } from './game/code.component';
import { LobbyComponent } from './game/lobby.component';
import { LobbyGuard } from './features/lobby.guard';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'game', component: GameComponent, children:[
    {path:'code', component:CodeComponent},
    {path:'lobby', component:LobbyComponent, canActivate:[LobbyGuard]}
  ]},
  {path:'whatis', component:PlayComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
