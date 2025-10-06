import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { EventPage } from './components/event-page/event-page';
import { SearchBar } from './shared/search-bar/search-bar';
import { TopBar } from './shared/top-bar/top-bar';

export const routes: Routes = [
  { path: '', component: Homepage },
  {
    path: 'evento/:id',
    component: EventPage
  },
  { path: 's', component: SearchBar },
  { path: '**', redirectTo: '' },
];

