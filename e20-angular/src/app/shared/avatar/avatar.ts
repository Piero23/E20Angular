import {Component} from '@angular/core';
import {UtenteService} from '../../services/utente-service';
import {AuthService} from '../../services/auth-service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-avatar',
  imports: [],
  templateUrl: './avatar.html',
  styleUrl: './avatar.css',
})
export class Avatar {
  username: string | null | undefined = '';

  constructor(private userService: UtenteService, private authService: AuthService, private router: Router) {
    this.userService.getMe(this.authService.token).subscribe({
      next: (data) => {
        this.username = data.username;
        console.log(this.username)
      },
      error: (err) => {
        console.error('Failed to load user:', err);
      }
    });
  }

  public logout() {
    this.authService.logout();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }


  get avatar(): string {
    if (!this.username) return 'U';
    const trimmed = this.username.trim();
    return trimmed.length ? trimmed.charAt(0).toUpperCase() : 'U';
  }

  goToProfilePage(): void {
    this.router.navigate(['/profilo']);
  }
}
