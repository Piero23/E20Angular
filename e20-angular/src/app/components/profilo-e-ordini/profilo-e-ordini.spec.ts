import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ProfiloEOrdini} from './profilo-e-ordini';

describe('ProfiloEOrdini', () => {
  let component: ProfiloEOrdini;
  let fixture: ComponentFixture<ProfiloEOrdini>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfiloEOrdini]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ProfiloEOrdini);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
