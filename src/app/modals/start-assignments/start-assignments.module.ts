import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartAssignmentsPageRoutingModule } from './start-assignments-routing.module';

import { StartAssignmentsPage } from './start-assignments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartAssignmentsPageRoutingModule
  ],
  declarations: [StartAssignmentsPage]
})
export class StartAssignmentsPageModule {}
