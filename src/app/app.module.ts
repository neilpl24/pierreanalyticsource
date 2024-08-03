import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CardsComponent } from './cards/cards.component';
import { LandingComponent } from './landing/landing.component';
import { FiltersComponent } from './filters/filters.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SearchComponent } from './filters/search/search.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TeamComponent } from './filters/team/team.component';
import { NationalityComponent } from './filters/nationality/nationality.component';
import { PositionComponent } from './filters/position/position.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { TimelineComponent } from './cards/timeline/timeline.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ShotsComponent } from './cards/shots/shots.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NavComponent } from './nav/nav.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { AboutComponent } from './about/about.component';
import { TableComponent } from './cards/table/table.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ScoresComponent } from './scores/scores.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { SeasonComponent } from './filters/season/season.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { MatNativeDateModule } from '@angular/material/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GameComponent } from './game/game.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StandingsComponent } from './standings/standings.component';
import { TeamsComponent } from './teams/teams.component';
import { DatePipe } from '@angular/common';
import { SkatersLeaderboard } from './leaderboard/skaters/skaters.component';
import { GoaliesLeaderboard } from './leaderboard/goalies/goalies.component';
import { TeamsLeaderboard } from './leaderboard/teams/teams.component';

@NgModule({
  declarations: [
    AppComponent,
    CardsComponent,
    LandingComponent,
    FiltersComponent,
    SearchComponent,
    TeamComponent,
    TeamsComponent,
    NationalityComponent,
    PositionComponent,
    TimelineComponent,
    ShotsComponent,
    NavComponent,
    AboutComponent,
    TableComponent,
    ScoresComponent,
    PagenotfoundComponent,
    SeasonComponent,
    VideoPlayerComponent,
    DatePickerComponent,
    GameComponent,
    StandingsComponent,
    LeaderboardComponent,
    SkatersLeaderboard,
    GoaliesLeaderboard,
    TeamsLeaderboard,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSortModule,
    HttpClientModule,
    MatFormFieldModule,
    MatIconModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    NgbModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatTooltipModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
