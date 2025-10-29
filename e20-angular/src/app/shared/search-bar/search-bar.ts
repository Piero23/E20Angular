import {Component, OnDestroy, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {forkJoin, of, Subject} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil} from 'rxjs/operators';
import {EventoDto, EventoService} from '../../services/evento-service';
import {UtenteDto, UtenteService} from '../../services/utente-service';
import {Dto, SearchResponse} from '../../services/application';
import {Router, RouterLink,} from '@angular/router';
import {AuthService} from '../../services/auth-service';

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
  myName: string = '';

  isSearchMode = false;

  showUsers = true;
  showEvents = true;

  followers : string[] = [];

  private destroy$ = new Subject<void>();

  private searchTerms = new Subject<string>();
  followersLoading: boolean = true;

  constructor(
    private eventoService: EventoService,
    private utenteService: UtenteService,
    private router: Router,
    private authService: AuthService
  ) {
    this.myName = authService.getUser()?.username
  }

  ngOnInit(): void {

    this.getFollowers()
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
          return of({content: [], totalPages: 0, totalElements: 0} as unknown as SearchResponse<Dto>);
        })
      ),
      events: this.eventoService.searchElements(term).pipe(
        catchError(error => {
          console.error('Search events error:', error);
          return of({content: [], totalPages: 0, totalElements: 0} as unknown as SearchResponse<Dto>);
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

  segui(item: Dto) {
    if (!this.isUser(item)) {
      console.warn('Tentativo di seguire un evento o elemento non utente.');
      return;
    }

    const user = item as UtenteDto;
    const token = this.authService.token;

    this.utenteService.getUsername(token).subscribe({
      next: (myUsername) => {
        if (myUsername === user.username) {
           alert(`Non puoi seguire te stesso`);
           return;
        }
        this.utenteService.seguiUtente(token, myUsername, user.username).subscribe({
          next: () => {
            console.log(`Ora segui ${user.username}`);
            alert(`Ora segui ${user.username}`);
          },
          error: (err) => {
            console.error('Errore durante il follow:', err);
          }
        });
      },
      error: (err) => {
        console.error('Errore nel recupero username:', err);
      }
    });
    this.ngOnInit();
  }

  goToProfile() {
    this.router.navigate(['/profilo']);
  }

  getFollowers(){
    this.followersLoading = true

    this.utenteService.getSeguiti(this.authService.token).subscribe({
      next: (utenti) => {
        console.log('Lista utenti:', utenti);
        utenti.forEach(amico =>{
          this.followers.push(amico.username);
        })
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore nel caricamento amici:', err);
        this.isLoading = false;
      }
    });
  }

  alredyFollowed(username: string): boolean {
    console.log('Alredy Followed' , this.followers);
    return this.followers.includes(username);
  }

  unfollow(result: Dto) {
    const user = result as UtenteDto;
    const token = this.authService.token;

    this.utenteService.getUsername(token).subscribe({
      next: (myUsername) => {
        if (myUsername === user.username) {
          alert(`Non puoi farlo su te stesso`);
          return;
        }
        this.utenteService.unfollowUtente(token, myUsername, user.username).subscribe({
          next: () => {
            console.log(`Non segui più ${user.username}`);
            alert(`Non segui più ${user.username}`);
          },
          error: (err) => {
            console.error('Errore durante unfollow:', err);
          }
        });
      },
      error: (err) => {
        console.error('Errore nel recupero username:', err);
      }
    });
    this.ngOnInit();
  }
}
