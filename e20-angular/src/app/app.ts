import {Component, signal} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {Footer} from './components/footer/footer';
import {TopBar} from './shared/top-bar/top-bar';
import {OAuthModule} from 'angular-oauth2-oidc';
import {filter} from 'rxjs';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TopBar, Footer, OAuthModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  showTopBar = true;
  protected readonly title = signal('e20-angular');

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects.split('?')[0];
        this.showTopBar = url !== '/';
      });
  }
}
