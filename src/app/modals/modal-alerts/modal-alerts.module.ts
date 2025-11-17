import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalAlertsPageRoutingModule } from './modal-alerts-routing.module';

import { ModalAlertsPage } from './modal-alerts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalAlertsPageRoutingModule
  ],
  declarations: [ModalAlertsPage]
})
export class ModalAlertsPageModule {}
