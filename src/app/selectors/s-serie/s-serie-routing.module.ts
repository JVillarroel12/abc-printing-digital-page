import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SSeriePage } from './s-serie.page';

const routes: Routes = [
  {
    path: '',
    component: SSeriePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SSeriePageRoutingModule {}
