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
import {FormsModule} from '@angular/forms';
import { ToastrService } from './features/toastr.service';
import { LobbyGuard } from './features/lobby.guard';
import { SelectionComponent } from './game/selection.component';
import { SelectionService } from './game/selection.service';
import { PickCardsComponent } from './game/pick-cards.component';
import { PlayGameComponent } from './game/play-game.component';
import { PlayGameService } from './game/playGame.service';
import { PlayGameEndOfTheGameComponent } from './game/play-game-end-of-the-game.component';
import { VoteComponent } from './game/playGameComponents/vote.component';
import { SpeakerModeComponent } from './game/playGameComponents/speaker-mode.component';
import { MafiaKillingComponent } from './game/playGameComponents/mafia-killing.component';
import { MyTurnComponent } from './game/playGameComponents/my-turn.component';
import { PlayerInfoComponent } from './game/playGameComponents/player-info.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    PlayComponent,
    GameComponent,
    CodeComponent,
    LobbyComponent,
    SelectionComponent,
    PickCardsComponent,
    PlayGameComponent,
    PlayGameEndOfTheGameComponent,
    VoteComponent,
    SpeakerModeComponent,
    MafiaKillingComponent,
    MyTurnComponent,
    PlayerInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [GameService, ToastrService,LobbyGuard, SelectionService, PlayGameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
