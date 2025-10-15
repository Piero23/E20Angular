import {Routes} from '@angular/router';
import {Homepage} from './homepage/homepage';
import {EventPage} from './components/event-page/event-page';
import {UserPage} from './components/user-page/user-page'
import {Crea} from './components/crea/crea';
import {ProfiloEOrdini} from './components/profilo-e-ordini/profilo-e-ordini';

export const routes: Routes = [
  {path: '', component: Homepage},
  {
    path: 'evento/:id',
    component: EventPage
  },
  {
    path: 'utente/:username',
    component: UserPage
  },
  {path: 'crea', component: Crea},
  {path: 'profilo', component: ProfiloEOrdini},
  {path: '**', redirectTo: ''}

];

