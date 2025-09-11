import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContentZone } from './main-content-zone';

describe('MainContentZone', () => {
  let component: MainContentZone;
  let fixture: ComponentFixture<MainContentZone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainContentZone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainContentZone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
