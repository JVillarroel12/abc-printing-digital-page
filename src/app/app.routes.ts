import { Routes } from '@angular/router';
import { DocsComponent } from './pages/docs/docs.component';
import { IndexComponent } from './pages/index/index.component';

export const routes: Routes = [
  {
    path: '',
    component: IndexComponent,
    title:
      'ABC Printing Digital | Impresión y Facturación Digital en Venezuela',
  },
  {
    path: 'documentation',
    component: DocsComponent,
    title: 'ABC Printing Digital | Documentación',
  },
  { path: '**', redirectTo: '' },
];
