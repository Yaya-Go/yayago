import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        component: DashboardComponent,
      },
      {
        path: 'todo',
        loadComponent: () =>
          import('../../../projects/todo/src/app/app.component').then(
            (c) => c.AppComponent
          ),
      },
    ],
  },
];
