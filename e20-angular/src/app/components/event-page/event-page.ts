import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventoDto, EventoService} from '../../services/evento-service';
import {EMPTY, Subject, switchMap, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {LocationDto, LocationService} from '../../services/location-service';
import {PreferitiService} from '../../services/preferiti-service';
import {UtenteDto} from '../../services/utente-service';
import {AuthService} from '../../services/auth-service';

@Component({
  selector: 'app-event-page',
  imports: [],
  templateUrl: './event-page.html',
  styleUrl: './event-page.css'
})
export class EventPage implements OnInit, OnDestroy {
  evento: EventoDto | null = null;
  location: LocationDto | null = null;
  utente: UtenteDto | null = null;
  isLoading = true;
  hasError = false;
  errorMessage = '';
  isNotificationActive = false;
  isFavorite = false;
  showSuccessMessage = false;
  successMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private locationService: LocationService,
    private preferitiService: PreferitiService,
    private authService: AuthService,
  ) {
  }

  getImageUrl(): string {
    if (!this.evento?.id) {
      return '/assets/default-event.jpg';
    }
    return `${this.eventoService.getApiUrl()}/${this.evento.id}/image`;
  }

  onImageError(event: any): void {
    // Fallback to default image if the event image fails to load
    event.target.src = '/assets/default-event.jpg';
  }

  ngOnInit(): void {
    this.route.params
      .pipe(
        switchMap(params => {
          const eventId = Number(params['id']);

          if (!eventId || isNaN(eventId)) {
            this.handleError('ID evento non valido');
            return EMPTY; // Return empty observable to stop the chain
          }

          this.isLoading = true;
          this.hasError = false;

          return this.eventoService.getElementById(eventId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (evento) => {
          this.evento = evento;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading event:', error);
          this.handleError('Errore nel caricamento dell\'evento');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public loadEvent(): void {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));

    if (!eventId || isNaN(eventId)) {
      this.handleError('ID evento non valido');
      return;
    }


    this.isLoading = true;
    this.hasError = false;

    this.eventoService.getElementById(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (evento) => {
          this.evento = evento;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading event:', error);
          this.handleError('Errore nel caricamento dell\'evento');
        }
      });
  }

  toggleNotification(): void {
    // Implementation for notification toggle
    console.log('Notification toggled for event:', this.evento?.id);
  }

  toggleFavorite(): void {
    this.preferitiService.addToFavorites(this.utente!.id, this.evento!.id)
    console.log('Favorite toggled for event:', this.evento?.id);
  }

  buyTicket(): void {
    // Implementation for ticket purchase
    console.log('Buy ticket for event:', this.evento?.id);
  }

  // Helper methods for template
  getFormattedDate(): string {
    if (!this.evento?.data) return '';
    const date = new Date(this.evento.data);
    return date.toLocaleDateString('it-IT') + ' - ' + date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getLocationNome(): string {
    if (!this.evento) return '';
    return `${this.evento.location.nome}`;
  }

  getLocationPosition(): string {
    if (!this.evento) return '';
    return `${this.evento.location.position}`;

  }

  shareEvent() { /* sharing logic */
  }

  /*getFullAddress(): string {
    if (!this.evento) return '';
    return `${ this.evento.via } ${ this.evento.civico }, ${ this.evento.citta } (${ this.evento.provincia }) ${ this.evento.cap } `;
  }*/

  openInMaps() { /* maps navigation */
  }

  private handleError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
    this.isLoading = false;
  }
}
