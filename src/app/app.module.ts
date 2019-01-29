import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { PlayComponent } from './play/play.component';
import { GameComponent } from './game/game.component';
import { GameService } from './game/game.service';
import { CodeComponent } from './game/code.component';
import { LobbyComponent } from './game/lobby.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    PlayComponent,
    GameComponent,
    CodeComponent,
    LobbyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
