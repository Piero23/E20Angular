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
}
