import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { LoginComponent } from './admin/login/login.component';

// Definición de las rutas
export const routes: Routes = [
  // Ruta de inicio
  { path: '', redirectTo: 'client', pathMatch: 'full' }, // Asegúrate de tener un ClientComponent

  // Rutas de administración
  {
    path: 'admin',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () =>
          import('./admin/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
        children: [
          { path: '', redirectTo: 'home', pathMatch: 'full' },
          {
            path: 'home',
            loadComponent: () =>
              import('./admin/dashboard/home/home.component').then(
                (m) => m.HomeComponent
              ),
          },
          {
            path: 'category',
            loadComponent: () =>
              import('./admin/dashboard/category/category.component').then(
                (m) => m.CategoryComponent
              ),
          },
          { path: '**', redirectTo: 'home', pathMatch: 'full' },
        ],
        canActivate: [authGuard],
      },
      { path: '**', redirectTo: 'login', pathMatch: 'full' },
    ],
  },


  // Ruta comodín
  { path: '**', redirectTo: 'client', pathMatch: 'full' },
];
