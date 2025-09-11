import {Component} from '@angular/core';
import {MainContentZone} from './main-content-zone/main-content-zone';
import {EventsShowcase} from './events-showcase/events-showcase';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    MainContentZone,
    EventsShowcase,
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  onButtonClick() {
    console.log('Button clicked!');
  }
}
