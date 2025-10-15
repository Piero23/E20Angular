import {Routes} from '@angular/router';
import {Homepage} from './homepage/homepage';
import {EventPage} from './components/event-page/event-page';
import {SearchBar} from './shared/search-bar/search-bar';
import {UserPage} from './components/user-page/user-page'

export const routes: Routes = [
  {path: '', component: Homepage},
  {
    path: 'evento/:id',
    component: EventPage
  },
  {path: 's', component: SearchBar},
  {
    path: 'utente/:username',
    component: UserPage
  },
  {path: '**', redirectTo: ''},
];

