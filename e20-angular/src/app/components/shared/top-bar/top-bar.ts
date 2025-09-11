import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';
import {SearchBar} from '../search-bar/search-bar';

@Component({
  selector: 'app-top-bar',
  imports: [
    NgOptimizedImage,
    SearchBar,
    RouterLink,

  ],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css'
})
export class TopBar {
  onUserIconClick() {
    console.log('click');
  }

}
