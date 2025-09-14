import {Routes} from '@angular/router';
import {Home} from './components/home/home';
import {EventPage} from './components/event-page/event-page';

export const routes: Routes = [
  {path: '', component: Home},
  {path: 'evento', component: EventPage},
  {path: '**', redirectTo: ''}

];

