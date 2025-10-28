import { Injectable } from '@angular/core';
import { Application, Dto } from './application';
import { Observable } from 'rxjs';
import {HttpHeaders} from '@angular/common/http';

export interface OrdineDto extends Dto {
  utenteId: string,
  biglietti_comprati: number
  importo: number,
  data_pagamento: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrdiniService extends Application<OrdineDto> {
  protected override API_URL = '/api/ordine';

  override getApiUrl(): string {
    return this.API_URL;
  }

  getOrdini(token: string | null, id: string | null): Observable<OrdineDto> {
    return this.http.get<OrdineDto>(`${this.API_URL}/utente?utente=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
