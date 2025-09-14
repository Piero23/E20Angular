import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UtenteDto} from './utente-service';

export interface PageResponse<T> {
  content: T[];
  pageable: {
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    pageSize: number;
    pageNumber: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface Dto {
  id?: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export abstract class Application<T extends Dto> {
  protected readonly API_URL: string = '';

  constructor(protected http: HttpClient) {
  }

  // GET ALL ELEMENTS WITH PAGINATION
  getAllElements(
    page: number = 0,
    size: number = 20,
    sort?: string
  ): Observable<PageResponse<T>> {
    let params = new HttpParams()
      .set('page', Number(page))
      .set('size', Number(size));

    if (typeof sort === 'string') {
      params = params.set('sort', sort);
    }

    return this.http.get<PageResponse<T>>(this.API_URL, {params, withCredentials: true});
  }

  // SEARCH ELEMENTS WITH PAGINATION
  searchElements(
    searchTerm: string,
    page: number = 0,
    size: number = 20,
    sort?: string
  ): Observable<PageResponse<T>> {
    let params = new HttpParams()
      .set('page', Number(page))
      .set('size', Number(size));

    if (typeof sort === 'string') {
      params = params.set('sort', sort);
    }
    return this.http.get<PageResponse<T>>(`${this.API_URL}/search/${encodeURIComponent(searchTerm)}`, {
      params,
      withCredentials: true
    });
  }

  /***********************CRUD OPERATIONS***********************/
  get(id: number) {
    return this.http.get<T>(`${this.API_URL}/${id}`, {withCredentials: true});
  }

  // Create new utente
  create(item: T) {
    return this.http.post<T>(this.API_URL, item, {withCredentials: true});
  }

  // Update utente
  update(id: number, item: T) {
    return this.http.put<T>(`${this.API_URL}/${id}`, item, {withCredentials: true});
  }

  // Delete utente
  delete(id: number) {
    return this.http.delete<never>(`${this.API_URL}/${id}`, {withCredentials: true});
  }
}
