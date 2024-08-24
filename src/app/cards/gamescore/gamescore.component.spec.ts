import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamescoreComponent } from './gamescore.component';

describe('GamescoreComponent', () => {
  let component: GamescoreComponent;
  let fixture: ComponentFixture<GamescoreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GamescoreComponent]
    });
    fixture = TestBed.createComponent(GamescoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
