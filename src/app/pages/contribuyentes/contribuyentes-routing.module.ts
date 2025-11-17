import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContribuyentesPage } from './contribuyentes.page';

const routes: Routes = [
  {
    path: '',
    component: ContribuyentesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContribuyentesPageRoutingModule {}
