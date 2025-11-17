import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalAlertsPage } from './modal-alerts.page';

const routes: Routes = [
  {
    path: '',
    component: ModalAlertsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalAlertsPageRoutingModule {}
