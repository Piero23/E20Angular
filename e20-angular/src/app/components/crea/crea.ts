import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { EventoService } from '../../services/evento-service';
import { UtenteDto, UtenteService } from '../../services/utente-service';
import { LocationDto, LocationService } from '../../services/location-service';
import { switchMap } from 'rxjs';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private eventService: EventoService,
    private userService: UtenteService,
    private locationService: LocationService
  ) {
    this.form = this.fb.group({});
  }


  ngOnInit(): void {

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
    })

  }

  buildPayload(locationId: number) {
    const dateValue = this.form.get('data')?.value;
    const timeValue = this.form.get('ora')?.value;
    const combinedDateTime = new Date(`${dateValue}T${timeValue}:00`)
    return {
      ...this.form.value,
      organizzatore: this.user_id,
      locationId,
      data: combinedDateTime,
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.isSubmitting = true;
    const token = this.authService.token;
    const locationName = this.form.get('location')?.value;

    this.locationService.getLocationByName(locationName, token).pipe(
      switchMap((location: LocationDto) => {
        const payload = this.buildPayload(location.id);
        return this.eventService.createEvent(payload, token);
      })
    ).subscribe({
      next: (response) => {
        console.log('Evento creato:', response);
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Errore nella creazione evento:', err);
        this.isSubmitting = false;
      }
    });
  }
}
