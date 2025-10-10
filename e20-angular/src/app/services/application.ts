import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SearchResponse<T> {
  content: T[];
  totalElements: number;
}

export interface Dto {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export abstract class Application<T extends Dto> {
  protected readonly API_URL: string = '';

  constructor(protected http: HttpClient) {
  }

  // SEARCH ELEMENTS
  searchElements(
    searchTerm: string,
  ): Observable<SearchResponse<T>> {
    return this.http.get<SearchResponse<T>>(`${this.API_URL}/search/${encodeURIComponent(searchTerm)}`);
  }

  /***********************CRUD OPERATIONS***********************/
  createElement(element: T): Observable<T> {
    return this.http.post<T>(this.API_URL, element);
  }

  updateElement(id: number, element: T): Observable<T> {
    return this.http.put<T>(`${this.API_URL}/${id}`, element);
  }

  deleteElement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getElementById(id: number): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/${id}`);
  }

  getElementByName(nome: string): Observable<T> {
    return this.http.get<T>(`${this.API_URL}/${nome}`);
  }

  getAllElementsPaginated(page: number = 0, size: number = 100): Observable<SearchResponse<T>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<SearchResponse<T>>(this.API_URL, { params });
  }
  getApiUrl(): string {
    return this.API_URL;
  }

}
