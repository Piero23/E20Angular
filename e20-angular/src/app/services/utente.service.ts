// utente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Utente} from '../models/utente.model';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
  private base = 'http://localhost:8060'; // porta backend

  constructor(private http: HttpClient) {}

  getUtente(username: string): Observable<Utente> {
    return this.http.get<Utente>(`${this.base}/api/utente/${encodeURIComponent(username)}`);
  }

  getSeguiti(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/api/utente/${encodeURIComponent(username)}/seguiti`);
  }

  getSeguaci(username: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/api/utente/${encodeURIComponent(username)}/seguaci`);
  }

  getPreferiti(username: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.base}/api/utente/${encodeURIComponent(username)}/preferiti`);
  }
}
