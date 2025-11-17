import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateSerieChildPage } from './create-serie-child.page';

const routes: Routes = [
  {
    path: '',
    component: CreateSerieChildPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateSerieChildPageRoutingModule {}
