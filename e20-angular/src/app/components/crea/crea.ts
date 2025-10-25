import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { RowbarSearch } from '../rowbar-search/rowbar-search';

@Component({
  selector: 'app-crea',
  standalone: true,
  imports: [CommonModule, RowbarSearch, HttpClientModule],
  templateUrl: './crea.html',
  styleUrls: ['./crea.css']
})
export class Crea implements AfterViewInit {
  @ViewChild('hoursInput', { static: true }) hoursRef!: ElementRef<HTMLInputElement>;
  @ViewChild('minutesInput', { static: true }) minutesRef!: ElementRef<HTMLInputElement>;
  @ViewChild('dateInput', { static: true }) dateRef!: ElementRef<HTMLInputElement>;
  @ViewChild('openButton', { static: true }) openBtnRef!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit() {
    const input = this.dateRef.nativeElement;
    const btn = this.openBtnRef.nativeElement;

    btn.addEventListener('click', () => {
      if ('showPicker' in input) {
        input.showPicker();
      }
    });
  }

  private normalizzaOrario(el: HTMLInputElement, min: number, max: number) {
    let v = el.value ?? '';
    v = v.replace(/\D/g, '');
    if (v === '') { el.value = ''; return; }
    let n = parseInt(v, 10);
    if (isNaN(n)) { el.value = ''; return; }
    if (n < min) n = min;
    if (n > max) n = max;
    el.value = String(n);
  }

  onHoursInput() {
    const el = this.hoursRef.nativeElement;
    el.value = el.value.replace(/[^\d]/g, '');
    if (el.value.length >= 2) {
      this.normalizzaOrario(el, 0, 23);
      this.minutesRef.nativeElement.focus();
    }
  }

  onMinutesInput() {
    const el = this.minutesRef.nativeElement;
    el.value = el.value.replace(/[^\d]/g, '');
    if (el.value.length > 2) el.value = el.value.slice(0, 2);
  }

  onHoursBlur() {
    this.normalizzaOrario(this.hoursRef.nativeElement, 0, 23);
    if (this.hoursRef.nativeElement.value !== '') {
      this.hoursRef.nativeElement.value = this.hoursRef.nativeElement.value.padStart(2, '0');
    }
  }

  onMinutesBlur() {
    this.normalizzaOrario(this.minutesRef.nativeElement, 0, 59);
    if (this.minutesRef.nativeElement.value !== '') {
      this.minutesRef.nativeElement.value = this.minutesRef.nativeElement.value.padStart(2, '0');
    }
  }

  onHoursKeydown(ev: KeyboardEvent) {
    if (ev.key === ':') {
      ev.preventDefault();
      this.minutesRef.nativeElement.focus();
    }
  }

  public getOrario(): string {
    const hhRaw = this.hoursRef?.nativeElement?.value ?? '';
    const mmRaw = this.minutesRef?.nativeElement?.value ?? '';
    const hh = hhRaw === '' ? '' : String(hhRaw).padStart(2, '0');
    const mm = mmRaw === '' ? '' : String(mmRaw).padStart(2, '0');
    return (hh === '' && mm === '') ? '' : `${hh}:${mm}`;
  }

/*
public invia(): void {
    const titleEl = document.getElementById('title') as HTMLInputElement | null;
    const locationEl = document.getElementById('location') as HTMLInputElement | null;
    const postiEl = document.getElementById('posti') as HTMLInputElement | null;
    const prezzoEl = document.getElementById('prezzo') as HTMLInputElement | null;
    const vietatoEl = document.getElementById('vietato-minori') as HTMLInputElement | null;
    const nominativoEl = document.getElementById('nominativo') as HTMLInputElement | null;
    const riutilizzabileEl = document.getElementById('riutilizzabile') as HTMLInputElement | null;
    const descrEl = document.querySelector('.container-2 .field p[contenteditable]') as HTMLElement | null;

    const nome = titleEl?.value?.trim() ?? '';
    const locationText = locationEl?.value?.trim() ?? '';
    const posti = postiEl && postiEl.value !== '' ? Number(postiEl.value) : null;
    const prezzo = prezzoEl && prezzoEl.value !== '' ? Number(prezzoEl.value) : null;
    const b_vietato = !!(vietatoEl && vietatoEl.checked);
    const b_nominativo = !!(nominativoEl && nominativoEl.checked);
    const b_riutilizzabile = !!(riutilizzabileEl && riutilizzabileEl.checked);
    const descrizione = descrEl ? descrEl.innerText.trim() : '';

    const dateValue = this.dateRef?.nativeElement?.value ?? '';
    const timeValue = this.getOrario(); // "HH:mm" o ''
    const dataIso = this.buildISODate(dateValue, timeValue);

    if (!nome) { alert('Inserisci il titolo'); return; }
    if (!dateValue) { alert('Inserisci la data'); return; }
    if (!locationText) { alert('Inserisci la location'); return; }

    const locationId = Number(locationText) || null;

    const organizzatore = localStorage.getItem('user_id') || localStorage.getItem('sub') || '';

    const dto: EventoDto = {
      nome: nome,
      descrizione: descrizione,
      organizzatore: organizzatore,
      locationId: locationId,
      posti: posti,
      b_riutilizzabile: b_riutilizzabile,
      b_nominativo: b_nominativo,
      data: dataIso
    };
    if (prezzo !== null) dto.prezzo = prezzo;

    this.eventoService.creaEvento(dto).subscribe({
      next: (created) => {
        console.log('Evento creato:', created);
        alert('Evento creato con successo!');
        if (created && (created as any).id) {
          this.router.navigate(['/evento', (created as any).id]);
        }
      },
      error: (err) => {
        console.error('Errore creazione evento', err);
        if (err?.status === 403) alert('Operazione non consentita: organizzatore differente.');
        else if (err?.status === 400) alert('Dati non validi.');
        else if (err?.status === 404) alert('Location o risorsa non trovata.');
        else alert('Errore di rete o server. Controlla la console.');
      }
    });
  } */
}
