import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EventsShowcase} from './events-showcase';

describe('EventsShowcase', () => {
  let component: EventsShowcase;
  let fixture: ComponentFixture<EventsShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsShowcase]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EventsShowcase);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
