import { Component } from '@angular/core';
import { BackgroundFlyers } from './background-flyers/background-flyers';
import { SiteLogo } from '../shared/site-logo/site-logo';
import { SearchBar } from '../shared/search-bar/search-bar';

@Component({
  selector: 'app-homepage',
  imports: [
    BackgroundFlyers,
    SiteLogo,
    SearchBar
  ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {
  navigateToWebsite(url: string): void {
    window.location.href = url;
  }
}
