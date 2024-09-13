import { Routes } from '@angular/router';
import { PmListComponent } from './pm-list/pm-list.component';
import { PmDetailComponent } from './pm-detail/pm-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: PmListComponent,
  },
  {
    path: ':id',
    component: PmDetailComponent,
  },
];
