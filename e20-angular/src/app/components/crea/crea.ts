import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { EventoService } from '../../services/evento-service';
@Component({
  selector: 'app-crea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crea.html',
  styleUrls: ['./crea.css']
})

export class Crea {
  form: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private eventService: EventoService,
  ) {
    this.form = this.fb.group({});
  }

  onSubmit(): void {
    const token = this.authService.token;

    this.eventService.createEventJson(token);
  }
}
