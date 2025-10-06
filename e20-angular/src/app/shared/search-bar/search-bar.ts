import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { EventoDto, EventoService } from '../../services/evento-service';
import { UtenteDto, UtenteService } from '../../services/utente-service';
import { Dto, SearchResponse } from '../../services/application';
import { Router, RouterLink, } from '@angular/router';

interface CombinedResults {
  users: Dto[];
  events: Dto[];
  all: Dto[];
  totalElements: number;
}

@Component({
  selector: 'app-search-bar',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './search-bar.html',
  styleUrls: ['./search-bar.css']
})

export class SearchBar implements OnInit, OnDestroy {
  searchQuery = '';
  isLoading = false;
  hasError = false;
  errorMessage = '';
  totalElements = 0;

  userResults: UtenteDto[] = [];
  eventResults: EventoDto[] = [];
  results: Dto[] = [];

  isSearchMode = false;

  showUsers = true;
  showEvents = true;

  private destroy$ = new Subject<void>();

  private searchTerms = new Subject<string>();

  constructor(
    private eventoService: EventoService,
    private utenteService: UtenteService,
    private router: Router
  ) { }

  ngOnInit(): void {

    // Setup search with debounce
    this.searchTerms.pipe(
      debounceTime(200),
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
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPage(id: string) {
    this.router.navigate(['/evento', id])
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
    this.searchTerms.next('');
    this.searchQuery = '';
    this.isSearchMode = false;
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

  isUser(item: Dto): boolean {
    return 'username' in item;
  }

  isEvent(item: Dto): boolean {
    return !('username' in item);
  }

  getElementName(item: Dto): string {
    if (this.isUser(item))
      return (item as UtenteDto).username;
    return item.nome;
  }

  getElementId(item: Dto): number | undefined {
    return item.id;
  }

  getEventDate(item: Dto): string {
    return (item as EventoDto).data;
  }

  getEventPrice(item: Dto): number {
    return (item as EventoDto).prezzo;
  }

  private searchAllDataObservable(term: string) {
    return forkJoin({
      users: this.utenteService.searchElements(term).pipe(
        catchError(error => {
          console.error('Search users error:', error);
          return of({ content: [], totalPages: 0, totalElements: 0 } as unknown as SearchResponse<Dto>);
        })
      ),
      events: this.eventoService.searchElements(term).pipe(
        catchError(error => {
          console.error('Search events error:', error);
          return of({ content: [], totalPages: 0, totalElements: 0 } as unknown as SearchResponse<Dto>);
        })
      )
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
    };
  }

  private handleError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
    this.isLoading = false;
  }
}
