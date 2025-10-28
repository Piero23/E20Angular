import {Injectable} from '@angular/core';
import {Application, Dto} from './application';
import {map, Observable, switchMap} from 'rxjs';

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

  override getApiUrl(): string {
    return this.API_URL;
  }

  getMe(token: string | null): Observable<UtenteDto> {
    return this.http.get<UtenteDto>(`${this.API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getUsername(token: string | null): Observable<string> {
    return this.getMe(token).pipe(
      map((utente: UtenteDto) => utente.username)
    );
  }

  getAmici(token: string | null): Observable<UtenteDto[]> {
    return this.getUsername(token).pipe(
      switchMap((username) => {
        console.log('Username:', username);
        return this.http.get<UtenteDto[]>(`${this.API_URL}/${username}/seguiti`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      })
    );
  }
}
