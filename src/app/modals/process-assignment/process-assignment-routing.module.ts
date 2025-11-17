import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessAssignmentPage } from './process-assignment.page';

const routes: Routes = [
  {
    path: '',
    component: ProcessAssignmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessAssignmentPageRoutingModule {}
