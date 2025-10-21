import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { EventPage } from './components/event-page/event-page';
import { UserPage } from './components/user-page/user-page'
import { Crea } from './components/crea/crea';
import { ProfiloEOrdini } from './components/profilo-e-ordini/profilo-e-ordini';
import { roleGuard } from './guards/role-guard';
import { AccessDenied } from './shared/access-denied/access-denied';

export const routes: Routes = [
  { path: '', component: Homepage },
  {
    path: 'evento/:id',
    component: EventPage
  },
  {
    path: 'utente/:username',
    component: UserPage
  },
  { path: 'access-denied', component: AccessDenied },
  { path: 'crea', component: Crea, canActivate: [roleGuard] },
  { path: 'profilo', component: ProfiloEOrdini },
  { path: '**', redirectTo: '' }

];

