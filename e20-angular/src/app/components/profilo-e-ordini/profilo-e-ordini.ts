import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventoService } from '../../services/evento-service';
import {UtenteDto, UtenteService} from '../../services/utente-service';
import { PreferitiService } from '../../services/preferiti-service';
import { Evento } from '../../models/evento.model';
import { Utente } from '../../models/utente.model';
import { AuthService } from '../../services/auth-service';
import {Subject, EMPTY, of, catchError, tap} from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import {OrdiniService} from '../../services/ordine-service';
import {EventoDto} from '../../services/evento-service';

@Component({
  selector: 'app-profilo-e-ordini',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profilo-e-ordini.html',
  styleUrls: ['./profilo-e-ordini.css']
})
export class ProfiloEOrdini implements OnInit, OnDestroy {
  ordini: Evento[] = [];
  preferiti: Evento[] = [];
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
    private ordineService: OrdiniService
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
        next: (u: UtenteDto) => {
          this.utente = u;
          this.utenteId = u.id.toString();
          console.log('Utente caricato:', this.utente);

          // Carica ordini e preferiti dopo aver ottenuto username
          this.loadOrdini();
          this.loadPreferiti();
        },
        error: (err: string) => this.handleError('Errore caricamento utente: ' + err)
      });

    this.utenteService.getSeguiti(this.authService.token).subscribe(
      seguiti => {
        this.seguiti = seguiti;
      }
    );
    this.utenteService.getSeguaci(this.authService.token).subscribe(
      seguaci => {
        this.seguaci = seguaci;
      }
    );
  }

  private loadOrdini(): void {
    // se non vuoi eseguire nulla quando utente non presente:
    if (!this.authService.token) return;

    this.utenteService.getMe(this.authService.token).pipe(
      takeUntil(this.destroy$),
      tap((utente: UtenteDto) => {
        this.utente = utente;                   // salvo l'utente
        console.log('Utente caricato:', this.utente);
      }),
      switchMap(() => this.ordineService.getOrdini(this.authService.token, this.utenteId!!)), // esegui richiesta ordini
      catchError((err: any) => {
        console.error('Errore caricamento ordini (pipe)', err);
        return of([]); // fallback: array vuoto di ordini
      })
    ).subscribe({
      next: (ordini: any) => {
        this.ordini = ordini;
        console.log('Ordini utente:', this.ordini);
      },
      error: (err: any) => console.error('Errore caricamento ordini (subscribe)', err)
    });
    console.log(this.ordini);
  }

  private loadPreferiti(): void {
    if (!this.utente) return;

    this.utenteService.getUsername(this.authService.token).pipe(
      takeUntil(this.destroy$),
      switchMap((username: string) => {
        if (!username) return of([] as EventoDto[]);
        return this.preferitiService.getFavorites(username, this.authService.token);
      }),
      catchError((err: any) => {
        console.error('Errore durante il caricamento preferiti (pipe)', err);
        return of([] as EventoDto[]);
      })
    ).subscribe({
      next: (eventi: any) => {
        this.preferiti = eventi;
        console.log('Preferiti utente:', this.preferiti);
      },
      error: (err: any) => console.error('Errore caricamento preferiti (subscribe)', err)
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
