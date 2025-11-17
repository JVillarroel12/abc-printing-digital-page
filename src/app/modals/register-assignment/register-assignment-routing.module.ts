import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterAssignmentPage } from './register-assignment.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterAssignmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterAssignmentPageRoutingModule {}
