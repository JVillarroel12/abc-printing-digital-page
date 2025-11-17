import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateSeriePage } from './create-serie.page';

const routes: Routes = [
  {
    path: '',
    component: CreateSeriePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateSeriePageRoutingModule {}
