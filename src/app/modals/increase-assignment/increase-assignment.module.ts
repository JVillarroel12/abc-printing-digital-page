import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncreaseAssignmentPageRoutingModule } from './increase-assignment-routing.module';

import { IncreaseAssignmentPage } from './increase-assignment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncreaseAssignmentPageRoutingModule
  ],
  declarations: [IncreaseAssignmentPage]
})
export class IncreaseAssignmentPageModule {}
