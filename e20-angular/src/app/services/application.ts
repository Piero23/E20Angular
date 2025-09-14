import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

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

  constructor(protected http: HttpClient) { }

  // GET ALL ELEMENTS WITH PAGINATION
  getAllElements(
    page: number = 0,
    size: number = 20,
    sort?: string
  ): Observable<PageResponse<T>> {
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    return this.http.get<PageResponse<T>>(this.API_URL, { params });
  }

  // SEARCH ELEMENTS WITH PAGINATION
  searchElements(
    searchTerm: string,
    page: number = 0,
    size: number = 20,
    sort?: string
  ): Observable<PageResponse<T>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }
    return this.http.get<PageResponse<T>>(`${this.API_URL}/search/${encodeURIComponent(searchTerm)}`, {params});
  }

  /***********************CRUD OPERATIONS***********************/
  getElementById(id: number): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/${id}`);
  }
}
