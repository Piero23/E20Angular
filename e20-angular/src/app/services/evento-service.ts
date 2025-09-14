import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Application, Dto, PageResponse} from './application';

export interface EventoDto extends Dto {
  descrizione: string;
  organizzatore: string;
  posti: number;
  b_riutilizzabile: boolean;
  b_nominativo: boolean;
  age_restricted: boolean;
  data: string; // Date as ISO string from backend
  prezzo: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService extends Application<EventoDto> {
  protected override API_URL = '/api/evento';
  /***********************CRUD OPERATIONS***********************/

  // Create new event
  createEvent(evento: EventoDto): Observable<EventoDto> {
    return this.http.post<EventoDto>(this.API_URL, evento);
  }

  // Update event
  updateEvent(id: number, evento: EventoDto): Observable<EventoDto> {
    return this.http.put<EventoDto>(`${this.API_URL}/${id}`, evento);
  }

  // Delete event
  deleteEvent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

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

  // Get remaining spots
  getRemainingSpots(id: number): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/${id}/spots`);
  }
}
