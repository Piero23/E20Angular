import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Application, Dto} from './application';

export interface UtenteDto extends Dto {
  username: string;
  email: string;
  dataNascita: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtenteService extends Application<UtenteDto> {
  protected override API_URL = '/api/utente';

  /***********************CRUD OPERATIONS***********************/


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
