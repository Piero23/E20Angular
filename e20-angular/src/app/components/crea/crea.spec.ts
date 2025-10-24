import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Crea} from './crea';

describe('Crea', () => {
  let component: Crea;
  let fixture: ComponentFixture<Crea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Crea]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Crea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
