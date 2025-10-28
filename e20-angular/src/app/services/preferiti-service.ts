import { Injectable } from '@angular/core';
import { Application, Dto } from './application';
import { Observable } from 'rxjs';
import {HttpHeaders} from '@angular/common/http';
import {EventoDto} from './evento-service';


@Injectable({
  providedIn: 'root'
})
export class PreferitiService extends Application<EventoDto> {
  protected override API_URL = '/api/utente';

  addToFavorites(username: string, evento_id: number, token: string | null) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.API_URL}/${username}/preferiti`, {"eventoId": evento_id} ,{headers: headers, responseType: "text"});
    console.log("Evento aggiunto ai preferiti")
  }

  removeFromFavorites(username: string, evento_id: number, token: string | null) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.delete(`${this.API_URL}/${username}/preferiti`, {body: {"eventoId": evento_id}, headers: headers, responseType: 'text'});
    console.log("Evento rimosso dai preferiti")
  }

  getFavorites(username: string, token: string | null): Observable<Array<EventoDto>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<EventoDto[]>(`${this.API_URL}/${username}/preferiti`, {headers: headers});
  }
}
