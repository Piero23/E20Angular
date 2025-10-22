import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EventoDto {
  id?: number;
  nome: string;
  descrizione?: string;
  organizzatore?: string;
  locationId?: number | null;
  posti?: number | null;
  b_riutilizzabile?: boolean;
  b_nominativo?: boolean;
  data?: string;
  prezzo?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private baseUrl = 'http://localhost:8060/api/evento';

  constructor(private http: HttpClient) {}

  creaEvento(dto: EventoDto): Observable<EventoDto> {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post<EventoDto>(this.baseUrl, dto, { headers });
  }
}
