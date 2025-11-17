import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateSequencePage } from './create-sequence.page';

const routes: Routes = [
  {
    path: '',
    component: CreateSequencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateSequencePageRoutingModule {}
