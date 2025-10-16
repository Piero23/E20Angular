import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-crea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crea.html',
  styleUrls: ['./crea.css']
})
export class Crea implements OnInit {
  eventForm!: FormGroup;
  previewUrl: string | ArrayBuffer | null = null;

  @ViewChild('dateInput') dateRef!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      date: ['', Validators.required],
      time: ['', Validators.required],
      ageRestricted: [false],
      bNominativo: [false],
      location: ['', Validators.required],
      prezzo: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern(/^\d+(\.\d{1,2})?$/)
        ]
      ],
      riutilizzabile: [false],
      image: [null],
      posti: ['', [Validators.required, Validators.min(1)]],
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.eventForm.patchValue({ image: file });

    const reader = new FileReader();
    reader.onload = () => this.previewUrl = reader.result;
    reader.readAsDataURL(file);
  }

  getOrario(): string {
    const h = this.eventForm.get('hours')?.value ?? '';
    const m = this.eventForm.get('minutes')?.value ?? '';
    return (h === '' && m === '') ? '' : `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    const payload = {
      ...this.eventForm.value,
      time: this.getOrario()
    };

    console.log('Form valido, invio dati:', payload);
    // POST
  }
}
