import {Injectable} from '@angular/core';
import {Application, Dto} from './application';
import {map, Observable, switchMap} from 'rxjs';

export interface UtenteDto extends Dto{
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

  getSeguiti(token: string | null): Observable<UtenteDto[]> {
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

  getSeguaci(token: string | null): Observable<UtenteDto[]> {
    return this.getUsername(token).pipe(
      switchMap((username) => {
        console.log('Username:', username);
        return this.http.get<UtenteDto[]>(`${this.API_URL}/${username}/seguaci`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      })
    );
  }

  seguiUtente(token: string | null, myUsername: string | null, username: string | null) {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.post(`${this.API_URL}/${myUsername}/seguiti`, { username }, { headers });
  }

  unfollowUtente(token: string | null, myUsername: string | null, username: string | null) {
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    return this.http.delete(`${this.API_URL}/${myUsername}/seguiti`, {
      headers,
      body: { username }
    });
  }


  getSeguitiByUsername(token: string | null, username: string): Observable<UtenteDto[]> {
    return this.http.get<UtenteDto[]>(`${this.API_URL}/${username}/seguiti`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getSeguaciByUsername(token: string | null, username: string): Observable<UtenteDto[]> {
    return this.http.get<UtenteDto[]>(`${this.API_URL}/${username}/seguaci`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getUserByUsername(token: string | null, username: string): Observable<UtenteDto> {
    return this.http.get<UtenteDto>(`${this.API_URL}/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
