import { Routes } from '@angular/router';

export const setting_routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./setting/setting').then((m) => m.Setting),
  },
];
