import { Component } from '@angular/core';
import {HeroBackground} from './hero-background/hero-background';

@Component({
  selector: 'app-hero-container',
  imports: [
    HeroBackground
  ],
  templateUrl: './hero-container.html',
  styleUrl: './hero-container.css'
})
export class HeroContainer {

}
