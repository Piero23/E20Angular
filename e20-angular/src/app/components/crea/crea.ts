import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { EventoService } from '../../services/evento-service';
import { UtenteDto, UtenteService } from '../../services/utente-service';
import { LocationDto, LocationService } from '../../services/location-service';
import { Observable, switchMap } from 'rxjs';
import { Router } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-crea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crea.html',
  styleUrls: ['./crea.css']
})
export class Crea implements OnInit {
  form: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isSubmitting = false;
  user: UtenteDto | null = null;
  user_id: string = '';

  locationForm: FormGroup;
  showLocation = false;

  // Variabili per la mappa
  private map: L.Map | undefined;
  private marker: L.Marker | undefined;
  selectedLat: number | null = null;
  selectedLng: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private eventService: EventoService,
    private userService: UtenteService,
    private locationService: LocationService,
    private router: Router
  ) {
    this.form = this.fb.group({});
    this.locationForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Fix per i marker icons di Leaflet in Angular
    this.fixLeafletIconPath();

    // Get the user id
    this.userService.getMe(this.authService.token).subscribe({
      next: (data) => {
        this.user = data;
        this.user_id = data.id.toString();
      },
      error: (err) => {
        console.error('Failed to load user:', err);
      }
    });
    this.form = this.createForm();
  }

  initPopup(): void {
    this.showLocation = true;
    this.locationForm = this.fb.group({
      nomeLocation: ['', Validators.required],
      al_chiuso: [false]
    });

    // Inizializza la mappa dopo che il DOM è stato renderizzato
    setTimeout(() => {
      this.initMap();
    }, 300); // Aumentato il timeout
  }

  closePopup(): void {
    this.showLocation = false;
    if (this.map) {
      this.map.remove();
      this.map = undefined;
    }
    this.marker = undefined;
    this.selectedLat = null;
    this.selectedLng = null;
  }

  private initMap(): void {
    // Verifica che l'elemento esista
    const mapElement = document.getElementById('mapPicker');
    if (!mapElement) {
      console.error('Map element not found');
      return;
    }

    // Rimuovi eventuali mappe precedenti
    if (this.map) {
      this.map.remove();
    }

    // Inizializza la mappa centrata sull'Italia
    this.map = L.map('mapPicker', {
      center: [41.9028, 12.4964], // Roma come centro default
      zoom: 6
    });

    // Aggiungi tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Forza il resize della mappa
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);

    // Gestisci il click sulla mappa
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.setMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  // Metodo per cercare un luogo tramite la barra di ricerca
  searchLocation(input: any): void {
    const query = input.value;
    if (!query || query.trim() === '') {
      return;
    }

    // Usa Nominatim API per la geocodifica
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lng = parseFloat(result.lon);

          this.setMarker(lat, lng);
        } else {
          alert('Nessun risultato trovato');
        }
      })
      .catch(error => {
        console.error('Errore nella ricerca:', error);
        alert('Errore durante la ricerca');
      });
  }

  private setMarker(lat: number, lng: number): void {
    // Rimuovi il marker precedente se esiste
    if (this.marker) {
      this.marker.remove();
    }

    // Crea un nuovo marker
    this.marker = L.marker([lat, lng]).addTo(this.map!);

    // Aggiorna le coordinate selezionate
    this.selectedLat = lat;
    this.selectedLng = lng;

    // Centra la mappa sul marker
    this.map?.setView([lat, lng], 13);
  }

  private fixLeafletIconPath(): void {
    // Fix per il path delle icone di Leaflet in Angular
    // Usa le icone direttamente da CDN
    const iconRetinaUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png';
    const iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png';
    const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }

  createForm() {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descrizione: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      location: ['', Validators.required],
      posti: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      prezzo: ['', Validators.min(0)],
      data: ['', Validators.required],
      ora: ['', Validators.required],
      b_riutilizzabile: [false],
      b_nominativo: [false],
      age_restricted: [false]
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  buildPayload(locationId: number) {
    const dateValue = this.form.get('data')?.value;
    const timeValue = this.form.get('ora')?.value;
    const combinedDateTime = new Date(`${dateValue}T${timeValue}:00`);
    return {
      ...this.form.value,
      organizzatore: this.user_id,
      locationId,
      data: combinedDateTime,
    };
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.selectedFile) {
      console.warn('No file selected, proceeding without image.');
    }
    this.isSubmitting = true;
    const token = this.authService.token;
    const locationName = this.form.get('location')?.value;

    this.locationService.getLocationByName(locationName, token).pipe(
      switchMap((location: LocationDto) => {
        const payload = this.buildPayload(location.id);
        return this.eventService.createEvent(payload, token);
      }),
      switchMap((createdEvent: any) => {
        if (this.selectedFile) {
          const formData = new FormData();
          formData.append('immagine', this.selectedFile);
          return this.eventService.uploadEventImage(createdEvent.id, formData, token);
        } else {
          return new Observable((observer) => {
            observer.next(null);
            observer.complete();
          });
        }
      })
    ).subscribe({
      next: (response: any) => {
        console.log('Evento creato');
        this.isSubmitting = false;
        alert('Evento creato con successo');

        // Redirect to newly created event page
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Errore nella creazione evento:', err);
        this.isSubmitting = false;
      }
    });
  }

  buildLocationPayload(){
    const combinedPosition = this.selectedLat+","+this.selectedLng;
    return {
      nome: this.locationForm.get('nomeLocation')?.value,
      descrizione: "loremipsumdescrizionelocazioneevento",
      chiuso: this.locationForm.get('al_chiuso')?.value,
      position: combinedPosition
    }
  }

  saveLocation() {
    const token = this.authService.token;
    const payload : any = this.buildLocationPayload();
    this.locationService.createLocation(payload, token).subscribe({
      next: (response) => {
        console.log('Location creata con successo:', response);
        alert('Location salvata!');
        this.closePopup();
      },
      error: (err) => {
        console.error('Errore nel salvataggio della location:', err);
        alert('Errore nel salvataggio della location');
      }
    });
    this.closePopup()
  }

  protected readonly location = location;
}
