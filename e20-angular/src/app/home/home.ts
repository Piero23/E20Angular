import { Component } from '@angular/core';
import {HeroContainer} from '../components/hero-container/hero-container';

@Component({
  selector: 'app-home',
  imports: [
    HeroContainer
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
