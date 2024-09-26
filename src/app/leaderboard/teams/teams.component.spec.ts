import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamsLeaderboard } from './teams.component';

describe('TeamsLeaderboard', () => {
  let component: TeamsLeaderboard;
  let fixture: ComponentFixture<TeamsLeaderboard>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamsLeaderboard],
    });
    fixture = TestBed.createComponent(TeamsLeaderboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
