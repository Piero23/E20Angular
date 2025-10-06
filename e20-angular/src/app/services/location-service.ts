import { Injectable } from '@angular/core';
import { Application, Dto } from './application';

export interface LocationDto extends Dto {
  descrizione: string;
  position: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService extends Application<LocationDto> {
  protected override API_URL = '/api/location';

  getLocationNome(id: string) {
    return this.http.get(`${this.API_URL}/${id}/nome`);
  }

  override getApiUrl(): string {
    return this.API_URL;
  }
}
