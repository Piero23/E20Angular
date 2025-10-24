import {Component, inject} from '@angular/core';
import {TopBar} from '../../shared/top-bar/top-bar';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [
    TopBar,
    ReactiveFormsModule
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  readonly #fb = inject(FormBuilder);

  idEvento: number = null!;
  utenteId?: string;

  constructor(route: ActivatedRoute) {
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
    this.httpClient.get("/api/utente/me", {withCredentials: true}).subscribe({
      next: (res) => {
        if (!("id" in res) || typeof res.id !== "string") {
          throw new Error("No id utente!");
        }
        this.utenteId = res.id;
      },
      error: console.error
    });
  }

  get bigliettoDefaultFormGroup() {
    return this.#fb.group({
      nome: new FormControl<string | null>(null, Validators.required),
      cognome: new FormControl<string | null>(null, Validators.required),
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      dataNascita: new FormControl<string | null>(null, [Validators.required]),
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

  costo_biglietto: number = 10;

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

    const body = {
      "utenteId": this.utenteId,
      "valuta": "eur",
      "biglietti": this.listaBigliettiFormArray.getRawValue()
    }
    this.httpClient.post("https://192.168.1.212:8060/stripe/checkout", body, {withCredentials: true}).subscribe({
      next: console.log,
      error: console.error
    });

  }
}
