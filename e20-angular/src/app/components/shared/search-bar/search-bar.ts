import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { EventoBasicDto, EventoService, PageResponse } from '../../../services/evento-service';

@Component({
  selector: 'app-evento-search',
  standalone: true, // Add this for standalone component
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule // This provides HttpClient for the service
  ],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class EventoSearch implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private searchTerms = new Subject<string>();

  searchQuery = '';
  isLoading = false;
  hasError = false;
  errorMessage = '';

  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;

  // Results
  eventi: EventoBasicDto[] = [];
  isSearchMode = false; // Track if we're showing search results or all events

  constructor(private eventoService: EventoService) { }

  ngOnInit(): void {
    // Load initial events
    this.loadAllEvents();

    // Setup search with debounce
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.trim() === '') {
          this.isSearchMode = false;
          return this.eventoService.getAllEvents(0, this.pageSize);
        } else {
          this.isSearchMode = true;
          this.isLoading = true;
          return this.eventoService.searchEvents(term, 0, this.pageSize);
        }
      }),
      catchError(error => {
        console.error('Search error:', error);
        this.hasError = true;
        this.errorMessage = 'Errore durante la ricerca. Riprova più tardi.';
        this.isLoading = false;
        //@ts-ignore
        return of({ content: [], totalPages: 0, totalElements: 0 } as PageResponse<EventoBasicDto>);
      }),
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.updateResults(response);
      this.isLoading = false;
      this.currentPage = 0; // Reset to first page
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchInputChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.searchTerms.next(this.searchQuery);
  }

  onSearchClick(): void {
    if (this.searchQuery.trim()) {
      this.searchTerms.next(this.searchQuery);
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearchClick();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isSearchMode = false;
    this.loadAllEvents();
  }

  // Pagination methods
  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadPage(page);
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  private loadPage(page: number): void {
    this.isLoading = true;

    const request$ = this.isSearchMode
      ? this.eventoService.searchEvents(this.searchQuery, page, this.pageSize)
      : this.eventoService.getAllEvents(page, this.pageSize);

    request$.pipe(
      catchError(error => {
        console.error('Load page error:', error);
        this.hasError = true;
        this.errorMessage = 'Errore durante il caricamento. Riprova più tardi.';
        //@ts-ignore
        return of({ content: [], totalPages: 0, totalElements: 0 } as PageResponse<EventoBasicDto>);
      }),
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.updateResults(response);
      this.isLoading = false;
    });
  }

  public loadAllEvents(): void {
    this.isLoading = true;
    this.eventoService.getAllEvents(0, this.pageSize).pipe(
      catchError(error => {
        console.error('Load all events error:', error);
        this.hasError = true;
        this.errorMessage = 'Errore durante il caricamento degli eventi.';
        //@ts-ignore
        return of({ content: [], totalPages: 0, totalElements: 0 } as PageResponse<EventoBasicDto>);
      }),
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.updateResults(response);
      this.isLoading = false;
    });
  }

  private updateResults(response: PageResponse<EventoBasicDto>): void {
    this.eventi = response.content || [];
    this.totalPages = response.totalPages || 0;
    this.totalElements = response.totalElements || 0;
    this.hasError = false;
    this.errorMessage = '';
  }

  // Utility methods for template
  getPaginationArray(): number[] {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

    // Adjust start if we're at the end
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrice(price: number): string {
    return price === 0 ? 'Gratuito' : `€${price.toFixed(2)}`;
  }
}
