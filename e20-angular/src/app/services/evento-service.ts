import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application, Dto } from './application';
import { LocationDto } from './location-service';
import { HttpHeaders } from '@angular/common/http';

export interface EventoDto extends Dto {
  descrizione: string;
  organizzatore: string;
  posti: number;
  b_riutilizzabile: boolean;
  b_nominativo: boolean;
  age_restricted: boolean;
  data: string; // Date as ISO string from backend
  prezzo: number;
  location: LocationDto;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService extends Application<EventoDto> {
  protected override API_URL = '/api/evento';

  // Upload event image

  uploadEventImage(eventId: number, formData: FormData, token: string | null) {
    return this.http.put(`/api/evento/${eventId}/image`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }


  // Get event image
  getEventImage(id: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${id}/image`, {
      responseType: 'blob'
    });
  }

  // Create a new event
  createEvent(payload: any, token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.API_URL}`, payload, { headers });
  }

  createEventJson(payload: any, token: string | null) {
    this.http.post(
      this.API_URL,
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`, // <-- triggers preflight
          'Content-Type': 'application/json'
        },
        withCredentials: true  // optional, only if backend uses cookies
      }
    ).subscribe(res => console.log(res));
  }

  buyTicket(user_id: string, token: string | null) {
    this.http.post(
      'https://localhost:8060/api/stripe/checkout',
      {
        "utenteId": user_id,
        "valuta": "eur",
        "biglietti": [
          {
            "idEvento": 4,
            "email": "dgfdsfg@gmail.com",
            "eValido": true,
            "nome": "fsdfgsd",
            "cognome": "sdfgsdfg",
            "dataNascita": "1994-01-01"
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`, // <-- triggers preflight
          'Content-Type': 'application/json'
        },
        withCredentials: true  // optional, only if backend uses cookies
      }
    ).subscribe(res => console.log(res));

  }

  testandoPost() {
    this.http.post('/api/evento/testandolo', {}).subscribe(res => console.log(res));
  }

  override getApiUrl(): string {
    return this.API_URL;
  }
}
