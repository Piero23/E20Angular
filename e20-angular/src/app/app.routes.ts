import {Routes} from '@angular/router';
import {Home} from './components/home/home';
import {EventPage} from './components/event-page/event-page';
import {Crea} from './components/crea/crea';
import {ProfiloEOrdini} from './components/profilo-e-ordini/profilo-e-ordini';
import {Checkout} from './components/checkout/checkout';
import {Utente} from './components/utente/utente';

export const routes: Routes = [
  {path: '', component: Home},
  {
    path: 'evento',
    children: [{
      path: ':id',
      children: [
        {path: '', component: EventPage},
        {path: 'checkout', component: Checkout}
      ]
    }]
  },
  {path: 'crea', component: Crea},
  {path: 'profilo', component: ProfiloEOrdini},
  {path: 'user', component: Utente},
  {path: '', component: Home},
  {path: '**', redirectTo: ''}
];

