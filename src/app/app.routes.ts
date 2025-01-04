import { loadRemoteModule } from '@angular-architects/native-federation';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'mfe-user',
        loadComponent: () => loadRemoteModule('mfe-user', './Component').then((m) => m.AppComponent),
      },
];
