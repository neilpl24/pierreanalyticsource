import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NationalityComponent } from './nationality.component';

describe('NationalityComponent', () => {
  let component: NationalityComponent;
  let fixture: ComponentFixture<NationalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NationalityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NationalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
