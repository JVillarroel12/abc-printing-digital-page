import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProcessAssignmentPageRoutingModule } from './process-assignment-routing.module';

import { ProcessAssignmentPage } from './process-assignment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProcessAssignmentPageRoutingModule
  ],
  declarations: [ProcessAssignmentPage]
})
export class ProcessAssignmentPageModule {}
