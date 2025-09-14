import {Component} from '@angular/core';
import {SiteLogo} from './site-logo/site-logo';
import {SearchBar} from '../../../shared/search-bar/search-bar';


@Component({
  selector: 'app-logo-and-search-bar',
  imports: [
    SiteLogo,
    SearchBar
  ],
  templateUrl: './logo-and-search-bar.html',
  styleUrl: './logo-and-search-bar.css'
})
export class LogoAndSearchBar {

}
