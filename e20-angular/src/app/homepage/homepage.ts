import {Component} from '@angular/core';
import {BackgroundFlyers} from './background-flyers/background-flyers';
import {SiteLogo} from '../shared/site-logo/site-logo';
import {SearchBar} from '../shared/search-bar/search-bar';
import {EventCards} from './event-cards/event-cards';
import {AuthService} from '../services/auth-service';
import {EventoService} from '../services/evento-service';
import {Avatar} from '../shared/avatar/avatar';

@Component({
  selector: 'app-homepage',
  imports: [
    BackgroundFlyers,
    SiteLogo,
    SearchBar,
    Avatar,
    EventCards,
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {

  constructor(private auth: AuthService, public event: EventoService) {
  }

  public isLoggedIn() {
    return this.auth.isLoggedIn;
  }
  public login() {
    this.auth.login();
  }

  navigateToWebsite(url: string): void {
    window.location.href = url;
  }
}
