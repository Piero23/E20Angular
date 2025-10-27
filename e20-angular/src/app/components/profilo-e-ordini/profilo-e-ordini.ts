import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RowbarSearch } from '../rowbar-search/rowbar-search';
import { EventoService } from '../../services/evento.service';
import { UtenteService } from '../../services/utente.service';
import { Evento } from '../../models/evento.model';
import { Utente } from '../../models/utente.model';
import { AuthService } from '../../services/auth-service';
import { Subject, EMPTY } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profilo-e-ordini',
  standalone: true,
  imports: [CommonModule, RowbarSearch],
  templateUrl: './profilo-e-ordini.html',
  styleUrls: ['./profilo-e-ordini.css']
})
export class ProfiloEOrdini implements OnInit, OnDestroy {
  ordini: Evento[] = [];
  preferiti: Evento[] = [];
  utente!: Utente;
  seguiti: string[] = [];
  seguaci: string[] = [];
  isLoading = true;
  hasError = false;
  errorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private eventoService: EventoService,
    private utenteService: UtenteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.token) {
      this.handleError('Devi essere loggato per vedere il profilo');
      return;
    }

    // Carica utente loggato
    this.utenteService.getMe(this.authService.token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (u) => {
          this.utente = u;
          this.seguiti = u.seguiti || [];
          this.seguaci = u.seguaci || [];
          console.log('Utente caricato:', this.utente);

          // Carica ordini e preferiti dopo aver ottenuto username
          this.loadOrdini();
          this.loadPreferiti();
        },
        error: (err) => this.handleError('Errore caricamento utente: ' + err)
      });
  }

  private loadOrdini(): void {
    if (!this.utente) return;

    this.eventoService.getOrdini(this.utente.username)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (ordini) => {
          this.ordini = ordini;
          console.log('Ordini utente:', this.ordini);
        },
        error: (err) => console.error('Errore caricamento ordini', err)
      });
  }

  private loadPreferiti(): void {
    if (!this.utente) return;

    this.eventoService.getPreferiti(this.utente.username)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (eventi) => {
          this.preferiti = eventi;
          console.log('Preferiti utente:', this.preferiti);
        },
        error: (err) => console.error('Errore caricamento preferiti', err)
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
}
