import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'client', pathMatch: 'full' },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes') },
  { path: '**', redirectTo: 'client', pathMatch: 'full' },
];
