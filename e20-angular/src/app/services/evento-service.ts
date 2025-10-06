import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application, Dto } from './application';
import { LocationService } from './location-service';

export interface EventoDto extends Dto {
  descrizione: string;
  organizzatore: string;
  posti: number;
  b_riutilizzabile: boolean;
  b_nominativo: boolean;
  age_restricted: boolean;
  data: string; // Date as ISO string from backend
  prezzo: number;
  location: number;
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

  override getApiUrl(): string {
    return this.API_URL;
  }
}
