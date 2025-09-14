import {Component} from '@angular/core';
import {TopBar} from '../shared/top-bar/top-bar';
import {NgOptimizedImage} from '@angular/common';
@Component({
  selector: 'app-event-page',
  imports: [
    TopBar,
    NgOptimizedImage,
  ],
  templateUrl: './event-page.html',
  styleUrl: './event-page.css'
})
export class EventPage {

  toggleFavorite() {

  }

  toggleNotification() {
  }
}
