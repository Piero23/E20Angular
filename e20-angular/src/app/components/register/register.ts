import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService, UtenteRegistrationDTO} from '../../services/auth-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {

    if (this.authService.isLoggedIn) {
      alert('Devi effetuare il logout prima di poter registrare un nuovo account.');
      this.router.navigate(['/']);
    }
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      dataNascita: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const payload: UtenteRegistrationDTO = this.registerForm.value;

    this.authService.register(payload).subscribe({
      next: () => {
        alert('Registrazione avvenuta con successo!');
        this.registerForm.reset();
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Errore registrazione:', err);
        this.errorMessage = err.error || 'Errore durante la registrazione';
        this.isSubmitting = false;
      }
    });
  }
}
