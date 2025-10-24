import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventoDto, EventoService } from '../../services/evento-service';
import { EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PreferitiService } from '../../services/preferiti-service';
import {UtenteDto, UtenteService} from '../../services/utente-service';
import { AuthService } from '../../services/auth-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-page',
  imports: [],
  templateUrl: './event-page.html',
  styleUrl: './event-page.css'
})
export class EventPage implements OnInit, OnDestroy {
  evento: EventoDto | null = null;
  utente: UtenteDto | null = null;
  isLoading = true;
  hasError = false;
  errorMessage = '';
  isNotificationActive = false;
  isFavorite = false;
  showSuccessMessage = false;
  successMessage = '';

  mapUrl: SafeResourceUrl;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private authService: AuthService,
    private preferitiService: PreferitiService,
    private userService: UtenteService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {

    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps/embed/v1/place?key=${environment.googleMapsApiKey}&q=Italy`
    )
  }

  getImageUrl(): string {
    if (!this.evento?.id) {
      return '/assets/event_placeholder.jpg';
    }
    return `${this.eventoService.getApiUrl()}/${this.evento.id}/image`;
  }

  onImageError(event: any): void {
    // Fallback to default image if the event image fails to load
    event.target.src = '/assets/event_placeholder.jpg';
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
          this.updateMapUrl();
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
          this.updateMapUrl();
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
    this.preferitiService.addToFavorites(this.utente!.id.toString(), this.evento!.id)
    console.log('Favorite toggled for event:', this.evento?.id);
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

  /*getFullAddress(): string {}*/

  openInMaps() { /* maps navigation */
  }



  private handleError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
    this.isLoading = false;
  }

  private updateMapUrl(): void {
    if (!this.evento?.location) return;

    const key = environment.googleMapsApiKey;

    // Combine name + position, encode safely
    const query = encodeURIComponent(
      `${this.evento.location.nome} ${this.evento.location.position}`
    );

    const url = `https://www.google.com/maps/embed/v1/place?key=${key}&q=${query}`;
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  checkout() {
    this.router.navigate(['checkout'], { relativeTo: this.route });
  }
}
