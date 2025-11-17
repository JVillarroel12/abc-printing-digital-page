import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SNumeroSeriePage } from './s-numero-serie.page';

const routes: Routes = [
  {
    path: '',
    component: SNumeroSeriePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SNumeroSeriePageRoutingModule {}
