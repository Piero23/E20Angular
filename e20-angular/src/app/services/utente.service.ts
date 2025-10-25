// src/app/services/utente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Utente } from '../models/utente.model';
import { Evento } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
  private baseUrl = 'http://localhost:8060';

  constructor(private http: HttpClient) {}

  getUtente(username: string): Observable<Utente> {
    return this.http.get<Utente>(`${this.baseUrl}/utente/${username}`);
  }

  getSeguiti(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/utente/${username}/seguiti`);
  }

  getSeguaci(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/utente/${username}/seguaci`);
  }
}
