import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Home} from './components/home/home';
import {Footer} from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Home, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('e20-angular');
}
