import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-crea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './crea.html',
  styleUrls: ['./crea.css']
})
export class Crea implements AfterViewInit {
  @ViewChild('hoursInput', {static: true}) hoursRef!: ElementRef<HTMLInputElement>;
  @ViewChild('minutesInput', {static: true}) minutesRef!: ElementRef<HTMLInputElement>;
  @ViewChild('dateInput', {static: true}) dateRef!: ElementRef<HTMLInputElement>;
  @ViewChild('openButton', {static: true}) openBtnRef!: ElementRef<HTMLButtonElement>;

  ngAfterViewInit() {
    const input = this.dateRef.nativeElement;
    const btn = this.openBtnRef.nativeElement;

    btn.addEventListener('click', () => {
      if ('showPicker' in input) {
        input.showPicker();
      }
    });
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

  private normalizzaOrario(el: HTMLInputElement, min: number, max: number) {
    let v = el.value ?? '';
    v = v.replace(/\D/g, '');
    if (v === '') {
      el.value = '';
      return;
    }
    let n = parseInt(v, 10);
    if (isNaN(n)) {
      el.value = '';
      return;
    }
    if (n < min) n = min;
    if (n > max) n = max;
    el.value = String(n);
  }
}
