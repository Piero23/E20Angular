import { Injectable } from '@angular/core';
import { Application, Dto } from './application';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

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
}
