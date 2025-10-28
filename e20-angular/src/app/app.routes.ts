import {Routes} from '@angular/router';
import {Homepage} from './homepage/homepage';
import {EventPage} from './components/event-page/event-page';
import {UserPage} from './components/user-page/user-page'
import {Crea} from './components/crea/crea';
import {ProfiloEOrdini} from './components/profilo-e-ordinii/profilo-e-ordini';
import {roleGuard} from './guards/role-guard';
import {AccessDenied} from './shared/access-denied/access-denied';
import {Checkout} from './components/checkout/checkout';
import {Register} from './components/register/register';

export const routes: Routes = [
  { path: '', component: Homepage },
  {
    path: 'evento/:id',
    component: EventPage
  },
  {
    path: 'evento/:id/checkout',
    component: Checkout
  },
  {
    path: 'utente/:username',
    component: UserPage
  },
  { path: 'access-denied', component: AccessDenied },
  { path: 'crea', component: Crea, canActivate: [roleGuard] },
  { path: 'profilo', component: ProfiloEOrdini },
  { path: 'register', component: Register },
  { path: '**', redirectTo: '' }

];

