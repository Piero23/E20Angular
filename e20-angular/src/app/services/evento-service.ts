import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Application, Dto} from './application';

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

  // Upload event image
  uploadEventImage(id: number, image: File): Observable<unknown> {
    const formData = new FormData();
    formData.append('immagine', image);

    return this.http.put(`${this.API_URL}/${id}/image`, formData);
  }

  // Get event image
  getEventImage(id: number) {
    return this.http.get(`${this.API_URL}/${id}/image`, {
      responseType: 'blob'
    });
  }

  // Get remaining spots
  getRemainingSpots(id: number) {
    return this.http.get<number>(`${this.API_URL}/${id}/spots`);
  }
}
