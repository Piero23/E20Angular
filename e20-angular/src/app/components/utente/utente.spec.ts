import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Utente } from './utente';

describe('Utente', () => {
  let component: Utente;
  let fixture: ComponentFixture<Utente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Utente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Utente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
