import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BackgroundFlyers} from './background-flyers';

describe('BackgroundFlyers', () => {
  let component: BackgroundFlyers;
  let fixture: ComponentFixture<BackgroundFlyers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundFlyers]
    })
      .compileComponents();

    fixture = TestBed.createComponent(BackgroundFlyers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
