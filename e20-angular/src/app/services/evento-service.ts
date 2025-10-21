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
  uploadEventImage(id: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('immagine', image);
    return this.http.put(`${this.API_URL}/${id}/image`, formData);
  }

  // Get event image
  getEventImage(id: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/${id}/image`, {
      responseType: 'blob'
    });
  }

  // Create a new event
  createEvent(payload: any, headersObj: any): Observable<any> {
    const headers = new HttpHeaders(headersObj);
    return this.http.post(`${this.API_URL}`, payload, { headers });
  }

  createEventJson(token: string | null) {
    this.http.post(
      'https://localhost:8060/api/evento',
      {
        descrizione: "Concerto lesgosksdaus",
        organizzatore: "b467a568-9304-4d26-ab1b-67a53a053316",
        locationId: 1,
        nome: "Concert forever",
        posti: 100,
        b_riutilizzabile: false,
        b_nominativo: false,
        age_restricted: false,
        data: "2040-10-10",
        prezzo: 9.5
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



  override getApiUrl(): string {
    return this.API_URL;
  }
}
