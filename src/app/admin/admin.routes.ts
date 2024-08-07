import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

export const AdminRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.DashboardRoutes),
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
];

