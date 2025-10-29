import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Application, Dto} from './application';
import {LocationDto} from './location-service';
import {HttpHeaders} from '@angular/common/http';

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

  buyTicket(payload: any, token: string | null) {
    this.http.post<{ url: string }>(
      '/api/stripe/checkout',
      payload,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    ).subscribe({
      next: (response) => {
        console.log('Redirect URL:', response.url);
        window.location.href = response.url;
      },
      error: (err) => {
        console.error('Errore durante il checkout:', err);
      }
    });
  }

  updateEvent(id: number, payload: any, token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put(`${this.API_URL}/${id}`, payload, { headers });
  }

  override getApiUrl(): string {
    return this.API_URL;
  }
}
