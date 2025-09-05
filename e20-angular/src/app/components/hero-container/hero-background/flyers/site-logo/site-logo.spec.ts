import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteLogo } from './site-logo';

describe('SiteLogo', () => {
  let component: SiteLogo;
  let fixture: ComponentFixture<SiteLogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteLogo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiteLogo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
