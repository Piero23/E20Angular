import { Component } from '@angular/core';
import { BackgroundFlyers } from './background-flyers/background-flyers';
import { SiteLogo } from '../shared/site-logo/site-logo';
import { SearchBar } from '../shared/search-bar/search-bar';
import { EventCards } from './event-cards/event-cards';
import { AuthService } from '../services/auth-service';
import { UtenteService } from '../services/utente-service';

@Component({
  selector: 'app-homepage',
  imports: [
    BackgroundFlyers,
    SiteLogo,
    SearchBar,
    EventCards,
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {

  constructor(public auth: AuthService) {
  }

  navigateToWebsite(url: string): void {
    window.location.href = url;
  }
}
