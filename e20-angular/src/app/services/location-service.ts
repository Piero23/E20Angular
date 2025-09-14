import {Injectable} from '@angular/core';

export interface LocationDto {
  id?: number;
  nome: string;
  descrizione: string;
  chiuso: boolean;
  position: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {

}
