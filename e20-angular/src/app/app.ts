import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { TopBar } from './shared/top-bar/top-bar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopBar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('e20-angular');
}
