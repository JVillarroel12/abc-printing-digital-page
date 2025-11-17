import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncreaseAssignmentPage } from './increase-assignment.page';

const routes: Routes = [
  {
    path: '',
    component: IncreaseAssignmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncreaseAssignmentPageRoutingModule {}
