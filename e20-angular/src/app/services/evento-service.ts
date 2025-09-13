import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocationService } from './location-service';

export interface EventoDto {
  id?: number;
  nome: string;
  descrizione: string;
  organizzatore: string;
  posti: number;
  b_riutilizzabile: boolean;
  b_nominativo: boolean;
  age_restricted: boolean;
  // location: LocationDto | null;
  data: string; // Date as ISO string from backend
  prezzo: number;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventoService {
  private readonly API_URL = '/api/evento';

  constructor(private http: HttpClient) { }

  // GET ALL EVENTS WITH PAGINATION
  getAllEvents(page: number = 0, size: number = 20, sort?: string): Observable<PageResponse<EventoDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<PageResponse<EventoDto>>(this.API_URL, { params });
  }

  // SEARCH EVENTS WITH PAGINATION
  searchEvents(searchTerm: string, page: number = 0, size: number = 20, sort?: string): Observable<PageResponse<EventoDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<PageResponse<EventoDto>>(`${this.API_URL}/search/${encodeURIComponent(searchTerm)}`, { params });
  }

  getEventById(id: number): Observable<EventoDto> {
    return this.http.get<EventoDto>(`${this.API_URL}/${id}`);
  }

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

  // TODO: Get bookings for event (ORGANIZER)
  /*
  getEventImagetEventBookings(id: number): Observable<BigliettoDto[]> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<BigliettoDto[]>(`${this.API_URL}/bookings`, { params });
  }
  */

  // TODO: Get user's event
}
