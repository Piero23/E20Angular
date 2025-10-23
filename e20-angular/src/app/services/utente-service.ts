import { Injectable } from '@angular/core';
import { Application, Dto } from './application';
import { Observable } from 'rxjs';

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
}
