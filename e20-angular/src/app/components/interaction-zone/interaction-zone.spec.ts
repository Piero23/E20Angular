import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionZone } from './interaction-zone';

describe('InteractionZone', () => {
  let component: InteractionZone;
  let fixture: ComponentFixture<InteractionZone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InteractionZone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractionZone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
