import {Injectable} from '@angular/core';
import {Application, Dto} from './application';
import {Observable} from 'rxjs';
import {HttpHeaders} from '@angular/common/http';

export interface LocationDto extends Dto {
  descrizione: string;
  chiuso: boolean;
  position: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService extends Application<LocationDto> {
  protected override API_URL = '/api/location';

  override getApiUrl(): string {
    return this.API_URL;
  }

  getLocationByName(nome: string, token: string | null): Observable<LocationDto> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.get<LocationDto>(`${this.API_URL}/nome/${nome}`, { headers });
  }

  createLocation(payload: any, token: string | null): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.API_URL}`, payload, { headers });
  }

}
