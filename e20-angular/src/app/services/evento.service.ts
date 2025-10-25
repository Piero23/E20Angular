// src/app/services/utente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, forkJoin, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import { Utente } from '../models/utente.model';
import { Evento } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private baseUrl = 'http://localhost:8060';

  constructor(private http: HttpClient) {}

  getOrdini(username: string): Observable<Evento[]> {
    return this.http.get<{ id: number; eventoId: number; persone: number }[]>(`${this.baseUrl}/api/ordine/utente?utente=${username}`)
      .pipe(
        switchMap(ordini =>
          this.http.get<Evento[]>(`${this.baseUrl}/eventi`).pipe(
            map(eventi => ordini.map(o => {
              const ev = eventi.find(e => e.id === o.eventoId);
              return {
                id: ev?.id || 0,
                nome: ev?.nome || 'Evento sconosciuto',
                data: ev?.data || '',
                ora: ev?.ora || '',
                persone: o.persone,
                e_valido: ev?.e_valido || false
              } as Evento;
            }))
          )
        )
      );
  }
}
