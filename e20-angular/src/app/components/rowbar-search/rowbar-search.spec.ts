import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowbarSearch } from './rowbar-search';

describe('RowbarSearch', () => {
  let component: RowbarSearch;
  let fixture: ComponentFixture<RowbarSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowbarSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowbarSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
