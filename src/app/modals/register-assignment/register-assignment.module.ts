import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterAssignmentPageRoutingModule } from './register-assignment-routing.module';

import { RegisterAssignmentPage } from './register-assignment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterAssignmentPageRoutingModule
  ],
  declarations: [RegisterAssignmentPage]
})
export class RegisterAssignmentPageModule {}
