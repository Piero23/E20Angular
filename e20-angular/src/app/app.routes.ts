import {Routes} from '@angular/router';
import {Home} from './components/home/home';
import {EventPage} from './components/event-page/event-page';
import {Crea} from './components/crea/crea';
import {ProfiloEOrdini} from './components/profilo-e-ordini/profilo-e-ordini';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'evento', component: EventPage },
  { path: 'crea', component: Crea },
  { path: 'profilo', component: ProfiloEOrdini },
  { path: '**', redirectTo: '' }

];

