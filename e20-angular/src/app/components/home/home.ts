import { Component } from '@angular/core';
import {MainContent} from './main-content/main-content';
import {EventsShowcase} from './events-showcase/events-showcase';

@Component({
  selector: 'app-home',
  imports: [
    MainContent,
    EventsShowcase
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
