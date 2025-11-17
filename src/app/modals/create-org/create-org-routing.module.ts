import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateOrgPage } from './create-org.page';

const routes: Routes = [
  {
    path: '',
    component: CreateOrgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateOrgPageRoutingModule {}
