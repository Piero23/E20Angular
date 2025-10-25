import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-access-denied',
  imports: [
    RouterLink
  ],
  template: `
    <div class="container-fluid w-100 h-100 items-center justify-center text-center">
      <h1 class="text-3xl font-bold text-red-600 mb-4">Accesso vietato</h1>
      <p class="text-gray-700">Non hai i permessi per accedere a questa pagina.</p>
      <a routerLink="/" class="text-blue-500 mt-4">Torna alla home</a>
    </div>
  `,
})
export class AccessDenied {

}
