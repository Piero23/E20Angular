import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

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
