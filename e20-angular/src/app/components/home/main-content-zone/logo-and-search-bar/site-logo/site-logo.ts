import {Component} from '@angular/core';
import {NgOptimizedImage} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-site-logo',
  imports: [
    NgOptimizedImage,
    RouterLink
  ],
  templateUrl: './site-logo.html',
  styleUrl: './site-logo.css'
})
export class SiteLogo {

}
