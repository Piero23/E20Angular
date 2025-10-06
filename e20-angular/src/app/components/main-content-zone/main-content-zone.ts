import { Component } from '@angular/core';
@Component({
  selector: 'app-main-content-zone',
  imports: [
  ],
  templateUrl: './main-content-zone.html',
  styleUrl: './main-content-zone.css'
})
export class MainContentZone {
  navigateToWebsite(url: string): void {
    window.location.href = url;
  }
}
