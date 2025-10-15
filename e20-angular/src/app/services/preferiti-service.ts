import {Injectable} from '@angular/core';
import {Application, Dto} from './application';
import {Observable} from 'rxjs';

interface PreferitoDto extends Dto {
  utente_id: number;
  evento_id: number
}

@Injectable({
  providedIn: 'root'
})
export class PreferitiService extends Application<PreferitoDto> {
  protected override API_URL = '/api/preferiti';

  addToFavorites(utente_id: number, evento_id: number): Observable<any> {

    return this.http.post(`${this.API_URL}/utente/${utente_id}/evento/${evento_id}`, null);
    console.log("Evento aggiunto ai preferiti")
  }
}
