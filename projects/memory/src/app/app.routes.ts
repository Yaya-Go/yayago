import { Routes } from '@angular/router';
import { MemoryListComponent } from './memory-list/memory-list.component';
import { MemoryDetailComponent } from './memory-detail/memory-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: MemoryListComponent,
  },
  {
    path: 'new',
    component: MemoryDetailComponent,
  },
  {
    path: ':id',
    component: MemoryDetailComponent,
  },
];
