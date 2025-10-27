import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventoDto, EventoService} from '../../services/evento-service';
import {EMPTY, Subject, switchMap, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {PreferitiService} from '../../services/preferiti-service';
import {UtenteDto, UtenteService} from '../../services/utente-service';
import {AuthService} from '../../services/auth-service';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {environment} from '../../../environments/environment';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {LocationDto, LocationService} from '../../services/location-service';

@Component({
  selector: 'app-event-page',
  imports: [
    ReactiveFormsModule
  ],
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
  cityNameToShow = '';
  userId = '';
  editForm!: FormGroup;
  showEditForm: boolean = false;
  selectedFile: File | null = null;
  imageLoaded = false;
  previewUrl: any;

  mapUrl: SafeResourceUrl;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private authService: AuthService,
    private preferitiService: PreferitiService,
    private userService: UtenteService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private fb: FormBuilder,
    private locationService: LocationService
  ) {

    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps/embed/v1/place?key=${environment.googleMapsApiKey}&q=Italy`
    );
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
    this.loadUserId();
    if (this.authService.token) {
      this.userService.getMe(this.authService.token)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (utente) => {
            this.utente = utente;
            console.log('Utente caricato:', this.utente);

            if (this.authService.token) {
              this.preferitiService.getFavorites(this.utente!.username, this.authService.token)
                .pipe(takeUntil(this.destroy$)) // Aggiungi questo per evitare memory leaks
                .subscribe({
                  next: (favorites) => {
                    this.isFavorite = favorites.some(favorite => favorite.id === this.evento?.id);
                  },
                  error: (error) => {
                    console.error('Impossibile caricare preferiti:', error);
                    this.handleError('Impossibile caricare preferiti');
                  }
                });
            }
          },
          error: (error) => {
            console.error('Errore caricamento utente:', error);
          }
        });
    }

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
        next: async (evento) => {
          this.evento = evento;
          const dataEvento =  new Date(this.evento.data).toISOString().split('T')[0];
          const oraEvento = new Date(this.evento.data).toLocaleTimeString("it-IT", {
            hour: '2-digit',
            minute: '2-digit'
          });
          console.log(dataEvento, oraEvento);
          if (this.evento?.location?.position) {
            this.cityNameToShow = await this.resolveCityName(this.evento.location.position);
          }
          this.isLoading = false;
          this.updateMapUrl();
          this.previewUrl = this.getImageUrl();
          this.editForm = this.fb.group({
            nome: this.evento?.nome,
            data: dataEvento,
            ora: oraEvento,
            location: this.evento.location.nome,
            posti: this.evento.posti,
            prezzo: this.evento.prezzo,
            b_nominativo: this.evento.b_nominativo,
            b_riutilizzabile: this.evento.b_riutilizzabile,
            age_restricted: this.evento.age_restricted,
            descrizione: this.evento.descrizione,
            organizzatore: this.evento.organizzatore
          })
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
    console.log("prima del toggle: " + this.isFavorite);

    if (!this.authService.token) {
      alert('Devi essere loggato per avere dei preferiti');
      return;
    }

    const token = this.authService.token;
    const wasLiked = this.isFavorite;

    // Aggiorna subito l'UI (feedback immediato)
    this.isFavorite = !this.isFavorite;

    if (wasLiked) {
      // Era nei preferiti, lo rimuovo
      this.preferitiService.removeFromFavorites(
        this.utente!.username,
        this.evento!.id,
        token
      ).subscribe({
        next: () => console.log('Rimosso dai preferiti'),
        error: (err) => {
          console.error('Errore rimozione:', err);
          this.isFavorite = wasLiked; // Ripristina in caso di errore
          alert('Errore durante la rimozione dai preferiti');
        }
      });
    } else {
      // Non era nei preferiti, lo aggiungo
      this.preferitiService.addToFavorites(
        this.utente!.username,
        this.evento!.id,
        token
      ).subscribe({
        next: () => console.log('Aggiunto ai preferiti'),
        error: (err) => {
          console.error('Errore aggiunta:', err);
          this.isFavorite = wasLiked; // Ripristina in caso di errore
          alert('Errore durante l\'aggiunta ai preferiti');
        }
      });
    }

    console.log("dopo il toggle: " + this.isFavorite);
  }

  // Helper methods for template
  isSubmitting: any;
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

  private async resolveCityName(position: string): Promise<string> {
    if (!position) return '';

    // Check if position looks like coordinates: "lat,lng"
    const coordMatch = position.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
    if (!coordMatch) {
      // Not coordinates, treat as city name
      return position;
    }

    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[3]);

    // Reverse geocode using Nominatim
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=it`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data.address.city || data.address.town || data.address.village || data.address.state || data.address.country || position;
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
      return position; // fallback to original string
    }
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
    if (!this.authService.token){
      console.error("Devi essere loggato per comprare i biglietti");
      alert('Devi essere loggato per comprare i biglietti');
    }
    else{
      this.router.navigate(['checkout'], { relativeTo: this.route });
    }
  }

  loadUserId() {
    if (!this.authService.token) {
      return;
    }
    this.userService.getMe(this.authService.token).subscribe({
      next: (data) => {
        this.utente = data;
        this.userId = data.id.toString();
      },
      error: (err) => {
        console.error('Failed to load user:', err);
      }
    });
  }

  openEditForm() {
    this.showEditForm = true;
    console.log("Edit form opened");
  }

  closeEditForm() {
    this.showEditForm = false;
    console.log("Edit form closed");
  }

  saveEditedform() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    if (this.selectedFile && !this.imageLoaded) {
      alert('Attendi che l\'immagine sia stata caricata completamente prima di procedere.');
      return;
    }

    this.isSubmitting = true;
    const token = this.authService.token;
    const locationName = this.editForm.get('location')?.value;

    this.locationService.getLocationByName(locationName, token).pipe(
      switchMap((location: LocationDto) => {
        const payload = this.buildPayload(location.id);
        return this.eventoService.updateEvent(this.evento!.id, payload, token);
      }),
      switchMap((createdEvent: any) => {
        const eventId = createdEvent.id;
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append('immagine', this.selectedFile);
          return this.eventoService.uploadEventImage(createdEvent.id, formData, token).pipe(
            switchMap(() => new Observable(observer => {
              observer.next(eventId);
              observer.complete();
            }))
          );
        } else {
          return new Observable((observer) => {
            observer.next(eventId);
            observer.complete();
          });
        }
      })
    ).subscribe({
      next: (eventId: any) => {
        console.log('Evento aggiornato');
        this.isSubmitting = false;
        alert('Evento aggiornato con successo');
        this.closeEditForm()
        // Redirect to newly created event page
        window.location.reload();
      },
      error: (err: any) => {
        console.error('Errore nella modifica dell\'evento:', err);
        this.isSubmitting = false;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const MAX_FILE_SIZE = 1024 * 1024; // 1 MB in bytes

    if (file.size > MAX_FILE_SIZE) {
      alert('L\'immagine è troppo grande. La dimensione massima consentita è di 1 MB.');
      this.selectedFile = null;
      this.previewUrl = null;
      this.imageLoaded = false;
      event.target.value = ''; // reset file input
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();

    reader.onload = () => {
      this.previewUrl = reader.result;
      this.imageLoaded = true; // ✅ Image successfully loaded
    };

    reader.onerror = () => {
      console.error('Errore nel caricamento dell\'immagine');
      this.imageLoaded = false;
      this.selectedFile = null;
      this.previewUrl = null;
      alert('Errore durante il caricamento dell\'immagine. Riprova.');
    };

    reader.readAsDataURL(file);
  }

  private buildPayload(locationId: number) {
    const dateValue = this.editForm.get('data')?.value;
    const timeValue = this.editForm.get('ora')?.value;
    const combinedDateTime = new Date(`${dateValue}T${timeValue}:00`);
    return {
      ...this.editForm.value,
      locationId: locationId,
      data: combinedDateTime
    };
  }

}
