import { Component } from '@angular/core';
import { SiteLogo } from './site-logo/site-logo';
import { EventoSearch } from '../../../shared/search-bar/search-bar';


@Component({
  selector: 'app-logo-and-search-bar',
  imports: [
    SiteLogo,
    EventoSearch
  ],
  templateUrl: './logo-and-search-bar.html',
  styleUrl: './logo-and-search-bar.css'
})
export class LogoAndSearchBar {

}
