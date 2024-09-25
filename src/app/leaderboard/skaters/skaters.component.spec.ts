import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkatersLeaderboard } from './skaters.component';

describe('SkatersLeaderboard', () => {
  let component: SkatersLeaderboard;
  let fixture: ComponentFixture<SkatersLeaderboard>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SkatersLeaderboard],
    });
    fixture = TestBed.createComponent(SkatersLeaderboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
