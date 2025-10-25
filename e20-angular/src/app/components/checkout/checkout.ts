import {Component, inject} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {EventoService} from '../../services/evento-service';
import {AuthService} from '../../services/auth-service';
import {UtenteService} from '../../services/utente-service';
import {takeUntil} from 'rxjs';

@Component({
  selector: 'app-checkout',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  readonly #fb = inject(FormBuilder);

  idEvento: number = null!;
  utenteId?: string;

  showName: boolean = false;
  showBirthday: boolean = false;

  constructor(route: ActivatedRoute,
              private eventoService: EventoService,
              private authService: AuthService,
              private userService: UtenteService,) {
    if ("id" in route.snapshot.params) {
      const id = Number(route.snapshot.params['id']);
      if (Number.isSafeInteger(id)) {
        this.idEvento = id;
      }
    }
    if (!this.idEvento) {
      throw new Error('No id evento!');
    }
    this.listaBigliettiFormArray = new FormArray([this.bigliettoDefaultFormGroup]);
    this.userService.getMe(this.authService.token).subscribe({
      next: (data) => {
        this.utenteId = data.id.toString();
      },
      error: (err) => {
        console.error('Failed to load user:', err);
      }
    });

    this.eventoService.getElementById(this.idEvento)
      .subscribe({
        next: (evento) => {
          this.showName = evento.b_nominativo;
          this.showBirthday = evento.age_restricted;
          this.costo_biglietto = evento.prezzo;
        },
        error: (error) => {
          console.error('Error loading event:', error);
        }
      });
  }

  get bigliettoDefaultFormGroup() {
    return this.#fb.group({
      nome: new FormControl<string | null>(null),
      cognome: new FormControl<string | null>(null),
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      dataNascita: new FormControl<string | null>(null),
      idEvento: new FormControl<number>(this.idEvento, [Validators.required]),
      eValido: new FormControl<true>(true, [Validators.required])
    });
  }

  listaBigliettiFormArray: FormArray<FormGroup<{
    nome: FormControl<string | null>;
    cognome: FormControl<string | null>;
    email: FormControl<string | null>;
    dataNascita: FormControl<string | null>;
    idEvento: FormControl<number | null>;
    eValido: FormControl<true | null>
  }>>;
  username: string = "";
  email: string = "";

  costo_biglietto: number = 0;

  addBiglietto() {
    this.listaBigliettiFormArray.push(this.bigliettoDefaultFormGroup);
  }

  removeBiglietto(index: number) {
    this.listaBigliettiFormArray.removeAt(index);
  }

  httpClient = inject(HttpClient);

  paga() {
    if (this.listaBigliettiFormArray.invalid) {
      console.log(this.listaBigliettiFormArray.controls.map(c => {
        for (const [key, value] of Object.entries(c.controls)) {
          console.log(key, value.errors);
        }
      }));
      this.listaBigliettiFormArray.markAllAsTouched();
      return;
    }

    if (!this.utenteId) {
      return;
    }

    const biglietti = this.listaBigliettiFormArray.getRawValue().map(biglietto => ({
      ...biglietto,
      nome: biglietto.nome === '' ? null : biglietto.nome,
      cognome: biglietto.cognome === '' ? null : biglietto.cognome,
      email: biglietto.email === '' ? null : biglietto.email,
      dataNascita: biglietto.dataNascita === '' ? null : biglietto.dataNascita
    }));

    const body = {
      "utenteId": this.utenteId,
      "valuta": "eur",
      "biglietti": biglietti
    }
    this.eventoService.buyTicket(body, this.authService.token);
  }
}
