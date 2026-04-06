import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout').then((m) => m.MainLayout),
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'flashcard',
        loadChildren: () =>
          import('./features/flashcard/flashcard.routes').then((r) => r.flashcard_routes),
      },
      {
        path: 'setting',
        loadChildren: () =>
          import('./features/settings/setting.routes').then((r) => r.setting_routes),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
