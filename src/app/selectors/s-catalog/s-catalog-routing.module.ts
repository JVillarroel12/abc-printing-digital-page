import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SCatalogPage } from './s-catalog.page';

const routes: Routes = [
  {
    path: '',
    component: SCatalogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SCatalogPageRoutingModule {}
