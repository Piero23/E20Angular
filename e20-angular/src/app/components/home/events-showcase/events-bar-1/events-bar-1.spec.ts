import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsBar1 } from './events-bar-1';

describe('EventsBar1', () => {
  let component: EventsBar1;
  let fixture: ComponentFixture<EventsBar1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsBar1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsBar1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
