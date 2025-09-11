import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoAndSearchBar } from './logo-and-search-bar';

describe('LogoAndSearchBar', () => {
  let component: LogoAndSearchBar;
  let fixture: ComponentFixture<LogoAndSearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoAndSearchBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoAndSearchBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
