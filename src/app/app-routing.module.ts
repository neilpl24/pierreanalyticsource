import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CardsComponent } from './cards/cards.component';
import { LandingComponent } from './landing/landing.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { ScoresComponent } from './scores/scores.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { StandingsComponent } from './standings/standings.component';

const routes: Routes = [
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: 'about', component: AboutComponent },
  { path: '404', component: PagenotfoundComponent },
  { path: ':playerID/year', component: CardsComponent },
  { path: ':playerID/year/:season', component: CardsComponent },
  { path: 'video/:link', component: VideoPlayerComponent },
  { path: 'standings', component: StandingsComponent },
  { path: '', component: LandingComponent },
  {
    path: '**',
    pathMatch: 'full',
    component: PagenotfoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
