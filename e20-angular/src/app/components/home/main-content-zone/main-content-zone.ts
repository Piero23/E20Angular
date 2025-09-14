import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {LogoAndSearchBar} from './logo-and-search-bar/logo-and-search-bar';

@Component({
  selector: 'app-main-content-zone',
  imports: [
    NgOptimizedImage,
    LogoAndSearchBar
  ],
  templateUrl: './main-content-zone.html',
  styleUrl: './main-content-zone.css'
})
export class MainContentZone {
}
