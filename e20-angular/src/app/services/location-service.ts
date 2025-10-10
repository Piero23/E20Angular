import { Injectable } from '@angular/core';
import { Application, Dto } from './application';

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
}
