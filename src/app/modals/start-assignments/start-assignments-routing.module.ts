import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartAssignmentsPage } from './start-assignments.page';

const routes: Routes = [
  {
    path: '',
    component: StartAssignmentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartAssignmentsPageRoutingModule {}
