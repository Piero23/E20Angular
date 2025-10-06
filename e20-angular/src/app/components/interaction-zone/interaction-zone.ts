import { Component } from '@angular/core';

@Component({
  selector: 'app-interaction-zone',
  imports: [],
  templateUrl: './interaction-zone.html',
  styleUrl: './interaction-zone.css'
})
export class InteractionZone {
  navigateToWebsite(url: string): void {
    window.location.href = url;
  }
}
