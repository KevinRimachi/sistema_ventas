// dashboard.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CategoryComponent } from './category/category.component';

export const DashboardRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'category',
    loadComponent: () =>
      import('./category/category.component').then((m) => m.CategoryComponent),
  },
  { path: '**', redirectTo: 'home', pathMatch: 'full' },
];
