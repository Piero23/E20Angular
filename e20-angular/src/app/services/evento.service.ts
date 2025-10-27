// src/app/services/evento.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Evento {
  id: number;
  nome: string;
  data: string;
  ora: string;
  persone: number;
  e_valido: boolean;
}

@Injectable({ providedIn: 'root' })
export class EventoService {
  private base = 'http://localhost:8060'; // porta del backend

  constructor(private http: HttpClient) {
  }

  // Chiama /api/ordine/utente?utente=...
  getOrdini(username: string): Observable<Evento[]> {
    const url = `${this.base}/api/ordine/utente?utente=${encodeURIComponent(username)}`;
    return this.http.get<Evento[]>(url);
  }

  // Chiama /api/utente/:username/preferiti
  getPreferiti(username: string): Observable<Evento[]> {
    const url = `${this.base}/api/utente/${encodeURIComponent(username)}/preferiti`;
    return this.http.get<Evento[]>(url);
  }
}
