import {Component} from '@angular/core';
import {MainContentZone} from './main-content-zone/main-content-zone';
import {EventsShowcase} from './events-showcase/events-showcase';

@Component({
  selector: 'app-home',
  imports: [
    MainContentZone,
    EventsShowcase,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  navigateToWebsite(url: string): void {
    window.location.href = url;
  }
}
