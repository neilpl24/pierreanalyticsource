import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoaliesLeaderboard } from './goalies.component';

describe('GoaliesLeaderboard', () => {
  let component: GoaliesLeaderboard;
  let fixture: ComponentFixture<GoaliesLeaderboard>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoaliesLeaderboard],
    });
    fixture = TestBed.createComponent(GoaliesLeaderboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
