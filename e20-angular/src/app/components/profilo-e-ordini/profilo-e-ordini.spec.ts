import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsShowcase } from './events-showcase';
import { ProfiloEOrdini} from './profilo-e-ordini';

describe('EventsShowcase', () => {
  let component: EventsShowcase;
  let fixture: ComponentFixture<EventsShowcase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsShowcase]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EventsShowcase);
  });
});

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
