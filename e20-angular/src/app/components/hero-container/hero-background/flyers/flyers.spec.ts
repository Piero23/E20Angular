import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Flyers } from './flyers';

describe('Flyers', () => {
  let component: Flyers;
  let fixture: ComponentFixture<Flyers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Flyers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Flyers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
