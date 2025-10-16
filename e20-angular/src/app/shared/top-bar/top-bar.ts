import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {SearchBar} from '../search-bar/search-bar';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-top-bar',
  imports: [
    RouterLink,
    SearchBar,
    NgOptimizedImage,
  ],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css'
})
export class TopBar {
  constructor(private router: Router) {
  }

  goToProfilePage(): void {
    this.router.navigate(['/profilo']);
  }
}
