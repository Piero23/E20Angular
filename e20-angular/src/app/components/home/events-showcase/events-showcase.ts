import { Component } from '@angular/core';
import {EventsBar1} from './events-bar-1/events-bar-1';

@Component({
  selector: 'app-events-showcase',
  imports: [
    EventsBar1
  ],
  templateUrl: './events-showcase.html',
  styleUrl: './events-showcase.css'
})
export class EventsShowcase {

}
