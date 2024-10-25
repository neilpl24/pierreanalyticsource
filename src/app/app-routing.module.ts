import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { CardsComponent } from './cards/cards.component';
import { LandingComponent } from './landing/landing.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ScoresComponent } from './scores/scores.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { StandingsComponent } from './standings/standings.component';
import { TeamsComponent } from './teams/teams.component';
import { VideoComponent } from './video/video.component';

const routes: Routes = [
  { path: 'leaderboard/:type', component: LeaderboardComponent },
  { path: 'about', component: AboutComponent },
  { path: '404', component: PageNotFoundComponent },
  { path: ':playerID/year', component: CardsComponent },
  { path: ':playerID/year/:season', component: CardsComponent },
  { path: 'scores', component: DatePickerComponent },
  { path: 'scores/:date', component: ScoresComponent },
  { path: 'video/:link', component: VideoPlayerComponent },
  { path: 'video', component: VideoComponent },
  { path: 'standings', component: StandingsComponent },
  { path: 'teams/:teamID', component: TeamsComponent },
  { path: '', component: LandingComponent },
  {
    path: '**',
    pathMatch: 'full',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
