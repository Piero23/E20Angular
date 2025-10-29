import {Component, OnDestroy, OnInit} from '@angular/core';
import {PreferitiService} from '../../services/preferiti-service';
import {UtenteDto, UtenteService} from '../../services/utente-service';
import {AuthService} from '../../services/auth-service';
import {OrdiniService} from '../../services/ordine-service';
import {EventoDto} from '../../services/evento-service';
import {Evento} from '../../models/evento.model';
import {ActivatedRoute} from '@angular/router';
import { CommonModule } from '@angular/common';
import {Subject, of, switchMap, takeUntil, catchError, tap} from 'rxjs';
import {AccessDenied} from '../../shared/access-denied/access-denied';

@Component({
  selector: 'app-user-page',
  imports: [
    AccessDenied
  ],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css'
})
export class UserPage implements OnInit, OnDestroy {
  ordini: Evento[] = [];
  preferiti: EventoDto[] = [];
  utente!: UtenteDto;
  utenteId?: string | null;
  seguiti: UtenteDto[] = [];
  seguaci: UtenteDto[] = [];
  isLoading = true;
  hasError = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();


  constructor(
    private preferitiService: PreferitiService,
    private utenteService: UtenteService,
    private authService: AuthService,
    private ordineService: OrdiniService,
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(params => {
        const username = params.get('username');
        if (!username) {
          this.handleError('Username non trovato nell’URL');
          return of(null);
        }
        return this.loadUser(username);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  private loadUser(username: string) {
    this.isLoading = true;
    const token = this.authService.token;
    this.utenteService.getUserByUsername(token, username).pipe(
      tap((user: UtenteDto) => {
        this.utente = user;
        this.isLoading = false;
      }),
      switchMap(async () => this.loadRelations(username)), // return another observable
      catchError(err => {
        console.error('Errore caricamento utente:', err);
        this.handleError('Errore durante il caricamento del profilo utente.');
        return of(null);
      })
    ).subscribe();
  }

  private loadRelations(username: string) {
    const token = this.authService.token;

    this.utenteService.getSeguitiByUsername(token, username)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: seguiti => this.seguiti = seguiti,
        error: err => console.error('Errore caricamento seguiti:', err)
      });

    this.utenteService.getSeguaciByUsername(token, username)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: seguaci => this.seguaci = seguaci,
        error: err => console.error('Errore caricamento seguaci:', err)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
    this.isLoading = false;
  }


  isLogged(){
    return this.authService.isLoggedIn
  }
}
