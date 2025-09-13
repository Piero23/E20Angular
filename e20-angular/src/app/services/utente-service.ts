import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UtenteDto {
  id?: number;
  username: string;
  email: string;
  dataNascita: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
  private readonly API_URL = '/api/utente';

  constructor(private http: HttpClient) { }

  // GET ALL USERS WITH PAGINATION
  /*getAllUtentes(page: number = 0, size: number = 20, sort?: string): Observable<PageResponse<UtenteDto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<PageResponse<UtenteDto>>(this.API_URL, { params });
  }*/

  /***********************CRUD OPERATIONS***********************/

  getUtenteById(id: number): Observable<UtenteDto> {
    return this.http.get<UtenteDto>(`${this.API_URL}/${id}`);
  }

  getUtenteByUsername(username: string): Observable<UtenteDto> {
    return this.http.get<UtenteDto>(`${this.API_URL}/${username}`)
  }

  // Create new utente
  createUtente(utente: UtenteDto): Observable<UtenteDto> {
    return this.http.post<UtenteDto>(this.API_URL, utente);
  }

  // Update utente
  updateUtente(id: number, utente: UtenteDto): Observable<UtenteDto> {
    return this.http.put<UtenteDto>(`${this.API_URL}/${id}`, utente);
  }

  // Delete utente
  deleteUtente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

}
