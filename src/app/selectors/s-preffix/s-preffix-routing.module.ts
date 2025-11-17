import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SPreffixPage } from './s-preffix.page';

const routes: Routes = [
  {
    path: '',
    component: SPreffixPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SPreffixPageRoutingModule {}
