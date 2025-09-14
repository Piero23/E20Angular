import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {forkJoin, of, Subject} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil} from 'rxjs/operators';
import {EventoDto, EventoService} from '../../../services/evento-service';
import {UtenteDto, UtenteService} from '../../../services/utente-service';
import {Dto, PageResponse} from '../../../services/application';

// Define the combined result type
interface CombinedResults {
  users: Dto[];
  events: Dto[];
  all: Dto[]; // Combined array for display
  totalElements: number;
  totalPages: number;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})
export class SearchBar implements OnInit, OnDestroy {
  searchQuery = '';
  isLoading = false;
  hasError = false;
  errorMessage = '';
  // Pagination
  currentPage = 0;
  pageSize = 20;
  totalPages = 0;
  totalElements = 0;
  // Results - separate arrays for different types
  userResults: UtenteDto[] = [];
  eventResults: EventoDto[] = [];
  results: Dto[] = []; // Combined results for display
  isSearchMode = false;
  // Filter options
  showUsers = true;
  showEvents = true;
  private destroy$ = new Subject<void>();
  private searchTerms = new Subject<string>();

  constructor(
    private eventoService: EventoService,
    private utenteService: UtenteService
  ) {
  }

  ngOnInit(): void {

    // Setup search with debounce
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => {
        this.isSearchMode = true;
        this.isLoading = true;
        return this.searchAllDataObservable(term);
      }),
      catchError(error => {
        console.error('Search error:', error);
        this.handleError('Errore durante la ricerca. Riprova più tardi.');
        return of(this.createEmptyResults());
      }),
      takeUntil(this.destroy$)
    ).subscribe(combinedResults => {
      this.updateAllResults(combinedResults);
      this.isLoading = false;
      this.currentPage = 0;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Event handlers
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

    if (event.key === 'Backspace') {
      this.searchQuery = '';
      this.isSearchMode = false;
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.isSearchMode = false;
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

  // Utility methods for template
  getPaginationArray(): number[] {
    const pages = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(0, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages - 1, startPage + maxPagesToShow - 1);

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

  // Helper methods to identify item types in template
  isUser(item: Dto): boolean {
    return 'username' in item;
  }

  isEvent(item: Dto): boolean {
    return !('username' in item);
  }

  // Helper methods to safely access typed properties
  getUserUsername(item: Dto): string {
    return (item as UtenteDto).username;
  }

  getUserEmail(item: Dto): string {
    return (item as UtenteDto).email;
  }

  getUserDataNascita(item: Dto): string {
    return (item as UtenteDto).dataNascita;
  }

  getEventData(item: Dto): string {
    return (item as EventoDto).data;
  }

  hasEventData(item: Dto): boolean {
    return !!(item as EventoDto).data;
  }

  private searchAllDataObservable(term: string) {
    return forkJoin({
      users: this.utenteService.searchElements(term, this.currentPage, this.pageSize).pipe(
        catchError(error => {
          console.error('Search users error:', error);
          return of({content: [], totalPages: 0, totalElements: 0} as unknown as PageResponse<Dto>);
        })
      ),
      events: this.eventoService.searchElements(term, this.currentPage, this.pageSize).pipe(
        catchError(error => {
          console.error('Search events error:', error);
          return of({content: [], totalPages: 0, totalElements: 0} as unknown as PageResponse<Dto>);
        })
      )
    });
  }

  private loadPage(page: number): void {
    // Only load pages if we're in search mode
    if (!this.isSearchMode || !this.searchQuery.trim()) return;

    this.isLoading = true;

    const request$ = this.searchAllDataObservable(this.searchQuery);

    request$.pipe(
      catchError(error => {
        console.error('Load page error:', error);
        this.handleError('Errore durante il caricamento. Riprova più tardi.');
        return of(null);
      }),
      takeUntil(this.destroy$)
    ).subscribe(combinedResults => {
      if (combinedResults) {
        this.updateAllResults(combinedResults);
      }
      this.isLoading = false;
    });
  }

  // Result management
  private updateAllResults(response: any): void {
    // Store separate results with proper typing
    this.userResults = (response.users?.content || []) as UtenteDto[];
    this.eventResults = (response.events?.content || []) as EventoDto[];

    // Calculate totals
    const userTotal = response.users?.totalElements || 0;
    const eventTotal = response.events?.totalElements || 0;

    this.totalElements = userTotal + eventTotal;
    this.totalPages = Math.max(
      response.users?.totalPages || 0,
      response.events?.totalPages || 0
    );

    // Update display
    this.updateDisplayResults();
    this.hasError = false;
    this.errorMessage = '';
  }

  private updateDisplayResults(): void {
    this.results = [];

    if (this.showUsers) {
      this.results.push(...this.userResults);
    }

    if (this.showEvents) {
      this.results.push(...this.eventResults);
    }
  }

  private createEmptyResults(): CombinedResults {
    return {
      users: [],
      events: [],
      all: [],
      totalElements: 0,
      totalPages: 0
    };
  }

  private handleError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
    this.isLoading = false;
  }
}
